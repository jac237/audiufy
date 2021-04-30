/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

import styled from 'styled-components';
import { DataGrid } from '@material-ui/data-grid';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTopArtists,
  selectSelectedArtists,
  setTopArtists,
  setSelectedArtists,
} from '../features/artists/artistsSlice';

function Search() {
  let query = useQuery();
  const dispatch = useDispatch();
  const history = useHistory();
  const topArtists = useSelector(selectTopArtists);
  const selectedArtists = useSelector(selectSelectedArtists);
  // access token
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, seRefreshToken] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const accessToken = query.get('access_token');
    const refreshToken = query.get('refresh_token');
    const error = query.get('error');

    if (!accessToken) return history.push('/');

    setAccessToken(accessToken);
    seRefreshToken(refreshToken);
    setError(error);

    if (!error) {
      fetch(
        `https://audiufy-api.vercel.app/api/v1/spotify/topArtists?access_token=${accessToken}`
      )
        .then((r) => r.json())
        .then((j) => j.body)
        .then((artists) => {
          console.log('result:', artists);
          if (!artists || artists.error) {
            return history.push('/');
          }

          dispatch(
            setTopArtists({
              topArtists: artists.items,
            })
          );
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSearchAudius = () => {
    history.push('/results');
  };

  return (
    <Container maxWidth="lg">
      <TableHeader
        container
        justify="space-between"
        alignItems="center"
        spacing={1}
      >
        <TextContainer item xs={12} md="auto">
          <HeaderTitle>Your top 50 artists</HeaderTitle>
          <HeaderSubtitle>
            Select the artist you wants to search on Audius
          </HeaderSubtitle>
        </TextContainer>

        <Grid item xs={12} md="auto">
          <SearchButton
            variant="contained"
            color="primary"
            onClick={handleSearchAudius}
            disabled={selectedArtists.length > 0 ? false : true}
          >
            Search on
            <img
              alt="Audius"
              src="https://i.imgur.com/UVSBxyJ.png"
              width={20}
              height={20}
            />
          </SearchButton>
        </Grid>
      </TableHeader>

      <TableContainer>
        <ThemeProvider theme={theme}>
          <DataGrid
            autoHeight
            rows={topArtists}
            columns={columns}
            selectionModel={selectedArtists}
            getRowId={(row) => row.id}
            onSelectionModelChange={(newSelection) => {
              console.log(newSelection.selectionModel);
              dispatch(setSelectedArtists(newSelection.selectionModel));
            }}
            checkboxSelection
            disableColumnMenu
          />
        </ThemeProvider>
      </TableContainer>
    </Container>
  );
}

export default Search;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[800],
    },
  },
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const columns = [
  {
    field: 'images',
    headerAlign: 'center',
    headerName: 'Avatar',
    cellClassName: 'avatar-column',
    align: 'center',
    disableClickEventBubbling: true,
    description: 'Artist profile image',
    sortable: false,
    width: 100,
    renderCell: (params) => {
      return (
        <UserModal
          style={{ paddingBottom: 20 }}
          name={params.getValue('name')}
          src={params.getValue('images')[0].url}
          genres={params.row.genres}
          href={params.row.external_urls.spotify}
        />
      );
    },
  },
  { field: 'name', headerName: 'Name', flex: 1 },
];

const UserModal = (props) => {
  const { name, src, genres, href } = props;
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Avatar
        onClick={handleOpen}
        alt={name}
        title={name}
        src={src}
        style={{ cursor: 'pointer' }}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ padding: 30 }}>
          <Avatar
            src={src}
            style={{ width: 200, height: 200, margin: 'auto' }}
          />

          <Typography
            variant="inherit"
            component="h1"
            align="center"
            gutterBottom
          >
            {name}
          </Typography>

          <Grid container spacing={1} justify="center">
            {genres.map((label, index) => (
              <Grid item key={index}>
                <StyledChip label={label} />
              </Grid>
            ))}
          </Grid>

          <Grid container justify="center" style={{ marginTop: 20 }}>
            <Grid item>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <img
                  alt="Spotify"
                  title="Spotify"
                  src="https://i.imgur.com/kHCZ1C6.png"
                  width={100}
                />
              </a>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TableContainer = styled.div`
  width: 100%;
`;

const TableHeader = styled(Grid)`
  width: 100%;
  padding: 10px 0px;
  margin: 0;
`;

const TextContainer = styled(Grid)``;

const SearchButton = styled(Button)`
  display: flex;
  width: 100%;
  align-items: center;
  min-height: 30px;
  padding: 10px;
  border-radius: 4px;
  background: black;
  color: white;
  font-weight: bold;
  text-transform: none;
  text-decoration: none;

  img {
    padding-left: 5px;
  }

  &:hover {
    background: black;
    opacity: 0.8;
  }
`;

const HeaderTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: capitalize;
`;

const HeaderSubtitle = styled.div`
  font-size: 1rem;
  color: gray;
`;

const StyledChip = styled(Chip)`
  border-radius: 5px;
  padding: 0px;
`;
