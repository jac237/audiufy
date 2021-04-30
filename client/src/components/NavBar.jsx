/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import GitHubIcon from '@material-ui/icons/GitHub';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const useStyles = makeStyles((theme) => ({
  root: {},
  menuButton: {
    marginRight: theme.spacing(0.5),
  },
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
    letterSpacing: 3,
    color: 'white',
    textDecoration: 'none',
    fontWeight: 700,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  sectionMobile: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ background: 'transparent' }}>
      <NavContainer>
        <div style={{ flexGrow: 1 }}>
          <Typography
            variant="inherit"
            component={Link}
            to="/"
            className={classes.title}
          >
            Audiufy
          </Typography>
        </div>

        <div className={classes.sectionDesktop}>
          <IconButton
            color="inherit"
            href="https://audiustree.vercel.app"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img alt="" src="https://i.imgur.com/rH1MkzR.png" height="23px" />
          </IconButton>

          <IconButton
            color="inherit"
            href="https://github.com/jac237/audiufy"
            target="_blank"
            rel="noreferrer noopener"
          >
            <GitHubIcon />
          </IconButton>

          <Avatar
            src="https://i.imgur.com/F57gbS9.png"
            style={{ marginLeft: 10 }}
          />
        </div>

        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="nav-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
          >
            <MenuItem
              component="a"
              href="https://audiustree.vercel.app"
              target="_blank"
              rel="noreferrer noopener"
            >
              <ListItemIcon style={{ minWidth: 50 }}>
                <img
                  alt=""
                  src="https://i.imgur.com/rGCPLa8.png"
                  height="23px"
                />
              </ListItemIcon>
              AudiusTree
            </MenuItem>
            <MenuItem
              component="a"
              href="https://github.com/jac237/audiufy"
              target="_blank"
              rel="noreferrer noopener"
            >
              <ListItemIcon style={{ minWidth: 50 }}>
                <GitHubIcon style={{ color: 'black' }} />
              </ListItemIcon>
              GitHub
            </MenuItem>
          </Menu>
        </div>
      </NavContainer>
    </AppBar>
  );
}

const NavContainer = styled(Toolbar)`
  display: flex;
  background: rgb(35 35 35);
  color: whitesmoke;
  align-items: center;
`;
