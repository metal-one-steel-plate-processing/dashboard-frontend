import React, { useState, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import Box from '@material-ui/core/Box';
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
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('xs'));

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
            <div style={{ width: '100%' }}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Box>
                  <IconButton edge="start" onClick={() => setOpenDrawer(true)} color="inherit" size="small">
                    <MenuIcon />
                  </IconButton>
                </Box>
                <Box>
                  <Typography variant="h6" color="inherit">
                    MOSB
                  </Typography>
                </Box>
                <Box flexGrow={1}>
                  <Typography variant={isSmall ? 'body2' : 'body1'} color="inherit" align="right">
                    {`Welcome, ${user.name}`}
                  </Typography>
                </Box>
                <Box>
                  <IconButton size="small" color="inherit" onClick={() => handleOpenModalUser(user.id)}>
                    <Avatar alt={user.name} src="/static/images/avatar/1.jpg" />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton size="small" color="inherit" onClick={signOut}>
                    <ExitToAppIcon />
                  </IconButton>
                </Box>
              </Box>
            </div>
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
