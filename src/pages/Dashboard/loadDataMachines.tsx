/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';

import { Box } from '@material-ui/core';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import Graphic from './graphic';

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
  file_url: string;
}

interface PropsPage {
  Date: string;
}

interface UserSettingsInterface {
  user_name: string;
  description: string;
  option1: string;
  canceled: string;
}

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const id = setInterval(() => {
      // eslint-disable-next-line no-unused-expressions
      if (savedCallback.current) savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

const LoadDataMachines: React.FC<PropsPage> = props => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);
  const [seconds, setSeconds] = useState(new Date().getTime());
  const [lastSeconds, setLastSeconds] = useState(new Date().getTime());
  const { user, FactoriesSelected, GroupsSelected, MachinesSelected } = useAuth();

  const [DataMachine, setDataMachine] = useState<DataMachineInterface[] | null>(null);

  useInterval(() => {
    setSeconds(new Date().getTime());
  }, 1000);

  useEffect(() => {
    loadMachinesSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.Date, FactoriesSelected, GroupsSelected, MachinesSelected]);

  async function loadMachinesSettings() {
    try {
      setLoading(true);

      const responseSettings = await api.get('/user-settings');
      const responseMachineSettings = await api.get('/machine-settings');
      if (responseMachineSettings.data && responseMachineSettings.data.length > 0) {
        const newMachines: React.SetStateAction<MachineInterface[]> = [];

        if (responseSettings.data && responseSettings.data.length > 0) {
          responseMachineSettings.data.map((eachMachineSettings: MachineInterface) => {
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
                  newMachines.push({
                    ...eachMachineSettings,
                    sequenceMachine: parseInt(hasMachine[0].option2 || 9999, 10),
                  });
                }
              } else if (GroupsSelected.length > 0) {
                if (GroupsSelected.indexOf(eachMachineSettings.group) >= 0) {
                  if (FactoriesSelected.length > 0) {
                    if (FactoriesSelected.indexOf(eachMachineSettings.factory) >= 0) {
                      newMachines.push({
                        ...eachMachineSettings,
                        sequenceMachine: parseInt(hasMachine[0].option2 || 9999, 10),
                      });
                    }
                  } else {
                    newMachines.push({
                      ...eachMachineSettings,
                      sequenceMachine: parseInt(hasMachine[0].option2 || 9999, 10),
                    });
                  }
                }
              } else if (FactoriesSelected.length > 0) {
                if (FactoriesSelected.indexOf(eachMachineSettings.factory) >= 0) {
                  newMachines.push({
                    ...eachMachineSettings,
                    sequenceMachine: parseInt(hasMachine[0].option2 || 9999, 10),
                  });
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

          setAllMachines(newMachines);
        }
      }
    } catch (error) {
      toast.error(`machine data not found: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (seconds - lastSeconds >= 60000) {
      loadDataMachine();
      setLastSeconds(seconds);
    }
    // loadDataMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  useEffect(() => {
    loadDataMachine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllMachines]);

  async function loadDataMachine() {
    setLoading(true);
    // setDataMachine(null);
    let newDataMachine: DataMachineInterface[] | undefined = [];

    try {
      await Promise.all(
        AllMachines.map(async eachMachine => {
          const responseMachine = await api.post('/filter-date', {
            date: props.Date,
            machine: eachMachine.name,
          });

          responseMachine.data
            .sort((dataMachine1: DataMachineInterface, dataMachine2: DataMachineInterface) =>
              dataMachine1.datatime > dataMachine2.datatime ? 1 : -1,
            )
            // eslint-disable-next-line no-loop-func
            .map((dataMachine: DataMachineInterface) => {
              if (newDataMachine) {
                newDataMachine.push({
                  ...dataMachine,
                  machine: eachMachine.description,
                });
              } else {
                newDataMachine = [{ ...dataMachine, machine: eachMachine.description }];
              }

              return true;
            });
        }),
      );

      if (newDataMachine) {
        setDataMachine(newDataMachine);
      } else {
        setDataMachine(null);
      }
    } catch (error) {
      toast.error(`machine data not found: ${error}`);
      setDataMachine(null);
    } finally {
      setLoading(false);
    }

    return true;
  }
  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading machine data</Typography>
      </Backdrop>
      <Box mt={2} />
      {DataMachine ? (
        <Graphic dataMachine={DataMachine} allMachines={AllMachines} dateMachine={props.Date} dateTimeMachine={seconds} />
      ) : (
        <div />
      )}
    </>
  );
};

export default LoadDataMachines;
