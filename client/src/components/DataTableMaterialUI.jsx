import React, { useState } from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import { DataGrid, GridOverlay } from '@material-ui/data-grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const StyledButton = styled(Button)`
  text-transform: capitalize;
  transition-timing-function: ease-in;
`;

const DarkButton = styled(StyledButton)`
  background: black;

  &:hover {
    opacity: 0.8;
    background: black;
  }
`;

const StyledChip = styled(Chip)`
  border-radius: 5px;
  padding: 0px;
`;

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

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
      <DarkButton
        variant="contained"
        color="primary"
        size="small"
        onClick={handleOpen}
        disableElevation
      >
        View
      </DarkButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent style={{ minWidth: 300, padding: 30 }}>
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

const columns = [
  {
    field: 'images',
    headerAlign: 'center',
    headerName: 'Avatar',
    cellClassName: 'avatar-column',
    description: 'Artist profile image',
    sortable: false,
    width: 100,
    renderCell: (params) => {
      const name = params.getValue('name');
      const [image] = params.value; // get the first image object
      return <Avatar alt={name} title={name} src={image.url} />;
    },
  },
  { field: 'name', headerName: 'Name', width: 130 },
  {
    field: 'genres',
    headerName: 'Profile',
    renderCell: (params) => (
      <UserModal
        style={{ paddingBottom: 20 }}
        name={params.getValue('name')}
        src={params.getValue('images')[0].url}
        genres={params.value}
        href={params.getValue('external_urls').spotify}
      />
    ),
  },
];

export default function DataTable(props) {
  const { loading, rows, accessToken, refreshToken } = props;
  const [selectionModel, setSelectionModel] = useState([]);

  const handleSearchAudius = () => {
    console.log('search button pressed!:', selectionModel);
  };

  const handleLoadMoreArtists = () => {
    console.log('load button pressed!');
    // console.log(
    //   followedArtists.artists.items.filter((item) => {
    //     // console.log(item);
    //     return item.id in selectionModel;
    //   })
    // );
  };

  return (
    <div>
      <Grid
        container
        style={{ padding: '20px 0px' }}
        spacing={2}
        justify="space-between"
      >
        <Grid item>
          <DarkButton
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleSearchAudius}
            disabled={selectionModel.length === 0 ? true : false}
          >
            Search on Audius
          </DarkButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            disableElevation
            onClick={handleLoadMoreArtists}
          >
            Load more artists
          </StyledButton>
        </Grid>
      </Grid>
      <div
        style={{
          height: 600,
          width: '100%',
        }}
      >
        <DataGrid
          loading={loading}
          pageSize={25}
          rows={rows}
          columns={columns}
          selectionModel={selectionModel}
          getRowId={(row) => row.name}
          components={{
            loadingOverlay: CustomLoadingOverlay,
          }}
          onSelectionModelChange={(newSelection) => {
            console.log(newSelection.selectionModel);
            setSelectionModel(newSelection.selectionModel);
          }}
          onRowSelected={(newSelection) => {
            console.log(newSelection);
            // setSelectionModel(newSelection.selectionModel);
          }}
          checkboxSelection
          disableColumnMenu
        />
      </div>
    </div>
  );
}
