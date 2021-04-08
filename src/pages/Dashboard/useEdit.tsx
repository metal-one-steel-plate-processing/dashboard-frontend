/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/destructuring-assignment */
import React, { forwardRef, useState, useImperativeHandle, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { listTimeZones } from 'timezone-support';
import { toast } from 'react-toastify';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';
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
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

interface PropsPage {
  userEdit?: {
    id: string;
    name: string;
    email: string;
    canceled: string;
  };
  loadUsers?: () => void;
}

export interface DialogHandles {
  openDialog: () => void;
}

interface SettingsInterface {
  name: string;
  description: string;
  values: string[];
  defaultValue?: string;
  defaultValue2?: number;
  type?: string;
}

const UserEdit: React.ForwardRefRenderFunction<DialogHandles, PropsPage> = (props, ref) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [AllSettings, setAllSettings] = useState<SettingsInterface[]>([]);
  const timeZones = listTimeZones();
  const formEditUserRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();

  const openDialog = () => {
    setOpen(true);
    setAllSettings([]);
    loadUserData();
  };

  useImperativeHandle(ref, () => {
    return {
      openDialog,
    };
  });

  const handleClose = () => {
    setOpen(false);
  };

  async function loadUserData() {
    const newSettings: React.SetStateAction<SettingsInterface[]> = [
      {
        name: 'userSettings',
        description: 'Settings Users',
        values: ['allow', 'deny'],
      },
      {
        name: 'machineSettings',
        description: 'Settings Machines',
        values: ['allow', 'deny'],
      },
      {
        name: 'timezoneIMOP',
        description: 'Timezone IMOP',
        values: timeZones,
      },
      {
        name: 'timezoneMOSB',
        description: 'Timezone MOSB',
        values: timeZones,
      },
    ];
    const responseMachine = await api.get('/machine-settings');
    if (responseMachine.data && responseMachine.data.length > 0) {
      responseMachine.data.map((eachMachine: { name: string; description: string; factory: string }) => {
        return newSettings.push({
          name: eachMachine.name,
          description: `${eachMachine.name} ${eachMachine.description} - ( ${eachMachine.factory} )`,
          values: ['allow', 'deny'],
          type: 'machine',
        });
      });
    }
    const responseSettings = await api.get('/user-settings');
    if (responseSettings.data && responseSettings.data.length > 0) {
      setAllSettings(
        newSettings.map(eachNewSettings => {
          const hasSettings = responseSettings.data.filter(
            (eachSettings: { description: string; user_id: string; canceled: string }) =>
              eachSettings.description === eachNewSettings.name &&
              eachSettings.user_id === props.userEdit?.id &&
              eachSettings.canceled === 'N',
          );

          if (hasSettings.length > 0) {
            return {
              ...eachNewSettings,
              defaultValue: hasSettings[0].option1,
              defaultValue2: parseFloat(hasSettings[0].option2),
            };
          }

          return eachNewSettings;
        }),
      );
    } else {
      setAllSettings(newSettings);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  async function handleSaveUser() {
    try {
      const lineTables = formEditUserRef.current?.getElementsByClassName('eachLineTableEditUser');
      const settingsUsers: string | any[] = [];
      setLoading(true);

      if (lineTables) {
        for (let j = 0; j < lineTables?.length; j += 1) {
          const dataLines = lineTables[j].children;
          if (dataLines[0].innerHTML) {
            settingsUsers.push({
              description: dataLines[0].innerHTML,
              option1: (dataLines[2].children[0].children[0].children[0].children[0] as HTMLInputElement).value,
              option2: (dataLines[3].children[0].children[0].children[0] as HTMLInputElement).value,
            });
          }
        }
        try {
          if (settingsUsers.length === 0) {
            throw new Error('any data');
          }
          // console.log(settingsUsers);

          await api.post('/user-settings', {
            user_logged: user.name,
            user_id: props.userEdit?.id,
            user_name: props.userEdit?.name,
            user_email: props.userEdit?.email,
            settings: settingsUsers,
          });

          toast.success('updated successfully');
          handleClose();
          props.loadUsers && props.loadUsers();
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle id="alert-dialog-title">User</DialogTitle>
        <DialogContent>
          <form ref={formEditUserRef}>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <TextField fullWidth label="Name" value={props.userEdit?.name} />
              </Grid>
              <Grid item xs={7}>
                <TextField fullWidth label="Email" value={props.userEdit?.email} />
              </Grid>
              {/* <Grid item xs={1}>
                <Autocomplete
                  options={['Y', 'N']}
                  getOptionLabel={option => option}
                  disableClearable
                  defaultValue={props.userEdit?.canceled}
                  renderInput={params => (
                    <TextField
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      variant="standard"
                      label="Inactive"
                    />
                  )}
                />
              </Grid> */}
            </Grid>
            <Box mt={2} />
            <Tabs value={tab} onChange={handleChangeTab}>
              <Tab label="Settings" {...a11yProps(0)} />
            </Tabs>
            <TabPanel value={tab} index={0}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ display: 'none' }}>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell />
                      <TableCell width={50}>Sequence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {AllSettings &&
                      AllSettings.sort((eachSettings, eachSettings2) => {
                        if (eachSettings.defaultValue2 && eachSettings2.defaultValue2) {
                          return eachSettings.defaultValue2 > eachSettings2.defaultValue2 ? 1 : -1;
                        }
                        return 0;
                      }).map((eachSettings, index) => (
                        <TableRow key={index.toString()} className="eachLineTableEditUser">
                          <TableCell style={{ display: 'none' }}>{`${eachSettings.name}`}</TableCell>
                          <TableCell>{`${eachSettings.description}`}</TableCell>
                          <TableCell>
                            <Autocomplete
                              options={eachSettings.values}
                              getOptionLabel={option => option}
                              disableClearable
                              defaultValue={eachSettings.defaultValue}
                              id={eachSettings.name}
                              renderInput={params => (
                                <TextField
                                  // eslint-disable-next-line react/jsx-props-no-spreading
                                  {...params}
                                  variant="standard"
                                  name={eachSettings.name}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            {eachSettings.type && eachSettings.type === 'machine' ? (
                              <TextField defaultValue={eachSettings.defaultValue2} name="sequence" type="number" />
                            ) : (
                              <TextField disabled name="sequence" type="number" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSaveUser()} variant="outlined" color="secondary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default forwardRef(UserEdit);
// export default UserEdit;
