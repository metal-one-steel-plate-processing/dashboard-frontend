import React, { useState, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import ModalUser, { ModalHandles } from '../Modal/UserDataDialog';
import { useAuth } from '../../hooks/AuthContext';
import MachineSettings from '../Dashboard/machineSettings';
import LoadDataMachines from './loadDataMachines';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © 2020 '}
      <Link color="inherit" href="http://www.mosb.com.br">
        www.mosb.com.br
      </Link>
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  containerDashBoard: {
    minHeight: '100%',
    background: theme.palette.background.paper,
  },
  drawer: {
    width: 'auto',
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  avatar: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    cursor: 'pointer',
  },
}));

const Report: React.FC = () => {
  const classes = useStyles();
  const dialogRef = useRef<ModalHandles>(null);

  const { signOut, user } = useAuth();

  const [OpenDrawer, setOpenDrawer] = useState(false);

  function handleOpenModalUser(id: string) {
    dialogRef.current?.openModal(id);
  }
  return (
    <>
      <div className={classes.containerDashBoard}>
        <AppBar position="relative">
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <IconButton edge="start" className={classes.menuButton} onClick={() => setOpenDrawer(true)} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title} color="inherit" noWrap>
              MOSB
            </Typography>

            <Grid onClick={() => handleOpenModalUser(user.id)}>
              <div className={classes.avatar}>
                <Avatar alt={user.name} src="/static/images/avatar/1.jpg" />
              </div>
            </Grid>

            <Typography component="h6" color="inherit">
              Welcome,
              {user.name}
              <IconButton color="inherit" onClick={signOut}>
                <ExitToAppIcon />
              </IconButton>
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Grid container>
            <LoadDataMachines />
          </Grid>
        </Container>
        <Drawer anchor="top" open={OpenDrawer} onClose={() => setOpenDrawer(false)} className={classes.drawer}>
          <MachineSettings />
        </Drawer>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </div>
      <ModalUser ref={dialogRef} />
    </>
  );
};

export default Report;
