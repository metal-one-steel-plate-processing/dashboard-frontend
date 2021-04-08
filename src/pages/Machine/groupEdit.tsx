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
import ColorPicker, { toColor, useColor } from 'react-color-palette';
import { toast } from 'react-toastify';
import BackdropComponent from '../../components/BackdropComponent';

import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import 'react-color-palette/lib/css/styles.css';

type BreakpointOrNull = Breakpoint | null;

export interface DialogHandlesGroupEdit {
  machineGroupEdit: (id: string) => void;
}

interface InterfaceProps {
  reloadGroups: () => void;
}

const MachineGroupEdit: React.ForwardRefRenderFunction<DialogHandlesGroupEdit, InterfaceProps> = (props, ref) => {
  const [loading, setLoading] = useState(false);
  const [TypeEdit, setTypeEdit] = useState('');
  const [OpenMachineGroupEdit, setOpenMachineGroupEdit] = useState(false);
  const [ColorLow, setColorLow] = useColor('hex', '#ffffff');
  const [ColorAverage, setColorAvarege] = useColor('hex', '#ffffff');
  const [ColorHigh, setColorHigh] = useColor('hex', '#ffffff');
  const formRefEditMachineGroup = useRef<HTMLFormElement>(null);
  const inputRefIdEditMachineGroup = useRef<HTMLInputElement>(null);
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

  const machineGroupEdit = async (id: string) => {
    setOpenMachineGroupEdit(true);
    setTypeEdit('');
    try {
      setLoading(true);
      const responseGroupEdit = await api.get(`/machine-groups/${id}`);

      try {
        (document.querySelector(" .formRefEditMachineGroup [name='id']") as HTMLInputElement).value = responseGroupEdit.data.id;
        (document.querySelector(" .formRefEditMachineGroup [name='groupCode']") as HTMLInputElement).value = responseGroupEdit.data.name;
        (document.querySelector(" .formRefEditMachineGroup [name='groupName']") as HTMLInputElement).value =
          responseGroupEdit.data.description;
        (document.querySelector(" .formRefEditMachineGroup [name='low_efficiency']") as HTMLInputElement).value =
          responseGroupEdit.data.low_efficiency;
        (document.querySelector(" .formRefEditMachineGroup [name='average_efficiency']") as HTMLInputElement).value =
          responseGroupEdit.data.average_efficiency;
        (document.querySelector(" .formRefEditMachineGroup [name='high_efficiency']") as HTMLInputElement).value =
          responseGroupEdit.data.high_efficiency;
      } catch (error) {
        toast.error(`Error setFormdata : ${error.message}`);
      }

      setTypeEdit(responseGroupEdit.data.nivel);
      setColorLow(toColor('hex', responseGroupEdit.data.low_color || '#ffffff'));
      setColorAvarege(toColor('hex', responseGroupEdit.data.average_color || '#ffffff'));
      setColorHigh(toColor('hex', responseGroupEdit.data.high_color || '#ffffff'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      machineGroupEdit,
    };
  });

  const handleCloseEdit = () => {
    setOpenMachineGroupEdit(false);
  };

  async function handleSubmitEdit() {
    try {
      setLoading(true);
      const inputs = formRefEditMachineGroup.current?.elements;
      let data = {};
      data = {
        ...data,
        nivel: TypeEdit,
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

          if (tipoInput === 'text') {
            if (nameInput === 'groupCode') {
              data = { ...data, name: valueInput };
            } else if (nameInput === 'groupName') {
              data = { ...data, description: valueInput };
            } else {
              data = { ...data, [nameInput]: valueInput };
            }
          }

          if (tipoInput === 'number') {
            data = { ...data, [nameInput]: parseFloat(valueInput) };
          }
        }
      }
      await api.put('machine-groups', data);
      toast.success('Saved Success!');
      handleCloseEdit();
      props.reloadGroups();
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog fullWidth maxWidth="md" open={OpenMachineGroupEdit}>
      <DialogTitle>{`${TypeEdit || ''} Edit`}</DialogTitle>
      <DialogContent>
        <BackdropComponent state={loading} message="Saving machine group data" />
        <form ref={formRefEditMachineGroup} autoComplete="off" className="formRefEditMachineGroup">
          <Grid container spacing={1}>
            <Grid item xs={12} md={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup row name="position" value={TypeEdit} onChange={(e, value) => setTypeEdit(value)}>
                  <FormControlLabel value="Group" control={<Radio color="primary" />} label="Group" labelPlacement="end" />
                  <FormControlLabel value="Subgroup" control={<Radio color="primary" />} label="Subgroup" labelPlacement="end" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField style={{ display: 'none' }} inputRef={inputRefIdEditMachineGroup} name="id" />
              <TextField
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{ readOnly: true }}
                disabled
                label="Code"
                name="groupCode"
              />
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField fullWidth InputLabelProps={{ shrink: true }} label="Name" name="groupName" />
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
        <Button onClick={handleCloseEdit} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={() => handleSubmitEdit()} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default forwardRef(MachineGroupEdit);
