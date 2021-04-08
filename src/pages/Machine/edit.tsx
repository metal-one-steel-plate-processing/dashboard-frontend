/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { toast } from 'react-toastify';
import ColorPicker, { useColor, toColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';

import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { Theme, useTheme } from '@material-ui/core/styles';
import BackdropComponent from '../../components/BackdropComponent';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import noImg from '../../assets/not-available.png';

type BreakpointOrNull = Breakpoint | null;

export interface DialogHandles {
  loadDataMachine: (id: string) => void;
}

interface InterfaceProps {
  reloadMachines: () => void;
}

interface GroupsInterface {
  description: string;
  nivel: string;
}

interface FactoryInterface {
  description: string;
}

const MachineEdit: React.ForwardRefRenderFunction<DialogHandles, InterfaceProps> = (props, ref) => {
  const [loading, setLoading] = useState(false);
  const [OpenMachineEdit, setOpenMachineEdit] = useState(false);
  const formRefEditMachine = useRef<HTMLFormElement>(null);
  const inputRefIdEditMachine = useRef<HTMLInputElement>(null);
  const [AllGroups, setAllGroups] = useState<string[]>([]);
  const [AllSubgroups, setAllSubgroups] = useState<string[]>([]);
  const [GroupSelected, setGroupSelected] = useState('');
  const [SubgroupSelected, setSubgroupSelected] = useState('');
  const [AllFactories, setAllFactories] = useState<string[]>([]);
  const [FactorySelected, setFactorySelected] = useState('');
  const [ColorLow, setColorLow] = useColor('hex', '#ffffff');
  const [ColorAverage, setColorAvarege] = useColor('hex', '#ffffff');
  const [ColorHigh, setColorHigh] = useColor('hex', '#ffffff');
  const [MachineImg, setMachineImg] = useState('');
  const { user } = useAuth();
  const MyTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
        return 160;
      default:
        return 200;
    }
  };
  async function loadDataMachine(id: string) {
    try {
      setOpenMachineEdit(true);
      setLoading(true);
      setAllGroups([]);
      setAllFactories([]);
      setGroupSelected('');
      setSubgroupSelected('');
      setFactorySelected('');
      setMachineImg('');
      formRefEditMachine.current?.reset();

      const responseGroups = await api.get('/machine-groups');
      if (responseGroups.data && responseGroups.data.length > 0) {
        const groups = responseGroups.data
          .filter((eachGroup: GroupsInterface) => eachGroup.nivel === 'Group')
          .map((eachGroup: GroupsInterface) => eachGroup.description);
        const subgroups = responseGroups.data
          .filter((eachGroup: GroupsInterface) => eachGroup.nivel === 'Subgroup')
          .map((eachGroup: GroupsInterface) => eachGroup.description);
        setAllGroups(groups);
        setAllSubgroups(subgroups);
      }

      const responseFactory = await api.get('/factory');
      if (responseFactory.data && responseFactory.data.length > 0) {
        const factories = responseFactory.data.map((eachFactory: FactoryInterface) => eachFactory.description);
        setAllFactories(factories);
      }

      const responseMachine = await api.get(`machine-settings/${id}`);
      const dataMachine = responseMachine.data;

      try {
        (document.querySelector("[name='machineId']") as HTMLInputElement).value = dataMachine.id;
        (document.querySelector("[name='machineName']") as HTMLInputElement).value = dataMachine.name;
        (document.querySelector("[name='machineDescription']") as HTMLInputElement).value = dataMachine.description;
        (document.querySelector("[name='low_efficiency']") as HTMLInputElement).value = dataMachine.low_efficiency;
        (document.querySelector("[name='average_efficiency']") as HTMLInputElement).value = dataMachine.average_efficiency;
        (document.querySelector("[name='high_efficiency']") as HTMLInputElement).value = dataMachine.high_efficiency;
      } catch (error) {
        toast.error(`Error setFormdata : ${error.message}`);
      }

      // console.log(lowColor[0]);
      setGroupSelected(dataMachine.group);
      setSubgroupSelected(dataMachine.subgroup);
      setFactorySelected(dataMachine.factory);
      setColorLow(toColor('hex', dataMachine.low_color || '#ffffff'));
      setColorAvarege(toColor('hex', dataMachine.average_color || '#ffffff'));
      setColorHigh(toColor('hex', dataMachine.high_color || '#ffffff'));
      dataMachine.file_url && setMachineImg(dataMachine.file_url);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  useImperativeHandle(ref, () => {
    return {
      loadDataMachine,
    };
  });

  const handleClose = () => {
    setOpenMachineEdit(false);
  };

  async function handleSubmit() {
    try {
      setLoading(true);

      const inputs = formRefEditMachine.current?.elements;
      const idMachine = inputRefIdEditMachine.current?.value;

      if (idMachine) {
        try {
          let data = {
            low_color: ColorLow.hex,
            high_color: ColorHigh.hex,
            average_color: ColorAverage.hex,
            group: GroupSelected,
            subgroup: SubgroupSelected,
            factory: FactorySelected,
            id: idMachine,
            user: user.name,
            user_id: user.id,
            timezone: MyTimezone,
          };
          if (inputs) {
            for (let i = 0; i < inputs?.length; i += 1) {
              const valueInput = (inputs[i] as HTMLInputElement).value;
              const nameInput = (inputs[i] as HTMLInputElement).name;
              const tipoInput = (inputs[i] as HTMLInputElement).type;

              if (tipoInput === 'text') {
                data = { ...data, [nameInput]: valueInput };
              }

              if (tipoInput === 'number') {
                // eslint-disable-next-line radix
                data = { ...data, [nameInput]: parseInt(valueInput) };
              }
            }
          }
          await api.put('machine-settings', data);
          toast.success('Updated Success!');
          props.reloadMachines();
          handleClose();
        } catch (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error('Id Form not found');
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitImg(file: File) {
    if (file) {
      try {
        setLoading(true);
        const idMachine = inputRefIdEditMachine.current?.value;

        if (idMachine) {
          const dataFile = new FormData();
          dataFile.append('id', idMachine);
          dataFile.append('user', user.name);
          dataFile.append('user_id', user.id);
          dataFile.append('timezone', MyTimezone);
          dataFile.append('file', file);

          const responseUpdateImg = await api.post('machine-settings-image', dataFile);
          responseUpdateImg.data && setMachineImg(responseUpdateImg.data.file_url);
          toast.success('Updated Image!');
        } else {
          throw new Error('Id Form not found');
        }
      } catch (error) {
        toast.error(`Erro ao salvar: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={OpenMachineEdit}>
        <DialogTitle>Machine Edit</DialogTitle>
        <DialogContent>
          <BackdropComponent state={loading} message="Loading Machine Data" />
          <form ref={formRefEditMachine} autoComplete="off" className="classFormEditMachine">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={2}>
                <TextField style={{ display: 'none' }} inputRef={inputRefIdEditMachine} name="machineId" />
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ readOnly: true }}
                  label="Machine"
                  name="machineName"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <TextField fullWidth InputLabelProps={{ shrink: true }} label="Description" name="machineDescription" />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Autocomplete
                  options={AllFactories}
                  value={FactorySelected}
                  getOptionLabel={option => option}
                  onChange={(event, value) => setFactorySelected(value || '')}
                  renderInput={params => (
                    <TextField
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      variant="standard"
                      label="Factory"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={AllGroups}
                  value={GroupSelected}
                  getOptionLabel={option => option}
                  onChange={(event, value) => setGroupSelected(value || '')}
                  renderInput={params => (
                    <TextField
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      variant="standard"
                      label="Group"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={AllSubgroups}
                  value={SubgroupSelected}
                  getOptionLabel={option => option}
                  onChange={(event, value) => setSubgroupSelected(value || '')}
                  renderInput={params => (
                    <TextField
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      variant="standard"
                      label="Subgroup"
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box mt={2} />
            <Grid container justify="center" spacing={1}>
              <Grid item xs={12} sm={4} md={4} lg={2}>
                <Card elevation={0} variant="outlined">
                  <CardContent>
                    <ColorPicker width={widthImg()} color={ColorLow} onChange={setColorLow} hideRGB hideHSB />
                  </CardContent>
                  <CardActions>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Low Efficiency Over"
                      name="low_efficiency"
                      type="number"
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2}>
                <Card elevation={0} variant="outlined">
                  <CardContent>
                    <ColorPicker width={widthImg()} color={ColorAverage} onChange={setColorAvarege} hideRGB hideHSB />
                  </CardContent>
                  <CardActions>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Average Efficiency Over"
                      name="average_efficiency"
                      type="number"
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={2}>
                <Card elevation={0} variant="outlined">
                  <CardContent>
                    <ColorPicker width={widthImg()} color={ColorHigh} onChange={setColorHigh} hideRGB hideHSB />
                  </CardContent>
                  <CardActions>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="High Efficiency Over"
                      name="high_efficiency"
                      type="number"
                    />
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <Card elevation={0} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} justify="center">
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        type="file"
                        id="contained-button-file"
                        onChange={e => e.target.files && handleSubmitImg(e.target.files[0])}
                      />
                      <List dense>
                        <label htmlFor="contained-button-file">
                          <ListItem button>
                            <img src={MachineImg || noImg} alt="img" width={widthImg() * 2} />
                          </ListItem>
                        </label>
                      </List>
                    </Grid>
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
    </>
  );
};

export default forwardRef(MachineEdit);
