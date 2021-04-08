import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ForwardIcon from '@material-ui/icons/Forward';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

import IconButton from '@material-ui/core/IconButton';

import { toast } from 'react-toastify';
import BackdropComponent from '../../components/BackdropComponent';
import api from '../../services/api';
import MachineGroupRegister, { DialogHandlesGroupRegister } from './groupRegister';
import MachineGroupEdit, { DialogHandlesGroupEdit } from './groupEdit';

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: 440,
  },
  tableCellIcon: {
    maxWidth: 50,
    minWidth: 50,
    width: 50,
  },
}));
interface GroupsInterface {
  id: string;
  description: string;
  nivel: string;
}

const MachineGroupList: React.FC = () => {
  const classes = useStyles();
  const [AllGroups, setAllGroups] = useState<GroupsInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const RegisterGroupRef = useRef<DialogHandlesGroupRegister>(null);
  const EditGroupRef = useRef<DialogHandlesGroupEdit>(null);

  useEffect(() => {
    loadMachinesGroups();
  }, []);

  async function loadMachinesGroups() {
    try {
      setLoading(true);
      const responseGroups = await api.get('/machine-groups');
      if (responseGroups.data && responseGroups.data.length > 0) {
        const groups = responseGroups.data;
        setAllGroups(groups);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleGroupRegister = () => {
    return RegisterGroupRef.current && RegisterGroupRef.current.machineGroupRegister();
  };
  const handleGroupEdit = (id: string) => {
    return EditGroupRef.current && EditGroupRef.current.machineGroupEdit(id);
  };

  return (
    <>
      <BackdropComponent state={loading} message="Loading Machine Data" />
      <MachineGroupRegister ref={RegisterGroupRef} reloadGroups={loadMachinesGroups} />
      <MachineGroupEdit ref={EditGroupRef} reloadGroups={loadMachinesGroups} />
      <Button variant="contained" color="secondary" size="small" onClick={handleGroupRegister}>
        New
      </Button>
      <Box mt={1} />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCellIcon} />
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {AllGroups &&
              AllGroups.sort((eachGroup, eachGroup2) => (eachGroup.description > eachGroup2.description ? 1 : -1)).map(eachGroup => (
                <TableRow hover key={eachGroup.id}>
                  <TableCell>
                    <IconButton color="secondary" size="small" onClick={() => handleGroupEdit(eachGroup.id)}>
                      <ForwardIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{eachGroup.description}</TableCell>
                  <TableCell>{eachGroup.nivel}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MachineGroupList;
