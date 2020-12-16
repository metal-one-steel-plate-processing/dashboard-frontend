/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-octal */
import React, { useEffect, useRef, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { parseISO, format } from 'date-fns';

import SettingsIcon from '@material-ui/icons/Settings';

import { Paper } from '@material-ui/core';

import Box from '@material-ui/core/Box';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import api from '../../services/api';
import Graphic from './graphic';
import Table from './table';

import { useAuth } from '../../hooks/AuthContext';

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
  containerDashBoard: {
    minHeight: '100%',
    background: theme.palette.background.paper,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 99,
    color: '#fff',
  },
  drawer: {
    width: 240,
  },
  drawerPaper: {
    width: 240,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  appBarBottom: {
    top: 'auto',
    bottom: 0,
    width: 240,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

interface DataMachineInterface {
  id: string;
  factory: string;
  machine: string;
  datatime: Date;
  status: string;
}

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const { signOut } = useAuth();

  const [OpenDrawer, setOpenDrawer] = useState(false);
  const allMachines = [
    'machine001',
    'machine002',
    'machine003',
    'machine004',
    'machine005',
    'machine006',
    'machine007',
  ];
  const [DataMachine, setDataMachine] = useState<DataMachineInterface[] | null>(
    null,
  );
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // loadDataMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDataMachine() {
    // const allMachines =
    const dateMachine = dateRef.current?.value;
    setOpenDrawer(false);
    setLoading(true);
    let newDataMachine: DataMachineInterface[] | undefined;

    while (newDataMachine) {
      newDataMachine.pop();
    }

    for (let i = 0; i < allMachines.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const responseMachine = await api.post('/filter-date', {
        date: dateMachine,
        machine: allMachines[i],
      });

      responseMachine.data
        .sort(
          (
            dataMachine1: DataMachineInterface,
            dataMachine2: DataMachineInterface,
          ) => (dataMachine1.datatime > dataMachine2.datatime ? 1 : -1),
        )
        // eslint-disable-next-line no-loop-func
        .map((dataMachine: DataMachineInterface) => {
          if (newDataMachine) {
            newDataMachine.push({ ...dataMachine, machine: allMachines[i] });
          } else {
            newDataMachine = [{ ...dataMachine, machine: allMachines[i] }];
          }

          return true;
        });
    }

    if (newDataMachine) {
      setLoading(false);
      setDataMachine(newDataMachine);
    }

    return true;
    // setDataMachine(responseMachine.data);
  }

  function handleSaveSettings() {
    setOpenDrawer(false);
    loadDataMachine();
  }

  return (
    <div className={classes.containerDashBoard}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar position="relative">
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" color="inherit" noWrap>
            MOSB
          </Typography>

          <IconButton color="inherit" onClick={signOut}>
            <ExitToAppIcon />
          </IconButton>
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
              {DataMachine ? (
                dateRef.current?.value && (
                  <Link
                    color="inherit"
                    href="https://dashboard-efficiency.netlify.app/"
                  >
                    {format(
                      parseISO(dateRef.current.value),
                      "MMMM dd ', 'yyyy",
                    )}
                  </Link>
                )
              ) : (
                <TextField
                  inputRef={dateRef}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  onChange={() => loadDataMachine()}
                />
              )}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {DataMachine && (
              <Graphic dataMachine={DataMachine} allMachines={allMachines} />
            )}
          </Grid>
          <Grid item xs={12}>
            {DataMachine && (
              <Table dataMahchines={DataMachine} allMachines={allMachines} />
            )}
          </Grid>
        </Grid>
      </Container>
      <Drawer
        anchor="right"
        open={OpenDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Paper elevation={0} className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* <TextField
                InputLabelProps={{ shrink: true }}
                fullWidth
                inputRef={dateRef}
                label="Date"
                type="date"
                onChange={() => loadDataMachine()}
              /> */}
            </Grid>
          </Grid>
        </Paper>
        <AppBar
          position="fixed"
          color="transparent"
          className={classes.appBarBottom}
        >
          <Toolbar>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => handleSaveSettings()}
            >
              save
            </Button>
          </Toolbar>
        </AppBar>
      </Drawer>
      <Box display="none">
        <Fab
          color="secondary"
          className={classes.fab}
          aria-label="settings"
          onClick={() => setOpenDrawer(true)}
        >
          <SettingsIcon />
        </Fab>
      </Box>

      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </div>
  );
};

export default Dashboard;
