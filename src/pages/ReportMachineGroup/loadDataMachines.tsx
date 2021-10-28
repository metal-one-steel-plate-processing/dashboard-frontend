/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { eachDayOfInterval, format, endOfWeek, startOfWeek } from 'date-fns';
import { convertToTimeZone } from 'date-fns-timezone/dist/convertToTimeZone';
import { DateRangePicker, DateRange } from 'materialui-daterange-picker';
import { Box } from '@material-ui/core';

import { toast } from 'react-toastify';

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
  operatingGeral?: number;
  connectedGeral?: number;
  efficiencyGeral?: number;
}

interface MachineInterface {
  id: string;
  name: string;
  description: string;
  group: string;
  subgroup: string;
  factory: string;
  sequenceMachine: number;
  colorSubgroup?: string;
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
}

interface SeriesAverageInterface {
  machineId: string;
  operating?: string;
  connected?: string;
  efficiency?: string;
  subgroupMachine: string;
  colorSubgroupMachine?: string;
}

interface SubgroupSeriesAverageInterface {
  subgroup: string;
  subgroupColor: string;
  average?: string;
  quantity: number;
  machines: string[];
}

const LoadDataMachinesReport: React.FC = () => {
  const classes = useStyles();
  const timeZone = 'GMT';
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);
  const [DataMachine, setDataMachine] = useState<DataMachineInterface[]>([]);
  const { user, FactoriesSelected, GroupsSelected, MachinesSelected } = useAuth();
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: new Date(startOfWeek(new Date()).getFullYear(), startOfWeek(new Date()).getMonth(), startOfWeek(new Date()).getDate()),
    endDate: new Date(endOfWeek(new Date()).getFullYear(), endOfWeek(new Date()).getMonth(), endOfWeek(new Date()).getDate()),
  });

  const eachDay =
    dateRange.startDate &&
    dateRange.endDate &&
    eachDayOfInterval({
      start: dateRange.startDate && dateRange.startDate,
      end: dateRange.endDate && dateRange.endDate,
    });

  const [series, setSeries] = useState<SeriesInterface[]>([]);
  const [seriesAverage, setSeriesAverage] = useState<SeriesAverageInterface[]>([]);
  const [SubgroupSeriesAverage, setSubgroupSeriesAverage] = useState<SubgroupSeriesAverageInterface[]>([]);
  const [OpenViewMachineImage, setOpenViewMachineImage] = React.useState(false);
  const [MachineImage, setMachineImage] = React.useState('');

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('xs'));

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
      loadSeriesAverage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series]);

  useEffect(() => {
    if (seriesAverage.length > 0) {
      loadSubgroupSeriesAverage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesAverage]);

  async function loadMachinesSettings() {
    try {
      setLoading(true);

      const responseGroups = await api.get('/machine-groups');
      const responseSettings = await api.get('/user-settings');
      const responseMachineSettings = await api.get('/machine-settings');
      if (responseMachineSettings.data && responseMachineSettings.data.length > 0) {
        const newMachines: MachineInterface[] = [];

        if (responseSettings.data && responseSettings.data.length > 0) {
          responseMachineSettings.data.map((eachMachineSettings: MachineInterface) => {
            const dataMachineSubgroup = responseGroups.data.filter(
              (eachGroup: { description: string }) => eachGroup.description === eachMachineSettings.subgroup,
            );
            const hasMachine = responseSettings.data.filter(
              (eachSettingsUsers: UserSettingsInterface) =>
                eachSettingsUsers.user_name === user.name &&
                eachSettingsUsers.canceled === 'N' &&
                eachSettingsUsers.description === eachMachineSettings.name &&
                eachSettingsUsers.option1 === 'allow',
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
                  colorSubgroup: dataMachineSubgroup[0] ? dataMachineSubgroup[0].high_color : '',
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
            } catch (error) {
              throw new Error(error);
            }
          }),
        );
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
        newSeries.push({
          machineId: eachMachine.id,
          eachDay: eachDaySelected.getDate(),
          operating,
          connected,
          efficiency,
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

  function loadSeriesAverage() {
    const newSeriesAverage: SeriesAverageInterface[] = [];
    AllMachines.sort((eachMachine, eachMachine2) => (eachMachine.sequenceMachine > eachMachine2.sequenceMachine ? 1 : -1)).map(
      eachMachine => {
        const totalDays = eachDay?.length || 0;
        let operatingMachine = 0;
        let connectedMachine = 0;
        let efficiencyMachine = 0;

        series
          .filter(eachSeries => eachSeries.machineId === eachMachine.id)
          .map(eachSeries => {
            operatingMachine += eachSeries.operating ? eachSeries.operating : 0;
            connectedMachine += eachSeries.connected ? eachSeries.connected : 0;
            efficiencyMachine += eachSeries.efficiency ? eachSeries.efficiency : 0;
            return true;
          });

        newSeriesAverage.push({
          machineId: eachMachine.id,
          operating: (operatingMachine / totalDays).toFixed(0),
          connected: (connectedMachine / totalDays).toFixed(0),
          efficiency: (efficiencyMachine / totalDays).toFixed(2),
          subgroupMachine: eachMachine.subgroup,
          colorSubgroupMachine: eachMachine.colorSubgroup,
        });
        return true;
      },
    );
    newSeriesAverage && newSeriesAverage.length > 0 ? setSeriesAverage(newSeriesAverage) : setSeriesAverage([]);
  }

  function loadSubgroupSeriesAverage() {
    let subgroup = '';
    let contSubgroup = 0;
    let average = 0;
    let machines = [''];
    let subgroupColor = '';
    const newSubgroupSeriesAverage: SubgroupSeriesAverageInterface[] = [];
    seriesAverage.map((eachSeriesAverage, index) => {
      if (index === 0) {
        subgroup = eachSeriesAverage.subgroupMachine;
        subgroupColor = eachSeriesAverage.colorSubgroupMachine || '';
      }

      if (index > 0 && subgroup !== eachSeriesAverage.subgroupMachine) {
        newSubgroupSeriesAverage.push({
          subgroup,
          subgroupColor,
          quantity: contSubgroup,
          average: (average / contSubgroup).toFixed(2),
          machines,
        });
        subgroup = eachSeriesAverage.subgroupMachine;
        subgroupColor = eachSeriesAverage.colorSubgroupMachine || '';
        contSubgroup = 1;
        average = parseFloat(eachSeriesAverage.efficiency || '');
        machines = [''];
        machines.push(eachSeriesAverage.machineId);
      } else {
        contSubgroup += 1;
        average += parseFloat(eachSeriesAverage.efficiency || '');
        machines.push(eachSeriesAverage.machineId);
      }
      return true;
    });
    newSubgroupSeriesAverage.push({
      subgroup,
      subgroupColor,
      quantity: contSubgroup,
      average: (average / contSubgroup).toFixed(2),
      machines,
    });
    newSubgroupSeriesAverage && newSubgroupSeriesAverage.length > 0
      ? setSubgroupSeriesAverage(newSubgroupSeriesAverage)
      : setSubgroupSeriesAverage([]);
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading machine data</Typography>
      </Backdrop>
      <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Box mt={2} />
          <Typography align="center" variant={isSmall ? 'caption' : 'h4'}>
            {'From '}
            <Chip
              label={
                <Typography variant={isSmall ? 'caption' : 'h5'}>
                  {dateRange.startDate && format(dateRange.startDate, "MMMM d',' yyyy")}
                </Typography>
              }
              component="a"
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(true)}
            />
            {' To '}
            <Chip
              label={
                <Typography variant={isSmall ? 'caption' : 'h5'}>
                  {dateRange.endDate && format(dateRange.endDate, "MMMM d',' yyyy")}
                </Typography>
              }
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

        <Grid item xs={12} md={9} lg={7} xl={5} style={{ zIndex: 9999 }}>
          <div style={{ position: 'absolute' }}>
            <DateRangePicker
              open={open}
              toggle={toggle}
              initialDateRange={{
                startDate: new Date(
                  startOfWeek(new Date()).getFullYear(),
                  startOfWeek(new Date()).getMonth(),
                  startOfWeek(new Date()).getDate(),
                ),
                endDate: new Date(endOfWeek(new Date()).getFullYear(), endOfWeek(new Date()).getMonth(), endOfWeek(new Date()).getDate()),
              }}
              onChange={range => setDateRange(range)}
            />
          </div>
        </Grid>
      </Grid>
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
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                align="center"
                style={{
                  borderRight: '1px solid #e0e0e0',
                  padding: '1px',
                  minWidth: '200px',
                }}
              >
                <TableRow>
                  <TableCell align="center" colSpan={3} style={{ padding: '1px' }}>
                    Average Subgroup
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{
                      borderBottom: 0,
                      padding: '1px',
                      minWidth: '70px',
                      maxWidth: '70px',
                    }}
                  >
                    Efficiency
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      borderBottom: 0,
                      borderLeft: '1px solid #e0e0e0',
                      padding: '1px',
                      minWidth: '130px',
                      maxWidth: '130px',
                    }}
                  >
                    SubGroup
                  </TableCell>
                </TableRow>
              </TableCell>
              <TableCell style={{ padding: 0, border: 0 }}>
                <TableCell
                  align="center"
                  style={{
                    borderRight: '1px solid #e0e0e0',
                    borderLeft: '1px solid #e0e0e0',
                    padding: '1px',
                    minWidth: '220px',
                  }}
                >
                  Machine
                </TableCell>
                <TableCell
                  colSpan={3}
                  align="center"
                  style={{
                    borderRight: '1px solid #e0e0e0',
                    borderLeft: '1px solid #e0e0e0',
                    padding: '1px',
                    minWidth: '200px',
                  }}
                >
                  <TableRow>
                    <TableCell align="center" colSpan={3} style={{ padding: '1px' }}>
                      Average Machine
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
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {SubgroupSeriesAverage.map(eachSubgroupSeriesAverage => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1}>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: '1px solid #e0e0e0',
                      padding: '1px',
                      minWidth: '73px',
                      width: '73px',
                      maxWidth: '73px',
                      backgroundColor: eachSubgroupSeriesAverage.subgroupColor || '#fff',
                    }}
                  >
                    {`${eachSubgroupSeriesAverage.average}%`}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      borderRight: '1px solid #e0e0e0',
                      padding: '1px',
                      minWidth: '100px',
                      backgroundColor: eachSubgroupSeriesAverage.subgroupColor || '#fff',
                    }}
                  >
                    {eachSubgroupSeriesAverage.subgroup}
                  </TableCell>
                  <TableCell style={{ padding: 0, border: 0 }}>
                    {AllMachines.filter(eachMachine => eachSubgroupSeriesAverage.machines.indexOf(eachMachine.id) > 0)
                      .sort((eachMachine, eachMachine2) => (eachMachine.sequenceMachine > eachMachine2.sequenceMachine ? 1 : -1))
                      .map(eachMachine => {
                        const dataSeriesAverage = seriesAverage.filter(eachSeriesAverage => eachSeriesAverage.machineId === eachMachine.id);
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1}>
                            <TableCell
                              style={{
                                borderLeft: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                padding: '1px',
                                minWidth: '220px',
                                backgroundColor: eachMachine.colorSubgroup || '#fff',
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
                            <TableCell
                              align="center"
                              style={{
                                borderLeft: '1px solid #e0e0e0',
                                padding: '1px',
                                minWidth: '74px',
                                width: '74px',
                                maxWidth: '74px',
                                backgroundColor: eachMachine.colorSubgroup || '#fff',
                              }}
                            >
                              {dataSeriesAverage[0] ? dataSeriesAverage[0].connected : '-'}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                borderLeft: '1px solid #e0e0e0',
                                padding: '1px',
                                minWidth: '70px',
                                width: '70px',
                                maxWidth: '70px',
                                backgroundColor: eachMachine.colorSubgroup || '#fff',
                              }}
                            >
                              {dataSeriesAverage[0] ? dataSeriesAverage[0].operating : '-'}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={{
                                borderLeft: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                padding: '1px',
                                minWidth: '72px',
                                width: '72px',
                                maxWidth: '72px',
                                backgroundColor: eachMachine.colorSubgroup || '#fff',
                              }}
                            >
                              {dataSeriesAverage[0] ? `${dataSeriesAverage[0].efficiency}%` : '-'}
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
                                        minWidth: '74px',
                                        width: '74px',
                                        maxWidth: '74px',
                                      }}
                                    >
                                      {dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].connected : '-'}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{
                                        borderLeft: '1px solid #e0e0e0',
                                        padding: '1px',
                                        minWidth: '70px',
                                        width: '70px',
                                        maxWidth: '70px',
                                      }}
                                    >
                                      {dataSeriesMachine && dataSeriesMachine.length > 0 ? dataSeriesMachine[0].operating : '-'}
                                    </TableCell>
                                    <TableCell
                                      align="center"
                                      style={{
                                        borderLeft: '1px solid #e0e0e0',
                                        borderRight: '1px solid #e0e0e0',
                                        padding: '1px',
                                        minWidth: '74px',
                                        width: '74px',
                                        maxWidth: '74px',
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
                      })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LoadDataMachinesReport;
