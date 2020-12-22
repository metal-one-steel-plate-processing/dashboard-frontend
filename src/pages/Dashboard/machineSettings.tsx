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
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);
  const [AllGroups, setAllGroups] = useState<GroupsInterface[]>([]);
  const [AllFactories, setAllFactories] = useState<FactoryInterface[]>([]);
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setAllMachines([]);
    setAllGroups([]);
    setAllFactories([]);

    try {
      const responseMachine = await api.get('/machine-settings');
      if (responseMachine.data && responseMachine.data.length > 0) {
        setAllMachines(responseMachine.data);
      }

      const responseGroups = await api.get('/machine-groups');
      if (responseGroups.data && responseGroups.data.length > 0) {
        setAllGroups(
          responseGroups.data.map((eachGroup: GroupsInterface) => {
            return { description: eachGroup.description };
          }),
        );
      }

      const responseFactory = await api.get('/factory');
      if (responseFactory.data && responseFactory.data.length > 0) {
        setAllFactories(
          responseFactory.data.map((eachFactory: FactoryInterface) => {
            return {
              description: eachFactory.description,
            };
          }),
        );
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
        </Tabs>
      </Paper>
      <TabPanel value={tab} index={0}>
        <Box display="none">
          <Card>
            <CardContent>
              <Grid spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={AllFactories}
                    getOptionLabel={option => option.description}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Factories"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={AllGroups}
                    getOptionLabel={option => option.description}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Groups"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={AllMachines}
                    getOptionLabel={option => option.description}
                    renderInput={params => (
                      <TextField
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...params}
                        variant="standard"
                        label="Machines"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button variant="outlined" color="secondary">
                Save filters
              </Button>
            </CardActions>
          </Card>
        </Box>
      </TabPanel>
      <Box display={user.name !== 'Demo' ? 'block' : 'none'}>
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
                        <TableCell style={{ display: 'none' }}>Id</TableCell>
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
                                value={{
                                  description: eachMachine.group,
                                }}
                                onChange={(e, newValue) => {
                                  setAllMachines(
                                    AllMachines.map(eachMachine2 => {
                                      return eachMachine2.name ===
                                        eachMachine.name
                                        ? {
                                            ...eachMachine2,
                                            group: newValue?.description
                                              ? newValue.description
                                              : '',
                                          }
                                        : eachMachine2;
                                    }),
                                  );
                                }}
                                getOptionLabel={option => option.description}
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
                                value={{
                                  description: eachMachine.factory,
                                }}
                                onChange={(e, newValue) => {
                                  setAllMachines(
                                    AllMachines.map(eachMachine2 => {
                                      return eachMachine2.name ===
                                        eachMachine.name
                                        ? {
                                            ...eachMachine2,
                                            factory: newValue?.description
                                              ? newValue.description
                                              : '',
                                          }
                                        : eachMachine2;
                                    }),
                                  );
                                }}
                                getOptionLabel={option => option.description}
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
      </Box>
    </>
  );
};

export default MachineSettings;
