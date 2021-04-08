/* eslint-disable import/no-duplicates */
/* eslint-disable no-sequences */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-octal */
import React, { useState, useRef } from 'react';
import { Link as LinkRD } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import { format } from 'date-fns';
import Avatar from '@material-ui/core/Avatar';

import DateFnsUtils from '@date-io/date-fns';
import enLocale from 'date-fns/locale/en-US';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { convertToTimeZone } from 'date-fns-timezone/dist/convertToTimeZone';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TimelineIcon from '@material-ui/icons/Timeline';
/* import TouchAppIcon from '@material-ui/icons/TouchApp'; */

import Tooltip from '@material-ui/core/Tooltip';
import ModalUser, { ModalHandles } from '../Modal/UserDataDialog';
import { useAuth } from '../../hooks/AuthContext';
import LoadDataMachines from './loadDataMachines';
import MachineSettings from './machineSettings';

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

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [DateNow, setDateNow] = useState(format(new Date(), 'yyyy-MM-dd'));
  const dialogRef = useRef<ModalHandles>(null);
  const timeZone = 'GMT';

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
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography component="h1" variant="h2" align="center" color="textPrimary">
                Machine Efficiency
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
              <Typography align="right" gutterBottom>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
                  <DatePicker
                    value={convertToTimeZone(new Date(DateNow), { timeZone })}
                    format="MMMM d, yyyy"
                    onChange={
                      date => date && setDateNow(format(new Date(date), 'yyyy-MM-dd'))
                      /* console.log(date),
                        console.log(date),
                        console.log(DateNow) */
                      // eslint-disable-next-line react/jsx-curly-newline
                    }
                  />
                </MuiPickersUtilsProvider>
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Tooltip title="Report">
                <Typography align="left" gutterBottom component={LinkRD} to="/report">
                  <IconButton>
                    <TimelineIcon style={{ color: '#000' }} />
                  </IconButton>
                </Typography>
              </Tooltip>
              {/* <Tooltip title="Appointments Operators">
                <Typography
                  align="left"
                  gutterBottom
                  component={LinkRD}
                  to="/appointments"
                >
                  <IconButton>
                    <TouchAppIcon style={{ color: '#000' }} />
                  </IconButton>
                </Typography>
              </Tooltip> */}

              {/* <Typography
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
              </Typography> */}
            </Grid>
            <Grid item xs={12}>
              <LoadDataMachines Date={DateNow} />
            </Grid>
            <Grid item xs={12} />
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

export default Dashboard;
