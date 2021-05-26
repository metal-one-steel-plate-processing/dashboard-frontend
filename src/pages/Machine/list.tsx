/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ForwardIcon from '@material-ui/icons/Forward';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import BrokenImageIcon from '@material-ui/icons/BrokenImage';
import { toast } from 'react-toastify';

import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import MachineEdit, { DialogHandles } from './edit';

interface MachineInterface {
  id: string;
  name: string;
  description: string;
  group: string;
  subgroup: string;
  low_efficiency: number;
  average_efficiency: number;
  high_efficiency: number;
  factory: string;
  sequenceMachine: number;
  file_url: string;
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
  container: {
    maxHeight: 440,
  },
  tableCellIcon: {
    maxWidth: 50,
    minWidth: 50,
    width: 50,
  },
}));

const MachineList: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [AllMachines, setAllMachines] = useState<MachineInterface[]>([]);
  const EditMachineRef = useRef<DialogHandles>(null);

  useEffect(() => {
    loadMachines();
  }, []);

  async function loadMachines() {
    setLoading(true);

    try {
      const responseSettings = await api.get(`/user-settings/${user.id}`);

      const responseMachine = await api.get('/machine-settings');
      if (responseMachine.data && responseMachine.data.length > 0) {
        const newMachineSettings: React.SetStateAction<MachineInterface[]> = [];

        if (responseSettings.data && responseSettings.data.length > 0) {
          responseMachine.data.map((eachMachine: MachineInterface) => {
            const hasMachine = responseSettings.data.filter(
              (eachSettingsUsers: UserSettingsInterface) =>
                eachSettingsUsers.description === eachMachine.name && eachSettingsUsers.option1 === 'allow',
            );
            if (hasMachine.length > 0) {
              newMachineSettings.push({
                ...eachMachine,
                sequenceMachine: parseInt(hasMachine[0].option2 || 9999, 10),
              });
            }

            return true;
          });
          setAllMachines(newMachineSettings);
        }
      }
    } catch (error) {
      toast.error(`Machines not found: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const handleEditMachine = (machine_id: string) => {
    EditMachineRef.current?.loadDataMachine(machine_id);
  };

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading machines</Typography>
      </Backdrop>
      <MachineEdit ref={EditMachineRef} reloadMachines={loadMachines} />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCellIcon} />
              <TableCell style={{ minWidth: '100px' }}>Machine</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Description</TableCell>
              <TableCell style={{ minWidth: '180px' }}>Group</TableCell>
              <TableCell style={{ minWidth: '180px' }}>Subgroup</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Low Efic.</TableCell>
              <TableCell style={{ minWidth: '130px' }}>Average Efic.</TableCell>
              <TableCell style={{ minWidth: '120px' }}>High Efic.</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Factory</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {AllMachines &&
              AllMachines.sort((eachMachine, eachMachine2) => (eachMachine.sequenceMachine > eachMachine2.sequenceMachine ? 1 : -1)).map(
                eachMachine => (
                  <TableRow hover key={eachMachine.id}>
                    <TableCell>
                      <IconButton color="secondary" size="small" onClick={() => handleEditMachine(eachMachine.id)}>
                        <ForwardIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Box display="flex">
                          <Avatar variant="rounded" alt={eachMachine.name} src={eachMachine.file_url}>
                            <BrokenImageIcon />
                          </Avatar>
                        </Box>
                        <Box display="flex" ml={1}>
                          {eachMachine.description}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{eachMachine.description}</TableCell>
                    <TableCell>{eachMachine.group}</TableCell>
                    <TableCell>{eachMachine.subgroup}</TableCell>
                    <TableCell>{eachMachine.low_efficiency}</TableCell>
                    <TableCell>{eachMachine.average_efficiency}</TableCell>
                    <TableCell>{eachMachine.high_efficiency}</TableCell>
                    <TableCell>{eachMachine.factory}</TableCell>
                  </TableRow>
                ),
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MachineList;
