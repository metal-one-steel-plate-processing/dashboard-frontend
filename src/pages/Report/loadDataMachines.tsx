/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';
import { eachDayOfInterval, format, endOfWeek, startOfWeek } from 'date-fns';
import { convertToTimeZone } from 'date-fns-timezone/dist/convertToTimeZone';
import { DateRangePicker, DateRange } from 'materialui-daterange-picker';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Box, IconButton, Paper, Tooltip } from '@material-ui/core';

import Button from '@material-ui/core/Button';

import { CSVLink } from 'react-csv';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';

import Avatar from '@material-ui/core/Avatar';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';

import TagMOSB from '../../assets/brasil.png';
import TagIMOP from '../../assets/india.png';

const useStyles = makeStyles(theme => ({
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
  container: {
    maxHeight: 700,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  machineDescription: {
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
  rootCard: {
    maxWidth: 345,
  },
  mediaCard: {
    height: 150,
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
  sequenceMachine: number;
  file_url?: string;
}

interface UserSettingsInterface {
  user_name: string;
  description: string;
  option1: string;
  canceled: string;
}

interface SeriesInterface {
  machineId: string;
  eachDay: number;
  operating?: number;
  connected?: number;
  efficiency?: number;
  efficiency_style: string;
}

interface SeriesExportInterface {
  machine: string;
  operating?: number;
  connected?: number;
  efficiency?: number;
}

const LoadDataMachinesReport: React.FC = () => {
  const classes = useStyles();
  const timeZone = 'GMT';
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);
  const [DataMachine, setDataMachine] = useState<DataMachineInterface[]>([]);
  const dateNow = new Date();
  const monthNow = dateNow.getMonth();
  const yearNow = dateNow.getFullYear();
  const { user, FactoriesSelected, GroupsSelected, MachinesSelected } = useAuth();
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: new Date(yearNow, monthNow, startOfWeek(new Date()).getDate()),
    endDate: new Date(yearNow, monthNow, endOfWeek(new Date()).getDate()),
  });
  const eachDay =
    dateRange.startDate &&
    dateRange.endDate &&
    eachDayOfInterval({
      start: dateRange.startDate && dateRange.startDate,
      end: dateRange.endDate && dateRange.endDate,
    });

  const [series, setSeries] = useState<SeriesInterface[]>([]);
  const [seriesExport, setSeriesExport] = useState<SeriesExportInterface[]>([]);
  const [OpenViewMachineImage, setOpenViewMachineImage] = React.useState(false);
  const [MachineImage, setMachineImage] = React.useState('');
  const [CSVSeparator, setCSVSeparator] = useState(';');

  const handleClickOpenViewMachineImage = (machineFile: string) => {
    if (machineFile) {
      setMachineImage(machineFile);
      setOpenViewMachineImage(true);
    }
  };

  const handleCloseViewMachineImage = () => {
    setMachineImage('');
    setOpenViewMachineImage(false);
  };

  const handleViewMachineDetails = (machineName: string, machineFile: string, factory: string) => {
    return (
      <Card className={classes.rootCard}>
        <CardActionArea>
          {machineFile && <CardMedia className={classes.mediaCard} image={machineFile} title={machineName} />}
          <CardContent>
            <Typography gutterBottom variant="h6" component="h2">
              {machineName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {factory}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  const toggle = () => setOpen(!open);

  useEffect(() => {
    loadMachinesSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDataMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllMachines, dateRange]);

  useEffect(() => {
    if (DataMachine && DataMachine.length > 0) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [DataMachine]);

  useEffect(() => {
    if (series.length > 0) {
      loadSeriesExport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series]);

  async function loadMachinesSettings() {
    try {
      setLoading(true);

      const responseSettings = await api.get(`/user-settings/${user.id}`);

      const responseMachineSettings = await api.get('/machine-settings');
      if (responseMachineSettings.data && responseMachineSettings.data.length > 0) {
        const newMachines: MachineInterface[] = [];

        if (responseSettings.data && responseSettings.data.length > 0) {
          responseSettings.data.map(
            (eachSettingsUsers: UserSettingsInterface) =>
              eachSettingsUsers.description === 'csvSeparator' && eachSettingsUsers.option1 && setCSVSeparator(eachSettingsUsers.option1),
          );
          responseMachineSettings.data.map((eachMachineSettings: MachineInterface) => {
            const hasMachine = responseSettings.data.filter(
              (eachSettingsUsers: UserSettingsInterface) =>
                eachSettingsUsers.description === eachMachineSettings.name && eachSettingsUsers.option1 === 'allow',
            );
            if (hasMachine.length > 0) {
              if (MachinesSelected.length > 0) {
                const machineSelected = MachinesSelected.filter(
                  eachMachineSelected => eachMachineSelected.description === eachMachineSettings.description,
                );
                if (machineSelected.length > 0) {
                  newMachines.push(eachMachineSettings);
                }
              } else if (GroupsSelected.length > 0) {
                if (GroupsSelected.indexOf(eachMachineSettings.group) >= 0) {
                  if (FactoriesSelected.length > 0) {
                    if (FactoriesSelected.indexOf(eachMachineSettings.factory) >= 0) {
                      newMachines.push(eachMachineSettings);
                    }
                  } else {
                    newMachines.push(eachMachineSettings);
                  }
                }
              } else if (FactoriesSelected.length > 0) {
                if (FactoriesSelected.indexOf(eachMachineSettings.factory) >= 0) {
                  newMachines.push(eachMachineSettings);
                }
              } else {
                newMachines.push({
                  ...eachMachineSettings,
                  sequenceMachine: parseInt(hasMachine[0].option2 || 9999, 10),
                });
              }
            }
            return true;
          });
          // console.log(newMachines);
          setAllMachines(newMachines);
        }
      }
    } catch (error) {
      toast.error(`machine data not found: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadDataMachine() {
    setLoading(true);
    // setDataMachine(null);
    const newDataMachine: DataMachineInterface[] = [];

    if (dateRange.startDate && dateRange.endDate) {
      try {
        await Promise.all(
          AllMachines.map(async eachMachine => {
            try {
              const responseMachine = await api.post('/filter-rangeDate', {
                startDate: dateRange.startDate && format(dateRange.startDate, 'yyyy-MM-dd'),
                endDate: dateRange.endDate && format(dateRange.endDate, 'yyyy-MM-dd'),
                machine: eachMachine.name,
              });

              // responseMachine.data && newDataMachine.push(responseMachine.data);
              /* try {
                const dataMachine = eachDay?.map(eachDaySelected => {
                  let operating = 0;
                  let connected = 0;
                  if (responseMachine.data) {
                    responseMachine.data
                      .filter(
                        (eachDataMachine: DataMachineInterface) =>
                          (eachDataMachine.datatime &&
                            eachDataMachine.datatime.getDate()) ===
                          eachDaySelected.getDate(),
                      )
                      .sort(
                        (
                          eachDataMachine: DataMachineInterface,
                          eachDataMachine2: DataMachineInterface,
                        ) =>
                          eachDataMachine.datatime > eachDataMachine2.datatime
                            ? 1
                            : -1,
                      )
                      .map((eachDataMachine: DataMachineInterface) => {
                        console.log(eachDataMachine);
                        if (
                          eachDataMachine.status &&
                          eachDataMachine.status === '0190'
                        ) {
                          operating += 2;
                          connected += 2;
                        }

                        if (
                          eachDataMachine.status &&
                          eachDataMachine.status === '0290'
                        ) {
                          operating += 2;
                          connected += 2;
                        }

                        if (
                          eachDataMachine.status &&
                          eachDataMachine.status === '0390'
                        ) {
                          operating += 2;
                          connected += 2;
                        }

                        if (
                          eachDataMachine.status &&
                          (eachDataMachine.status === '0101' ||
                            eachDataMachine.status === '0102' ||
                            eachDataMachine.status === '0103' ||
                            eachDataMachine.status === '0180' ||
                            eachDataMachine.status === '0181' ||
                            eachDataMachine.status === '0182' ||
                            eachDataMachine.status === '0183' ||
                            eachDataMachine.status === '0380' ||
                            eachDataMachine.status === '0382' ||
                            eachDataMachine.status === '0383' ||
                            eachDataMachine.status === '0500' ||
                            eachDataMachine.status === '0580' ||
                            eachDataMachine.status === '8188' ||
                            eachDataMachine.status === '8588')
                        ) {
                          operating += 2;
                          connected += 2;
                        }

                        if (
                          eachDataMachine.status &&
                          eachDataMachine.status === '0100'
                        ) {
                          connected += 2;
                        }

                        return true;
                      });
                  }
                  console.log(eachDaySelected);
                  console.log(operating);
                  console.log(connected);
                  return { eachDaySelected, operating, connected };
                });
              } catch (error) {
                console.log(error);
              } */
              // console.log(dataMachine);

              responseMachine.data
                .sort((dataMachine1: DataMachineInterface, dataMachine2: DataMachineInterface) =>
                  dataMachine1.datatime > dataMachine2.datatime ? 1 : -1,
                )
                // eslint-disable-next-line no-loop-func
                .map((dataMachine: DataMachineInterface) => {
                  newDataMachine.push({
                    ...dataMachine,
                    datatime: convertToTimeZone(new Date(dataMachine.datatime), { timeZone }),
                    machine: eachMachine.description,
                  });

                  return true;
                });
              return true;
              /* responseMachine.data
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
              }); */
            } catch (error) {
              throw new Error(error);
              /* console.log(error); */
            }
          }),
        );

        /* console.log(newDataMachine); */
        if (newDataMachine) {
          setDataMachine(newDataMachine);
        } else {
          setDataMachine([]);
        }
      } catch (error) {
        toast.error(`machine data not found: ${error}`);
        setDataMachine([]);
      } finally {
        setLoading(false);
      }
    }
    return true;
  }

  async function loadData() {
    // console.log('loadData');
    const newSeries: SeriesInterface[] = [];

    AllMachines.map(eachMachine => {
      // console.log(eachMachine);
      eachDay?.map(eachDaySelected => {
        let operating = 0;
        let connected = 0;
        let efficiency = 0;
        let efficiency_style = '';
        /* console.log('****************');
        console.log(eachDaySelected.getDate()); */

        DataMachine &&
          DataMachine.filter(
            (eachDataMachine: DataMachineInterface) =>
              eachDataMachine.datatime.getDate() === eachDaySelected.getDate() && eachMachine.description === eachDataMachine.machine,
          ).map((eachDataMachine: DataMachineInterface) => {
            if (eachDataMachine.status && eachDataMachine.status === '0190') {
              operating += 2;
              connected += 2;
            }

            if (eachDataMachine.status && eachDataMachine.status === '0290') {
              operating += 2;
              connected += 2;
            }

            if (eachDataMachine.status && eachDataMachine.status === '0390') {
              operating += 2;
              connected += 2;
            }

            if (
              eachDataMachine.status &&
              (eachDataMachine.status === '0101' ||
                eachDataMachine.status === '0102' ||
                eachDataMachine.status === '0103' ||
                eachDataMachine.status === '0180' ||
                eachDataMachine.status === '0181' ||
                eachDataMachine.status === '0182' ||
                eachDataMachine.status === '0183' ||
                eachDataMachine.status === '0380' ||
                eachDataMachine.status === '0382' ||
                eachDataMachine.status === '0383' ||
                eachDataMachine.status === '0500' ||
                eachDataMachine.status === '0580' ||
                eachDataMachine.status === '8188' ||
                eachDataMachine.status === '8588')
            ) {
              operating += 2;
              connected += 2;
            }

            if (eachDataMachine.status && eachDataMachine.status === '0100') {
              connected += 2;
            }

            return { connected, operating };
          });
        /* const dataMachine = DataMachine?.map(
          (eachDateMachine: DataMachineInterface) => {
            console.log(eachDateMachine);
            const dateConverTimeZone = convertToTimeZone(
              new Date(eachDateMachine.datatime),
              {
                timeZone,
              },
            );
            console.log(dateConverTimeZone);

            return true;
          },
        ); */
        // console.log(eachDatamachine);
        efficiency = operating !== 0 && connected !== 0 ? (operating / connected) * 100 : 0;
        /* console.log(operating);
        console.log(connected);
        console.log(efficiency); */
        if (efficiency > 95) {
          efficiency_style = 'high';
        } else if (efficiency > 90 && efficiency <= 95) {
          efficiency_style = 'middle';
        } else if (efficiency > 0 && efficiency <= 90) {
          efficiency_style = 'low';
        } else {
          efficiency_style = '';
        }
        newSeries.push({
          machineId: eachMachine.id,
          eachDay: eachDaySelected.getDate(),
          operating,
          connected,
          efficiency,
          efficiency_style,
        });
        return true;
      });
      return true;
    });
    // console.log(newSeries);
    newSeries && newSeries.length > 0 ? setSeries(newSeries) : setSeries([]);
    /* eachDay.map(eachDayArray => {
      const connected = 0;
      const operating = 0;
      const efficiency = 0;
      DataMachine?.filter((eachDataMachine: DataMachineInterface) => {
        eachDataMachine.datatime;
      }).map((eachDataMachine: DataMachineInterface) => {});
    }); */
  }

  function loadSeriesExport() {
    /* console.log('*************loadSeriesExport'); */
    const newDataSeriesExport: SeriesExportInterface[] = [];

    AllMachines.sort((eachMachine, eachMachine2) => (eachMachine.sequenceMachine > eachMachine2.sequenceMachine ? 1 : -1)).map(
      eachMachine => {
        /* console.log(indexEachMachine); */
        let eachDataSeriesExport = {};
        eachDay &&
          eachDay.map(eachDaySelected => {
            const dataSeriesMachine = series
              ? series.filter(
                  (eachSeries: SeriesInterface) =>
                    eachSeries.machineId === eachMachine.id && eachSeries.eachDay === eachDaySelected.getDate(),
                )
              : [];

            /* console.log(eachMachine.id);
          console.log(eachDaySelected.getDate()); */
            /* console.log('dataSeriesMachine');
          console.log(dataSeriesMachine); */
            /* indexEachMachine === 0 &&
            eachDataSeriesExport = {
              ...eachDataSeriesExport,
              Machine: '',
              [`${format(eachDaySelected, "MMMM d',' yyyy")} Connected`]: format(eachDaySelected, "MMMM d',' yyyy"),
              [`${format(eachDaySelected, "MMMM d',' yyyy")} Operating`]: '',
              [`${format(eachDaySelected, "MMMM d',' yyyy")} Efficiency`]: '',
            }; */
            /* const eachDaySelectedData = {
            Machine: `${eachMachine.factory} - ${eachMachine.description}`,
            Connected:
              dataSeriesMachine && dataSeriesMachine.length > 0
                ? dataSeriesMachine[0].connected
                : '-',
            Operating:
              dataSeriesMachine && dataSeriesMachine.length > 0
                ? dataSeriesMachine[0].operating
                : '-',
            Efficiency:
              dataSeriesMachine && dataSeriesMachine.length > 0
                ? dataSeriesMachine[0].efficiency?.toFixed(2)
                : '-',
          };
          console.log('eachDaySelectedData: ');
          console.log(eachDaySelectedData);

          eachDataSeriesExport =
            indexEachMachine === 0
              ? {
                  ...eachDataSeriesExport,
                  Machine: 'Machine',
                  Connected: format(eachDaySelected, "MMMM d',' yyyy"),
                  Operating: '',
                  Efficiency: '',
                }
              : eachDataSeriesExport;

          eachDataSeriesExport = {
            ...eachDataSeriesExport,
            ...eachDaySelectedData,
          }; */
            eachDataSeriesExport = {
              ...eachDataSeriesExport,
              Machine: `${eachMachine.factory} - ${eachMachine.description}`,
              [`${format(eachDaySelected, "MMMM d',' yyyy")} Connected`]:
                dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].connected : '-',
              [`${format(eachDaySelected, "MMMM d',' yyyy")} Operating`]:
                dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].operating : '-',
              [`${format(eachDaySelected, "MMMM d',' yyyy")} Efficiency`]:
                dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].efficiency?.toFixed(2) : '-',
            };

            return true;
          });
        /* console.log('+++eachDataSeriesExport :');
      console.log(eachDataSeriesExport); */
        newDataSeriesExport.push(eachDataSeriesExport as SeriesExportInterface);
        return true;
      },
    );

    /* console.log(newDataSeriesExport); */
    setSeriesExport(newDataSeriesExport);
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading machine data</Typography>
      </Backdrop>

      <Dialog open={OpenViewMachineImage} onClose={handleCloseViewMachineImage} fullWidth maxWidth="lg">
        <DialogContent>
          <img src={MachineImage} alt="Machine" width="100%" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewMachineImage} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs={2}>
          <Tooltip title="Return to Dashboard">
            <Typography component={Link} to="/dashboard">
              <IconButton>
                <ArrowBackIcon style={{ color: '#000' }} fontSize="large" />
              </IconButton>
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={7}>
          <Box mt={2} />
          <Typography align="center" variant="h4">
            {'From '}
            <Chip
              label={<Typography variant="h5">{dateRange.startDate && format(dateRange.startDate, "MMMM d',' yyyy")}</Typography>}
              component="a"
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(true)}
            />
            {' To '}
            <Chip
              label={<Typography variant="h5">{dateRange.endDate && format(dateRange.endDate, "MMMM d',' yyyy")}</Typography>}
              component="a"
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(true)}
            />
          </Typography>
          {/* <Typography
            align="center"
            variant="h4"
            onClick={() => setOpen(true)}
            gutterBottom
          >
            {`${
              dateRange.startDate && format(dateRange.startDate, 'd MMMM yyyy')
            } To ${
              dateRange.endDate && format(dateRange.endDate, 'd MMMM yyyy')
            }`}
          </Typography> */}
        </Grid>
        <Grid item xs={3}>
          <Box display="flex" justifyContent="flex-end">
            <Box className="low" component={Paper} p={1} mr={1}>
              1 - 90
            </Box>
            <Box className="middle" component={Paper} p={1} mr={1}>
              90 - 95
            </Box>
            <Box className="high" component={Paper} p={1}>
              {'> 95'}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9} lg={7} xl={5} style={{ zIndex: 9999 }}>
          <div style={{ position: 'absolute' }}>
            <DateRangePicker
              open={open}
              toggle={toggle}
              initialDateRange={{
                startDate: new Date(yearNow, monthNow, startOfWeek(new Date()).getDate()),
                endDate: new Date(yearNow, monthNow, endOfWeek(new Date()).getDate()),
              }}
              onChange={range => setDateRange(range)}
            />
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={2} justify="flex-end">
        <Grid item xs={3} lg={2} style={{ flex: 'inherit' }}>
          <CSVLink
            style={{ textDecoration: 'none' }}
            filename={`MachineEfficiency_${dateRange.startDate && format(dateRange.startDate, 'MMMM_d_yyyy')}_to_${
              dateRange.endDate && format(dateRange.endDate, 'MMMM_d_yyyy')
            }.csv`}
            data={seriesExport}
            separator={CSVSeparator}
          >
            <Button variant="outlined" color="default" size="small" startIcon={<FontAwesomeIcon icon={faFileCsv} size="lg" />}>
              Export CSV
            </Button>
          </CSVLink>
        </Grid>
        <Grid item xs={12}>
          <TableContainer className={classes.container}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: '1px solid #e0e0e0',
                      padding: '1px',
                      minWidth: '200px',
                    }}
                  >
                    Machine
                  </TableCell>
                  {eachDay?.map(eachDaySelected => (
                    <TableCell
                      colSpan={3}
                      align="center"
                      style={{
                        padding: '1px',
                        borderRight: '1px solid #e0e0e0',
                        borderLeft: '1px solid #e0e0e0',
                        minWidth: '218px',
                        maxWidth: '218px',
                      }}
                    >
                      <TableRow>
                        <TableCell align="center" colSpan={3} style={{ padding: '1px' }}>
                          {`${format(eachDaySelected, "EEEE d'/'MMMM")}`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{
                            borderBottom: 0,
                            padding: '1px',
                            minWidth: '72px',
                            maxWidth: '72px',
                          }}
                        >
                          Connected
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderBottom: 0,
                            borderLeft: '1px solid #e0e0e0',
                            padding: '1px',
                            minWidth: '70px',
                            maxWidth: '70px',
                          }}
                        >
                          Operating
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            borderBottom: 0,
                            borderLeft: '1px solid #e0e0e0',
                            padding: '1px',
                            minWidth: '70px',
                            maxWidth: '70px',
                          }}
                        >
                          Efficiency
                        </TableCell>
                      </TableRow>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {AllMachines.sort((eachMachine, eachMachine2) => (eachMachine.sequenceMachine > eachMachine2.sequenceMachine ? 1 : -1)).map(
                  eachMachine => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1}>
                        <TableCell
                          style={{
                            borderRight: '1px solid #e0e0e0',
                            padding: '1px',
                            minWidth: '200px',
                          }}
                        >
                          <div className={classes.machineDescription}>
                            <Tooltip
                              title={handleViewMachineDetails(eachMachine.description, eachMachine.file_url || '', eachMachine.factory)}
                            >
                              <AvatarGroup>
                                <Avatar
                                  alt={eachMachine.factory}
                                  src={eachMachine.factory === 'IMOP' ? TagIMOP : TagMOSB}
                                  className={classes.small}
                                />
                                <Avatar
                                  alt={eachMachine.name}
                                  src={eachMachine.file_url}
                                  className={classes.small}
                                  component={ButtonBase}
                                  onClick={() => handleClickOpenViewMachineImage(eachMachine.file_url || '')}
                                >
                                  <BrokenImageIcon />
                                </Avatar>
                              </AvatarGroup>
                            </Tooltip>
                            <Typography variant="body2">{`${eachMachine.factory} - ${eachMachine.description}`}</Typography>
                          </div>
                        </TableCell>
                        {eachDay &&
                          eachDay.map(eachDaySelected => {
                            const dataSeriesMachine = series
                              ? series.filter(
                                  (eachSeries: SeriesInterface) =>
                                    eachSeries.machineId === eachMachine.id && eachSeries.eachDay === eachDaySelected.getDate(),
                                )
                              : [];
                            /* console.log(eachMachine.id);
                          console.log(eachDaySelected.getDate()); */
                            /* console.log('dataSeriesMachine');
                          console.log(dataSeriesMachine); */
                            return (
                              <>
                                <TableCell
                                  align="center"
                                  style={{
                                    borderLeft: '1px solid #e0e0e0',
                                    padding: '1px',
                                    minWidth: '72px',
                                    width: '72px',
                                    maxWidth: '72px',
                                  }}
                                >
                                  {dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].connected : '-'}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  style={{
                                    borderLeft: '1px solid #e0e0e0',
                                    padding: '1px',
                                    minWidth: '68px',
                                    width: '68px',
                                    maxWidth: '68px',
                                  }}
                                >
                                  {dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].operating : '-'}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={
                                    dataSeriesMachine.length > 0 && dataSeriesMachine[0].efficiency_style !== ''
                                      ? dataSeriesMachine[0].efficiency_style
                                      : ''
                                  }
                                  style={{
                                    borderLeft: '1px solid #e0e0e0',
                                    borderRight: '1px solid #e0e0e0',
                                    padding: '1px',
                                    minWidth: '70px',
                                    width: '70px',
                                    maxWidth: '70px',
                                  }}
                                >
                                  {dataSeriesMachine && dataSeriesMachine.length > 0
                                    ? `${dataSeriesMachine[0].efficiency?.toFixed(2)}%`
                                    : '-'}
                                </TableCell>
                              </>
                            );
                          })}
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default LoadDataMachinesReport;
