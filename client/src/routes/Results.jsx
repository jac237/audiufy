/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ellipsis from 'text-ellipsis';
import approx from 'approximate-number';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { USER_SEARCH } from '../graphql';
import Loader from 'react-loader-spinner';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTopArtists,
  selectSearchResults,
  selectSelectedArtists,
  setTopArtists,
  setClearResults,
  setAddResult,
  setSelectedArtists,
} from '../features/artists/artistsSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: 'auto',
    backgroundColor: theme.palette.background.paper,
    transition: 'transform .5s ease-in-out',
    padding: 0,
    marginBottom: 50,
  },
  nested: {
    borderBottom: '1px solid whitesmoke',
    paddingLeft: theme.spacing(4),
    background: 'whitesmoke',
    '&:hover': {
      background: 'white',
    },
  },
  listItem: {
    borderRadius: 4,
    borderBottom: '2px solid whitesmoke',
    transition: 'transform .2s ease-in-out',

    '&:hover': {
      border: 'none',
      backgroundColor: 'white',
      transform: 'scale(0.99)',
      boxShadow:
        'rgb(0 0 0 / 8%) 0px 20px 40px -16px, rgb(0 0 0 / 8%) 0px 20px 10px -10px',
      zIndex: 1,
    },
  },
}));

function Results() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const topArtists = useSelector(selectTopArtists);
  const searchResults = useSelector(selectSearchResults);
  const selectedArtists = useSelector(selectSelectedArtists);
  const [artists, setArtists] = useState([]);
  console.log('artists:', artists);

  useEffect(() => {
    if (selectedArtists.length === 0) return history.push('/search');

    dispatch(setClearResults());
    setArtists([]);

    topArtists.forEach((artist) => {
      if (selectedArtists.includes(artist.id)) {
        setArtists((prevArtists) => [
          ...prevArtists,
          {
            id: artist.id,
            artist: artist,
          },
        ]);
      }
    });
  }, []);

  const handleBackEvent = () => {
    history.goBack();
  };

  return (
    <Container maxWidth="lg" disableGutters>
      <TableHeader>
        <IconButton onClick={handleBackEvent}>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>

        <TextContainer>
          <HeaderTitle>Results</HeaderTitle>
          <HeaderSubtitle>
            Select or Tap on a user for more information
          </HeaderSubtitle>
        </TextContainer>
      </TableHeader>

      <Loader
        type="Bars"
        color="#3f3f3f"
        height={100}
        width={100}
        timeout={3000}
        style={{
          textAlign: 'center',
          padding: '50px',
        }}
      />

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
      >
        {artists.map((row) => (
          <CollapseListItem row={row} key={row.id} />
        ))}
      </List>
    </Container>
  );
}

export default Results;

const CollapseListItem = (props) => {
  const classes = useStyles();
  const { row } = props;
  const [open, setOpen] = useState(false);
  const { loading, error, data: usersResults } = useQuery(USER_SEARCH, {
    variables: { query: row.artist.name },
  });

  const handleClick = () => {
    setOpen(!open);
  };

  if (loading) console.log(`Loading results for: ${row.artist.name}`);
  if (error) console.log(`${row.artist.name}: ${error.message}`);
  if (usersResults) console.log(usersResults);
  if (
    !usersResults?.getUsersBySearch ||
    usersResults?.getUsersBySearch?.length === 0
  )
    return null;

  return (
    <>
      <div>
        <ListItem button onClick={handleClick} className={classes.listItem}>
          <ListItemAvatar>
            <Avatar alt="" src={row.artist?.images[0].url} />
          </ListItemAvatar>

          <ListItemText
            primary={
              <Typography
                variant="inherit"
                noWrap
                style={{ fontWeight: 'bold' }}
              >
                {row.artist.name}
              </Typography>
            }
            secondary={
              row.artist.genres.length > 0 ? (
                <Typography color="textSecondary" variant="subtitle2" noWrap>
                  {row.artist.genres
                    .slice(0, 3)
                    .reduce(
                      (accumulator, currentValue) =>
                        accumulator + ', ' + currentValue
                    )}
                </Typography>
              ) : null
            }
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={open} timeout="auto">
          <List component="div" disablePadding dense>
            {usersResults.getUsersBySearch?.map((artist) => (
              <ListRowItem artist={artist} key={artist.id} />
            ))}
          </List>
        </Collapse>
      </div>
    </>
  );
};

const ListRowItem = (props) => {
  const classes = useStyles();
  const { artist } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpen = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <ListItem onClick={handleOpen} className={classes.nested} button>
        <ListItemAvatar>
          <Avatar
            src={artist.profile_picture ? artist.profile_picture.x150 : null}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography
              variant="inherit"
              noWrap
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 'bold',
              }}
            >
              {artist.name}
              {artist.is_verified ? (
                <CheckCircleIcon
                  style={{ paddingLeft: 4, fontSize: 18, color: '#cc0fe0' }}
                />
              ) : null}
            </Typography>
          }
          secondary={
            <Typography
              color="textSecondary"
              variant="subtitle2"
              noWrap
            >{`@${artist.handle}`}</Typography>
          }
        />
      </ListItem>
      <UserModal
        user={artist}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </>
  );
};

const UserModal = (props) => {
  const { user, isModalVisible, setIsModalVisible } = props;
  const {
    id,
    album_count,
    bio,
    cover_photo,
    followee_count,
    follower_count,
    handle,
    is_verified,
    location,
    name,
    playlist_count,
    profile_picture,
    repost_count,
    track_count,
  } = user;

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Dialog
        open={isModalVisible}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          style={{
            maxWidth: 600,
            padding: 12,
            overflowX: 'hidden',
            overflowY: 'auto',
          }}
        >
          <img
            alt={name}
            src={
              cover_photo
                ? cover_photo.x2000
                : 'https://i.imgur.com/VoXbpjJ.jpg'
            }
            width="100%"
            height={150}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://i.imgur.com/VoXbpjJ.jpg';
            }}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
          <Avatar
            src={profile_picture ? profile_picture.x150 : null}
            style={{
              width: 150,
              height: 150,
              margin: 'auto',
              marginTop: '-80px',
              border: '6px solid white',
            }}
          />

          <Typography noWrap variant="inherit" component="h2" align="center">
            {name}
            {is_verified ? (
              <CheckCircleIcon
                style={{
                  paddingLeft: 4,
                  fontSize: 20,
                  color: '#cc0fe0',
                }}
              />
            ) : null}
          </Typography>

          <Typography
            noWrap
            gutterBottom
            color="textSecondary"
            variant="subtitle1"
            align="center"
          >
            @{handle}
          </Typography>

          <Grid container justify="center" spacing={2}>
            <Grid
              item
              container
              justify="center"
              spacing={2}
              className="user-statistics"
            >
              <Grid item>
                <Typography align="center" variant="inherit" component="h2">
                  {track_count}
                </Typography>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Tracks
                </Typography>
              </Grid>
              <Grid item>
                <Typography align="center" variant="inherit" component="h2">
                  {approx(follower_count)}
                </Typography>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Followers
                </Typography>
              </Grid>
              <Grid item>
                <Typography align="center" variant="inherit" component="h2">
                  {followee_count}
                </Typography>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  Following
                </Typography>
              </Grid>
            </Grid>

            <Grid item container justify="center">
              <Typography
                align="center"
                color="textSecondary"
                variant="subtitle2"
              >
                {bio}
              </Typography>
            </Grid>

            <Grid item container justify="center">
              <AudiusButton
                href={`https://audius.co/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  alt={`${name} | Audius`}
                  title={`${name} | Audius`}
                  src="https://i.imgur.com/1DzMfgs.png"
                  width={100}
                />
              </AudiusButton>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AudiusButton = styled.a`
  display: flex;
  width: 120px;
  padding: 8px 4px;
  background: whitesmoke;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  :hover {
    opacity: 0.8;
  }
`;

const TableHeader = styled.div`
  display: flex;
  margin: 10px 0px;
  align-items: center;
`;

const TextContainer = styled.div`
  display: inline-block;
  margin-left: 10px;
`;

const HeaderTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const HeaderSubtitle = styled.div`
  font-size: 1rem;
  color: gray;
`;
