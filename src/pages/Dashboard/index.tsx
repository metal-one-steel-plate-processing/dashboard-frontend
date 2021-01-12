/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-octal */
import React, { useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { format } from 'date-fns';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { useAuth } from '../../hooks/AuthContext';
import LoadDataMachines from './loadDataMachines';
import MachineSettings from './machineSettings';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © 2020 '}
      <Link color="inherit" href="http://www.mosb.com.br/">
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
}));

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [DateNow, setDateNow] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { signOut, user } = useAuth();

  const [OpenDrawer, setOpenDrawer] = useState(false);

  return (
    <div className={classes.containerDashBoard}>
      <AppBar position="relative">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setOpenDrawer(true)}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            className={classes.title}
            color="inherit"
            noWrap
          >
            MOSB
          </Typography>

          <Typography component="h6" color="inherit" noWrap>
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
          <Grid item xs={12}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Machine Efficiency
            </Typography>

            <Typography
              component="h1"
              variant="h4"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              <TextField
                type="date"
                id="contained-button-date"
                value={DateNow}
                InputLabelProps={{ shrink: true }}
                onChange={e => setDateNow(e.target.value)}
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LoadDataMachines Date={DateNow} />
          </Grid>
          <Grid item xs={12} />
        </Grid>
      </Container>
      <Drawer
        anchor="top"
        open={OpenDrawer}
        onClose={() => setOpenDrawer(false)}
        className={classes.drawer}
      >
        <MachineSettings />
      </Drawer>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </div>
  );
};

export default Dashboard;
