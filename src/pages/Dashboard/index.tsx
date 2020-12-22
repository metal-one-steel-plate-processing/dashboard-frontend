/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-octal */
import React, { useEffect, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import IconButton from '@material-ui/core/IconButton';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import Graphic from './graphic';
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
  backdrop: {
    zIndex: theme.zIndex.drawer + 99,
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  progress: {
    width: '90%',
    marginBottom: 10,
  },
  drawer: {
    width: 'auto',
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

interface MachineInterface {
  id: string;
  name: string;
  description: string;
  group: string;
  factory: string;
}

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [DateNow, setDateNow] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);

  const { signOut, user } = useAuth();

  const [OpenDrawer, setOpenDrawer] = useState(false);
  const [DataMachine, setDataMachine] = useState<DataMachineInterface[] | null>(
    null,
  );

  useEffect(() => {
    loadMachinesSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DateNow]);

  async function loadMachinesSettings() {
    try {
      setLoading(true);
      const responseMachineSettings = await api.get('/machine-settings');
      if (
        responseMachineSettings.data &&
        responseMachineSettings.data.length > 0
      ) {
        setAllMachines(responseMachineSettings.data);
      }
    } catch (error) {
      toast.error(`machine data not found: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDataMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllMachines]);

  async function loadDataMachine() {
    setOpenDrawer(false);
    setLoading(true);
    setDataMachine(null);
    let newDataMachine: DataMachineInterface[] | undefined;

    while (newDataMachine) {
      newDataMachine.pop();
    }

    try {
      await Promise.all(
        AllMachines.map(async eachMachine => {
          const responseMachine = await api.post('/filter-date', {
            date: DateNow,
            machine: eachMachine.name,
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
                newDataMachine.push({
                  ...dataMachine,
                  machine: eachMachine.description,
                });
              } else {
                newDataMachine = [
                  { ...dataMachine, machine: eachMachine.description },
                ];
              }

              return true;
            });
        }),
      );

      if (newDataMachine) {
        setDataMachine(newDataMachine);
      }
    } catch (error) {
      toast.error(`machine data not found: ${error}`);
    } finally {
      setLoading(false);
    }

    return true;
  }

  return (
    <div className={classes.containerDashBoard}>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading machine data</Typography>
      </Backdrop>
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
              {/* {DataMachine ? (
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
                  value={DateNow}
                  InputLabelProps={{ shrink: true }}
                  onChange={() => loadDataMachine()}
                />
              )} */}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {DataMachine && (
              <Graphic
                dataMachine={DataMachine}
                allMachines={AllMachines}
                dateMachine={DateNow}
              />
            )}
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
