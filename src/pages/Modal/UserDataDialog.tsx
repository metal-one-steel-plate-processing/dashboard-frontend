import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import Grid from '@material-ui/core/Grid';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';

export interface ModalHandles {
  openModal: (id: string) => void;
}

interface UserProps {
  id: string;
  name: string;
  email: string;
}

const ModalUser: React.ForwardRefRenderFunction<ModalHandles> = (
  props,
  ref,
) => {
  const [visible, setVisible] = useState(false);
  const [userData, setUserData] = useState({} as UserProps);
  const formRefChangePassword = useRef<HTMLFormElement>(null);
  const MyTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { signOut } = useAuth();

  async function openModal(id: string) {
    const response = await api.get(`users/${id}`);
    setUserData(response.data);
    setVisible(true);
  }

  async function handleChangePassword() {
    try {
      const inputs = formRefChangePassword.current?.elements;
      let data = {
        email: userData.email,
        page: 'pages/modal/UserDataDialog',
        timezone: MyTimezone,
      };
      if (inputs) {
        for (let i = 0; i < inputs?.length; i += 1) {
          const valueInput = (inputs[i] as HTMLInputElement).value;
          const nameInput = (inputs[i] as HTMLInputElement).name;
          const tipoInput = (inputs[i] as HTMLInputElement).type;
          if (tipoInput === 'password') {
            data = { ...data, [nameInput]: valueInput };
          }
        }
      }

      await api.post('/user-change-password', data);
      toast.success('Password changed successfully, please login again');
      signOut();
      setVisible(false);
    } catch (error) {
      toast.error(
        'Error when changing your password, please check your credentials',
      );
    }
  }

  useImperativeHandle(ref, () => {
    return { openModal };
  });

  function handleCloseModal() {
    setVisible(false);
  }

  return (
    <Dialog open={visible}>
      <DialogTitle>User Data</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Typography variant="h6">
            Name:
            {userData.name}
          </Typography>
          <Typography variant="h6">
            E-mail:
            {userData.email}
          </Typography>

          <form ref={formRefChangePassword}>
            <Grid xs={12}>
              <TextField
                autoFocus
                margin="dense"
                label="Enter the current password"
                fullWidth
                type="password"
                name="password"
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                margin="dense"
                label="Enter the new password"
                fullWidth
                name="new_password"
                type="password"
              />
            </Grid>

            <Grid xs={12}>
              <TextField
                margin="dense"
                label="Confirm the new password"
                name="confirmation_password"
                type="password"
                fullWidth
              />
            </Grid>

            <DialogActions>
              <Button color="secondary" onClick={() => handleCloseModal()}>
                Back
              </Button>
              <Button color="primary" onClick={() => handleChangePassword()}>
                Send
              </Button>
            </DialogActions>
          </form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default forwardRef(ModalUser);
