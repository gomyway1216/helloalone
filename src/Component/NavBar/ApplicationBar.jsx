import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, ListItem, 
  List, ListItemText, Drawer, MenuItem, Menu } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider';
import { Alert, AlertTitle } from '@material-ui/lab';
import './application-bar.scss';
import { getUser } from '../../storage/tokenService';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  }
}));

const ApplicationBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [error, setError] = useState('');
  const { currentUser, signOut } = useAuth();
  const user = getUser();

  const handleSignOut = async () => {
    setError('');
    try {
      await signOut();
      setAnchorEl(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSignIn = () => {
    history.push('/signin');
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    history.push('/mypage');
  };

  const handlePageNameClick = () => {
    history.push('/');
  };

  const toggleDrawer = (open) => e => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const SideList = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button key={'Blog'} onClick={() => history.push('/blog')} >
          <ListItemText primary={'Blog'} />
        </ListItem>
        <ListItem button key={'Ranking'} onClick={() => history.push('/ranking')} >
          <ListItemText primary={'Ranking'} />
        </ListItem>
        {(currentUser && currentUser.uid === process.env.REACT_APP_DEFAULT_USER) &&
          <ListItem button key={'Create Blog'} onClick={() => history.push('/edit-blog-item')} >
            <ListItemText primary={'Create Blog'} />
          </ListItem>
        }
        {currentUser && 
          <ListItem button key={'Task'} onClick={() => history.push('/task')} >
            <ListItemText primary={'Task'} />
          </ListItem>
        }
        <ListItem button key={'Chat'} onClick={() => history.push('/chat')} >
          <ListItemText primary={'Chat'} />
        </ListItem>
        <ListItem button key={'Mini Project'} onClick={() => history.push('/mini-project')} >
          <ListItemText primary={'Mini Project'} />
        </ListItem>
        <ListItem button key={'Anime/Manga'} onClick={() => history.push('/anime')} >
          <ListItemText primary={'Anime/Manga'} />
        </ListItem> 
        {(currentUser && currentUser.uid === process.env.REACT_APP_DEFAULT_USER) && 
          <ListItem button key={'Create Anime/Manga'} onClick={() => history.push('/edit-anime-item')} >
            <ListItemText primary={'Create Anime/Manga'} />
          </ListItem>
        }
        <ListItem button key={'Voice Actor'} onClick={() => history.push('/voice-actor')} >
          <ListItemText primary={'Voice Actor'} />
        </ListItem> 
        {(currentUser && currentUser.uid === process.env.REACT_APP_DEFAULT_USER) && 
          <ListItem button key={'Add Voice Actor'} onClick={() => history.push('/edit-voice-actor')} >
            <ListItemText primary={'Add Voice Actor'} />
          </ListItem>
        }
        <ListItem button key={'Anime Character'} onClick={() => history.push('/anime-character')} >
          <ListItemText primary={'Anime Character'} />
        </ListItem> 
        {(currentUser && currentUser.uid === process.env.REACT_APP_DEFAULT_USER) && 
          <ListItem button key={'Add Anime Character'} onClick={() => history.push('/edit-anime-character')} >
            <ListItemText primary={'Add Anime Character'} />
          </ListItem>
        }
        {(currentUser && currentUser.uid === process.env.REACT_APP_DEFAULT_USER) && 
          <ListItem button key={'Add Anime Tag'} onClick={() => history.push('/add-tag')} >
            <ListItemText primary={'Add Anime Tag'} />
          </ListItem>
        }
        {user && 
          <ListItem button key={'My dictionary'} onClick={() => history.push('/my-dictionary')} >
            <ListItemText primary={'My Dictionary'} />
          </ListItem>
        }
        {user && 
          <ListItem button key={'Add dictionary'} onClick={() => history.push('/my-dictionary/add')} >
            <ListItemText primary={'Add Dictionary'} />
          </ListItem>
        }
      </List>
    </div>
  );

  

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <div className="page-name" onClick={handlePageNameClick}>
            Hello Alone!
          </div>
          <div className="account-button-wrapper">
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              {!currentUser && <MenuItem onClick={handleSignIn}>Sign In</MenuItem>}
              {currentUser && <MenuItem >{currentUser.userName ? currentUser.userName : currentUser.email.split('@')[0]}</MenuItem>}
              {currentUser && <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>}
              {currentUser && <MenuItem onClick={handleMyAccount}>My Page</MenuItem>}
            </Menu>
            {error && 
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            }
          </div>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {SideList('left')}
      </Drawer>
    </div>
  );
};

export default ApplicationBar;