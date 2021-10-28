/* eslint-disable import/no-duplicates */
/* eslint-disable no-sequences */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-octal */
import React, { useState, useRef } from 'react';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
import Box from '@material-ui/core/Box';
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
  containerDashBoard: {
    minHeight: '100%',
    background: theme.palette.background.paper,
  },
  drawer: {
    maxHeight: '70%',
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
  const dialogRef = useRef<ModalHandles>(null);
  const timeZone = 'GMT';

  const { signOut, user } = useAuth();

  const [OpenDrawer, setOpenDrawer] = useState(false);

  function handleOpenModalUser(id: string) {
    dialogRef.current?.openModal(id);
  }

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <>
      <div className={classes.containerDashBoard}>
        <AppBar position="relative">
          <Toolbar>
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
          <Grid container justify="center">
            <Grid item xs={12}>
              <Box mt={2} />
              <Typography variant={isSmall ? 'h5' : 'h2'} align="center" color="textPrimary">
                Machine Efficiency
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={6} sm={4} md={3} lg={2} xl={1}>
              <Typography align="center" gutterBottom>
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
            {/* <Grid item xs={3} sm={2}> */}
            {/* <Tooltip title="Report">
                <Typography align="left" gutterBottom component={LinkRD} to="/report">
                  <IconButton>
                    <TimelineIcon style={{ color: '#000' }} />
                  </IconButton>
                </Typography>
              </Tooltip> */}
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
            {/* </Grid> */}
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
