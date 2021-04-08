import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { Theme, useTheme } from '@material-ui/core/styles';
import ColorPicker, { useColor } from 'react-color-palette';
import { toast } from 'react-toastify';
import BackdropComponent from '../../components/BackdropComponent';

import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import 'react-color-palette/lib/css/styles.css';

type BreakpointOrNull = Breakpoint | null;

export interface DialogHandlesGroupRegister {
  machineGroupRegister: () => void;
}

interface InterfaceProps {
  reloadGroups: () => void;
}

const MachineGroupRegister: React.ForwardRefRenderFunction<DialogHandlesGroupRegister, InterfaceProps> = (props, ref) => {
  const [loading, setLoading] = useState(false);
  const [TypeRegister, setTypeRegister] = useState('Group');
  const [OpenMachineGroupRegister, setOpenMachineGroupRegister] = useState(false);
  const [ColorLow, setColorLow] = useColor('hex', '#ffffff');
  const [ColorAverage, setColorAvarege] = useColor('hex', '#ffffff');
  const [ColorHigh, setColorHigh] = useColor('hex', '#ffffff');
  const formRefRegisterMachineGroup = useRef<HTMLFormElement>(null);
  const { user } = useAuth();

  function useWidth() {
    const theme: Theme = useTheme();
    const keys: Breakpoint[] = [...theme.breakpoints.keys].reverse();
    return (
      keys.reduce((output: BreakpointOrNull, key: Breakpoint) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useMediaQuery(theme.breakpoints.up(key));
        return !output && matches ? key : output;
      }, null) || 'xs'
    );
  }
  const brackpointValue = useWidth();

  const widthImg = () => {
    switch (brackpointValue) {
      case 'xs':
        return 215;
      case 'sm':
        return 150;
      case 'md':
        return 250;
      case 'lg':
        return 180;
      default:
        return 200;
    }
  };

  const machineGroupRegister = () => {
    setOpenMachineGroupRegister(true);
  };

  useImperativeHandle(ref, () => {
    return {
      machineGroupRegister,
    };
  });

  const handleClose = () => {
    setOpenMachineGroupRegister(false);
  };

  async function handleSubmit() {
    try {
      setLoading(true);
      const inputs = formRefRegisterMachineGroup.current?.elements;
      let data = {};
      data = {
        ...data,
        nivel: TypeRegister,
        low_color: ColorLow.hex,
        high_color: ColorHigh.hex,
        average_color: ColorAverage.hex,
        user: user.name,
      };
      if (inputs) {
        for (let i = 0; i < inputs?.length; i += 1) {
          const valueInput = (inputs[i] as HTMLInputElement).value;
          const nameInput = (inputs[i] as HTMLInputElement).name;
          const tipoInput = (inputs[i] as HTMLInputElement).type;

          if (tipoInput === 'text' || tipoInput === 'number') {
            if (nameInput === 'groupCode') {
              data = { ...data, name: valueInput };
            } else if (nameInput === 'groupName') {
              data = { ...data, description: valueInput };
            } else {
              data = { ...data, [nameInput]: valueInput };
            }
          }
        }
      }
      await api.post('machine-groups', data);
      toast.success('Saved Success!');
      handleClose();
      props.reloadGroups();
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" open={OpenMachineGroupRegister}>
      <DialogTitle>{`${TypeRegister} Register`}</DialogTitle>
      <DialogContent>
        <BackdropComponent state={loading} message="Saving machine group data" />
        <form ref={formRefRegisterMachineGroup} autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={12} md={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup row name="position" value={TypeRegister} onChange={(e, value) => setTypeRegister(value)}>
                  <FormControlLabel value="Group" control={<Radio color="primary" />} label="Group" labelPlacement="end" />
                  <FormControlLabel value="Subgroup" control={<Radio color="primary" />} label="Subgroup" labelPlacement="end" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField fullWidth label="Code" name="groupCode" />
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField fullWidth label="Name" name="groupName" />
            </Grid>
          </Grid>
          <Box mt={1} />
          <Grid container justify="center" spacing={1}>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Card elevation={0} variant="outlined">
                <CardContent>
                  <ColorPicker width={widthImg()} color={ColorLow} onChange={setColorLow} hideRGB hideHSB />
                  <TextField fullWidth InputLabelProps={{ shrink: true }} label="Low Efficiency Over" name="low_efficiency" type="number" />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Card elevation={0} variant="outlined">
                <CardContent>
                  <ColorPicker width={widthImg()} color={ColorAverage} onChange={setColorAvarege} hideRGB hideHSB />
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="Average Efficiency Over"
                    name="average_efficiency"
                    type="number"
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={3}>
              <Card elevation={0} variant="outlined">
                <CardContent>
                  <ColorPicker width={widthImg()} color={ColorHigh} onChange={setColorHigh} hideRGB hideHSB />
                  <TextField
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    label="High Efficiency Over"
                    name="high_efficiency"
                    type="number"
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => handleSubmit()} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default forwardRef(MachineGroupRegister);
