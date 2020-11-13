/* eslint-disable no-octal */
import React, { useEffect, useState } from 'react';

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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { parseISO, format } from 'date-fns';

import SettingsIcon from '@material-ui/icons/Settings';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

import { Paper } from '@material-ui/core';

import api from '../../services/api';

HighchartsMore(Highcharts);

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
  const [OpenDrawer, setOpenDrawer] = useState(false);
  const [DateEfficiency, setDateEfficiency] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [DataMachine, setDataMachine] = useState<DataMachineInterface[] | null>(
    null,
  );

  useEffect(() => {
    loadDataMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDataMachine() {
    const responseMachine = await api.post('/filter-date', {
      date: DateEfficiency,
      machine: 'machine001',
    });

    const newDataMachine = responseMachine.data.map(
      (dataMachine: DataMachineInterface) => {
        return { ...dataMachine, machine: 'machine001' };
      },
    );

    const responseMachine2 = await api.post('/filter-date', {
      date: DateEfficiency,
      machine: 'machine002',
    });

    const newDataMachine2 = responseMachine2.data.map(
      (dataMachine: DataMachineInterface) => {
        return { ...dataMachine, machine: 'machine002' };
      },
    );

    setDataMachine(
      DataMachine
        ? DataMachine.concat(newDataMachine.concat(newDataMachine2))
        : newDataMachine2,
    );

    return true;
    // setDataMachine(responseMachine.data);
  }

  function handleSaveSettings() {
    setOpenDrawer(false);
    loadDataMachine();
  }

  const options = {
    chart: {
      type: 'columnrange',
      inverted: true,
    },
    title: {
      text: '',
      // text: null // as an alternative
    },
    subtitle: {
      text: '',
      // text: null // as an alternative
    },
    yAxis: {
      type: 'datetime',
    },

    xAxis: {
      categories: ['OP135848 - 1367370A 0 pçs', 'OP135848 - 1367370A 1 pçs'],
    },

    legend: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },

    series: [
      {
        name: 'Hours',
        data: [],
      },
    ],
  };

  return (
    <div className={classes.containerDashBoard}>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            MOSB
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid container xs={12}>
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
              {format(parseISO(DateEfficiency), "MMMM dd ', 'yyyy")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Factory</TableCell>
                    <TableCell>Machine</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DataMachine &&
                    DataMachine.filter(
                      (row: { factory: string }) => row.factory === 'IMOP',
                    ).map(
                      (row: {
                        id: string;
                        factory: string;
                        machine: string;
                        datatime: Date;
                        status: string;
                      }) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.factory}</TableCell>
                          <TableCell>{row.machine}</TableCell>
                          <TableCell>
                            {row.datatime
                              ? format(
                                  parseISO(row.datatime.toString()),
                                  'yyyy-MM-dd kk:mm:ss',
                                )
                              : ''}
                          </TableCell>
                          <TableCell>{row.status}</TableCell>
                        </TableRow>
                      ),
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Factory</TableCell>
                    <TableCell>Machine</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DataMachine &&
                    DataMachine.filter(
                      (row: { factory: string }) => row.factory === 'MOSB',
                    ).map(
                      (row: {
                        id: string;
                        factory: string;
                        machine: string;
                        datatime: Date;
                        status: string;
                      }) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.factory}</TableCell>
                          <TableCell>{row.machine}</TableCell>
                          <TableCell>
                            {row.datatime
                              ? format(
                                  parseISO(row.datatime.toString()),
                                  'yyyy-MM-dd kk:mm:ss',
                                )
                              : ''}
                          </TableCell>
                          <TableCell>{row.status}</TableCell>
                        </TableRow>
                      ),
                    )}
                </TableBody>
              </Table>
            </TableContainer>
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
              <TextField
                InputLabelProps={{ shrink: true }}
                fullWidth
                value={DateEfficiency}
                label="Date"
                type="date"
                onChange={e => setDateEfficiency(e.target.value)}
              />
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
      <Fab
        color="secondary"
        className={classes.fab}
        aria-label="settings"
        onClick={() => setOpenDrawer(true)}
      >
        <SettingsIcon />
      </Fab>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </div>
  );
};

export default Dashboard;
