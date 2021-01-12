/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';
import { CardActions } from '@material-ui/core';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import UserSettings from './userSettings';

interface TabPanelProps {
  // eslint-disable-next-line react/require-default-props
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface MachineInterface {
  id: string;
  name: string;
  description: string;
  group: string;
  factory: string;
}

interface GroupsInterface {
  description: string;
}

interface FactoryInterface {
  description: string;
}

interface UserSettingsInterface {
  user_name: string;
  description: string;
  option1: string;
  canceled: string;
}

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
}));

const MachineSettings: React.FC = () => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const {
    user,
    setFilterFactories,
    FactoriesSelected,
    setFilterGroups,
    GroupsSelected,
    setFilterMachines,
    MachinesSelected,
  } = useAuth();
  const [SettingsUser, setSettingsUser] = useState<UserSettingsInterface[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);
  const [MachinesFilters, setMachinesFilters] = useState<MachineInterface[]>(
    [],
  );
  const [AllGroups, setAllGroups] = useState<string[]>([]);
  const [
    FactoriesSelectedAutoComplete,
    setFactoriesSelectedAutoComplete,
  ] = useState<string[]>([]);
  const [GroupsSelectedAutocomplete, setGroupsSelectedAutocomplete] = useState<
    string[]
  >([]);
  const [AllFactories, setAllFactories] = useState<string[]>([]);

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFactoriesSelectedAutoComplete(FactoriesSelected);
    setGroupsSelectedAutocomplete(GroupsSelected);

    const machinesFiltered: MachineInterface[] = [];
    AllMachines.map(eachMachine => {
      let countMachineFactory = 0;
      let countMachineGroup = 0;
      if (FactoriesSelected.length > 0) {
        FactoriesSelected.map(eachFactory => {
          if (eachFactory === eachMachine.factory) {
            countMachineFactory += 1;
          }
          return true;
        });
      } else {
        // countMachineFactory += 1;
      }

      if (GroupsSelected.length > 0) {
        GroupsSelected.map(eachGroup => {
          if (eachMachine.group === eachGroup) {
            countMachineGroup += 1;
          }
          return true;
        });
      } else {
        // countMachineGroup += 1;
      }
      // console.log(countMahineFactory);
      /* console.log('machineFactory');
      console.log(machineFactory);
      console.log('machineGroup');
      console.log(machineGroup); */
      if (countMachineFactory > 0 || countMachineGroup > 0) {
        machinesFiltered.push(eachMachine);
        setFilterMachines([]);
      }
      return true;
    });
    setMachinesFilters(
      FactoriesSelected.length > 0 || GroupsSelected.length > 0
        ? machinesFiltered
        : AllMachines.map(eachMachine => eachMachine),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllMachines, FactoriesSelected, GroupsSelected]);

  // useEffect(() => {
  // const machines: MachineInterface[] = [];
  // setFilterMachines([]);
  // AllMachines.map(eachMachine => {
  /* let machineSelected: MachineInterface | null = { ...eachMachine };

      if (FactoriesSelected.length > 0) {
        const machineFactories = FactoriesSelected.map(
          eachFactory => eachMachine.factory === eachFactory && eachMachine,
        );
        if (!machineFactories) {
          machineSelected = null;
        }
      }
      console.log(machineSelected);
      if (GroupsSelected.length > 0) {
        GroupsSelected.map(eachGroup => {
          if (eachMachine.group === eachGroup) {
            machineSelected = eachMachine;
          }
          return true;
        });
      }

      console.log(machineSelected); */
  /* if (FactoriesSelected.length > 0) {
        const machinesFactories: MachineInterface[] = [];

        FactoriesSelected.map(eachFactory => {
          if (eachMachine.factory === eachFactory) {
            return GroupsSelected.length > 0
              ? machinesFactories.push(eachMachine)
              : machines.push(eachMachine);
          }
          return true;
        });

        if (GroupsSelected.length > 0) {
          machinesFactories.map(eachMachineFactory =>
            GroupsSelected.map(
              eachGroup =>
                eachMachineFactory.group === eachGroup &&
                machines.push(eachMachineFactory),
            ),
          );
        }
      } else if (GroupsSelected.length > 0) {
        GroupsSelected.map(
          eachGroup =>
            eachMachine.group === eachGroup && machines.push(eachMachine),
        );
      } else {
        machines.push(eachMachine);
      } */
  // return machines;
  // });
  // setMachinesFilters(machines);
  // }, [AllMachines, FactoriesSelected, GroupsSelected]);

  async function loadSettings() {
    setLoading(true);
    setAllMachines([]);
    setAllGroups([]);
    setAllFactories([]);

    try {
      const responseSettings = await api.get('/user-settings');
      if (responseSettings.data && responseSettings.data.length > 0) {
        setSettingsUser(
          responseSettings.data.filter(
            (eachSettingsUsers: UserSettingsInterface) =>
              eachSettingsUsers.user_name === user.name &&
              eachSettingsUsers.canceled === 'N',
          ),
        );
      }

      const responseMachine = await api.get('/machine-settings');
      if (responseMachine.data && responseMachine.data.length > 0) {
        // setAllMachines(responseMachine.data);
        const newMachineSettings: React.SetStateAction<MachineInterface[]> = [];

        if (responseSettings.data && responseSettings.data.length > 0) {
          responseMachine.data.map((eachMachine: MachineInterface) => {
            const hasMachine = responseSettings.data.filter(
              (eachSettingsUsers: UserSettingsInterface) =>
                eachSettingsUsers.user_name === user.name &&
                eachSettingsUsers.canceled === 'N' &&
                eachSettingsUsers.description === eachMachine.name &&
                eachSettingsUsers.option1 === 'allow',
            );
            if (hasMachine.length > 0) {
              newMachineSettings.push(eachMachine);
            }

            return true;
          });
          setAllMachines(newMachineSettings);
        }
      }

      const responseGroups = await api.get('/machine-groups');
      if (responseGroups.data && responseGroups.data.length > 0) {
        const groups = responseGroups.data.map(
          (eachGroup: GroupsInterface) => eachGroup.description,
        );
        setAllGroups(groups);
      }

      const responseFactory = await api.get('/factory');
      if (responseFactory.data && responseFactory.data.length > 0) {
        const factories = responseFactory.data.map(
          (eachFactory: FactoryInterface) => eachFactory.description,
        );
        setAllFactories(factories);
      }
    } catch (error) {
      toast.error(`Settings not found: ${error}`);
    } finally {
      setLoading(false);
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  async function handleSaveSettings() {
    try {
      const lineTables = formRef.current?.getElementsByClassName(
        'eachLineTable',
      );
      const settingsMachines: MachineInterface[] = [];
      setLoading(true);

      if (lineTables) {
        for (let j = 0; j < lineTables?.length; j += 1) {
          const dataLines = lineTables[j].children;
          if (dataLines[0].innerHTML) {
            settingsMachines.push({
              id: dataLines[0].innerHTML,
              name: dataLines[1].innerHTML,
              description: (dataLines[2].children[0].children[0]
                .children[0] as HTMLInputElement).value,
              group: (dataLines[3].children[0].children[0].children[0]
                .children[0] as HTMLInputElement).value,
              factory: (dataLines[4].children[0].children[0].children[0]
                .children[0] as HTMLInputElement).value,
            });
          }
        }
        try {
          if (settingsMachines.length === 0) {
            throw new Error('any data');
          }
          await Promise.all(
            settingsMachines.map(async (eachSettings: MachineInterface) => {
              await api.put('/machine-settings', {
                id: eachSettings.id,
                name: eachSettings.name,
                description: eachSettings.description,
                group: eachSettings.group,
                factory: eachSettings.factory,
              });
            }),
          );
          // console.log(settingsMachines);
          toast.success('updated successfully');
        } catch (error) {
          throw new Error(error);
        }
      }
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading settings</Typography>
      </Backdrop>
      <Paper>
        <Tabs value={tab} onChange={handleChangeTab}>
          <Tab label="Filters" {...a11yProps(0)} />
          <Tab label="Settings" {...a11yProps(1)} />
          <Tab label="Users" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={0}>
        <Box>
          <Card>
            <CardContent>
              <Grid spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={AllFactories}
                    value={FactoriesSelectedAutoComplete}
                    getOptionLabel={option => option}
                    onChange={(event, value) => {
                      setFilterFactories(value.map(eachValue => eachValue));
                    }}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Factories"
                      />
                    )}
                  />
                  {/* <Autocomplete
                    multiple
                    options={AllFactories}
                    getOptionLabel={option => option.description}
                    onChange={(event, value) => {
                      setFilterFactories(
                        value.map(eachValue => eachValue.description),
                      );
                    }}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Factories"
                      />
                    )}
                  /> */}
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={AllGroups}
                    value={GroupsSelectedAutocomplete}
                    getOptionLabel={option => option}
                    onChange={(event, value) => {
                      setFilterGroups(value.map(eachValue => eachValue));
                    }}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Groups"
                      />
                    )}
                  />
                  {/* <Autocomplete
                    multiple
                    options={AllGroups}
                    value={GroupsSelected.map(eachGroupSelected => {
                      return { description: eachGroupSelected };
                    })}
                    getOptionLabel={option => option.description}
                    onChange={(event, value) => {
                      setFilterGroups(
                        value.map(eachValue => eachValue.description),
                      );
                    }}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Groups"
                      />
                    )}
                  /> */}
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={MachinesFilters}
                    value={MachinesSelected}
                    onChange={(event, value) => {
                      setFilterMachines(value);
                    }}
                    getOptionLabel={option =>
                      // eslint-disable-next-line prettier/prettier
                      `${option.description} (${option.factory} - ${option.group}) `}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Machines"
                      />
                    )}
                  />

                  {/* <Autocomplete
                    multiple
                    options={FactoriesSelected.map(eachFactorySelected => {
                      return AllMachines.filter(
                        eachMachine =>
                          eachFactorySelected === eachMachine.factory,
                      );
                    })}
                    getOptionLabel={option =>
                      option.length > 0 && option.description
                    }
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Machines"
                      />
                    )}
                  /> */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>
      {SettingsUser.map(eachSettingUser => {
        if (
          eachSettingUser.description === 'userSettings' &&
          eachSettingUser.option1 === 'allow'
        ) {
          return (
            <TabPanel value={tab} index={1}>
              <form ref={formRef}>
                <Card>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      align="left"
                    >
                      Machines
                    </Typography>
                    <Divider />
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ display: 'none' }}>
                              Id
                            </TableCell>
                            <TableCell>Machine</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Group</TableCell>
                            <TableCell>Factory</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {AllMachines &&
                            AllMachines.sort((eachMachine, eachMachine2) =>
                              eachMachine.name > eachMachine2.name ? 1 : -1,
                            ).map((eachMachine, index) => (
                              <TableRow
                                key={index.toString()}
                                className="eachLineTable"
                              >
                                <TableCell style={{ display: 'none' }}>
                                  {eachMachine.id}
                                </TableCell>
                                <TableCell>{eachMachine.name}</TableCell>
                                <TableCell>
                                  <TextField
                                    fullWidth
                                    value={eachMachine.description}
                                    onChange={e => {
                                      setAllMachines(
                                        AllMachines.map(eachMachine2 => {
                                          return eachMachine2.name ===
                                            eachMachine.name
                                            ? {
                                                ...eachMachine2,
                                                description: e.target.value,
                                              }
                                            : eachMachine2;
                                        }),
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Autocomplete
                                    options={AllGroups}
                                    value={eachMachine.group}
                                    onChange={(e, newValue) => {
                                      setAllMachines(
                                        AllMachines.map(eachMachine2 => {
                                          return eachMachine2.name ===
                                            eachMachine.name
                                            ? {
                                                ...eachMachine2,
                                                group: newValue || '',
                                              }
                                            : eachMachine2;
                                        }),
                                      );
                                    }}
                                    getOptionLabel={option => option}
                                    renderInput={params => (
                                      <TextField
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...params}
                                        variant="standard"
                                      />
                                    )}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Autocomplete
                                    options={AllFactories}
                                    value={eachMachine.factory}
                                    onChange={(e, newValue) => {
                                      setAllMachines(
                                        AllMachines.map(eachMachine2 => {
                                          return eachMachine2.name ===
                                            eachMachine.name
                                            ? {
                                                ...eachMachine2,
                                                factory: newValue || '',
                                              }
                                            : eachMachine2;
                                        }),
                                      );
                                    }}
                                    getOptionLabel={option => option}
                                    renderInput={params => (
                                      <TextField
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...params}
                                        variant="standard"
                                      />
                                    )}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleSaveSettings()}
                    >
                      Save machines
                    </Button>
                  </CardActions>
                </Card>
              </form>
            </TabPanel>
          );
        }
        return true;
      })}
      {SettingsUser.map(eachSettingUser => {
        if (
          eachSettingUser.description === 'userSettings' &&
          eachSettingUser.option1 === 'allow'
        ) {
          return (
            <TabPanel value={tab} index={2}>
              <UserSettings />
            </TabPanel>
          );
        }
        return true;
      })}
    </>
  );
};

export default MachineSettings;
