import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import { toast } from 'react-toastify';

import api from '../../services/api';
import EditUser, { DialogHandles } from './useEdit';

interface UserInterface {
  id: string;
  name: string;
  email: string;
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

const UserSettings: React.FC = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [AllUsers, setAllUsers] = useState<UserInterface[]>([]);
  const [UserEdit, setUserEdit] = useState<UserInterface | undefined>();
  const dialogRef = useRef<DialogHandles>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (UserEdit) {
      dialogRef.current?.openDialog();
    }
  }, [UserEdit]);

  async function loadUsers() {
    setLoading(true);

    try {
      const responseMachine = await api.get('/users');
      if (responseMachine.data && responseMachine.data.length > 0) {
        setAllUsers(responseMachine.data);
      }
    } catch (error) {
      toast.error(`Users not found: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading users</Typography>
      </Backdrop>
      <EditUser userEdit={UserEdit} ref={dialogRef} loadUsers={loadUsers} />
      <Card>
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {AllUsers &&
                  AllUsers.sort((eachUser, eachUser2) =>
                    eachUser.name > eachUser2.name ? 1 : -1,
                  ).map((eachUser, index) => (
                    <TableRow
                      key={index.toString()}
                      className="eachLineTable"
                      hover
                      onClick={() => {
                        setUserEdit({
                          id: eachUser.id,
                          name: eachUser.name,
                          email: eachUser.email,
                          canceled: eachUser.canceled,
                        });

                        return true;
                      }}
                    >
                      <TableCell>
                        <ForwardIcon color="secondary" />
                      </TableCell>
                      <TableCell>{eachUser.id}</TableCell>
                      <TableCell>{eachUser.name}</TableCell>
                      <TableCell>{eachUser.email}</TableCell>
                      <TableCell>
                        {eachUser.canceled === 'Y' ? 'yes' : 'no'}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default UserSettings;
