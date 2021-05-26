/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
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
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';

import { toast } from 'react-toastify';
import { GithubPicker, ColorResult } from 'react-color';
import 'react-color-palette/lib/css/styles.css';

import BackdropComponent from '../../components/BackdropComponent';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import noImg from '../../assets/not-available.png';

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

interface PropsComponenteImage {
  img: string;
  handleSubmitImg: (file: File) => void;
  handleSubmitImgRemove: () => void;
}

function ComponenteImage(props: PropsComponenteImage) {
  const { img, handleSubmitImg, handleSubmitImgRemove } = props;
  return (
    <Card>
      <CardActionArea>
        <CardMedia style={{ height: '400px' }} image={img || noImg} title="machine img" />
      </CardActionArea>
      <CardActions>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          type="file"
          id="contained-button-file-card"
          onChange={e => e.target.files && handleSubmitImg(e.target.files[0])}
        />
        <Button size="small" disabled={!!img} color="secondary" onClick={() => handleSubmitImgRemove()}>
          Remove
        </Button>
        <label htmlFor="contained-button-file-card">
          <Button size="small" color="secondary" component="span">
            alter
          </Button>
        </label>
      </CardActions>
    </Card>
  );
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
  const [ColorPickerLow, setColorPickerLow] = useState('#ffffff');
  const [ColorPickerAverage, setColorPickerAverage] = useState('#ffffff');
  const [ColorPickerHigh, setColorPickerHigh] = useState('#ffffff');
  const [MachineImg, setMachineImg] = useState('');
  const { user } = useAuth();
  const MyTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const colorsPiker = [
    '#f1eeee',
    '#B80000',
    '#DB3E00',
    '#FCCB00',
    '#008B02',
    '#006B76',
    '#1273DE',
    '#004DCF',
    '#5300EB',
    '#ffffff',
    '#EB9694',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#C4DEF6',
    '#BED3F3',
    '#D4C4FB',
  ];

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
        (document.querySelector("[name='brand']") as HTMLInputElement).value = dataMachine.brand;
        (document.querySelector("[name='model']") as HTMLInputElement).value = dataMachine.model;
        (document.querySelector("[name='table_length']") as HTMLInputElement).value = dataMachine.table_length;
        (document.querySelector("[name='table_width']") as HTMLInputElement).value = dataMachine.table_width;
        (document.querySelector("[name='auto_feeding']") as HTMLInputElement).value = dataMachine.auto_feeding;
        (document.querySelector("[name='capacity']") as HTMLInputElement).value = dataMachine.capacity;
        (document.querySelector("[name='speed']") as HTMLInputElement).value = dataMachine.speed;
        (document.querySelector("[name='memo']") as HTMLInputElement).value = dataMachine.memo;
      } catch (error) {
        toast.error(`Error setFormdata : ${error.message}`);
      }

      // console.log(lowColor[0]);
      setGroupSelected(dataMachine.group);
      setSubgroupSelected(dataMachine.subgroup);
      setFactorySelected(dataMachine.factory);
      dataMachine.low_color && setColorPickerLow(dataMachine.low_color);
      dataMachine.average_color && setColorPickerAverage(dataMachine.average_color);
      dataMachine.high_color && setColorPickerHigh(dataMachine.high_color);
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
            low_color: ColorPickerLow,
            high_color: ColorPickerHigh,
            average_color: ColorPickerAverage,
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
        toast.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleSubmitImgRemove() {
    try {
      setLoading(true);
      const idMachine = inputRefIdEditMachine.current?.value;

      if (idMachine) {
        await api.post('machine-settings-image/delete', {
          id: idMachine,
          user: user.name,
          user_id: user.id,
          timezone: MyTimezone,
        });
        setMachineImg('');
        toast.success('Removed Image!');
      } else {
        throw new Error('Id Form not found');
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  function handleChangeColorLow(color: ColorResult) {
    setColorPickerLow(color.hex);
  }
  function handleChangeColorAverage(color: ColorResult) {
    setColorPickerAverage(color.hex);
  }
  function handleChangeColorHigh(color: ColorResult) {
    setColorPickerHigh(color.hex);
  }

  return (
    <>
      <Dialog fullWidth maxWidth="lg" open={OpenMachineEdit}>
        <DialogTitle>Machine Edit</DialogTitle>
        <DialogContent>
          <BackdropComponent state={loading} message="Loading Machine Data" />
          <form ref={formRefEditMachine} autoComplete="off" className="classFormEditMachine">
            <Grid container spacing={1}>
              <Grid item xs={12} md={5} lg={4}>
                <ComponenteImage img={MachineImg} handleSubmitImg={handleSubmitImg} handleSubmitImgRemove={handleSubmitImgRemove} />
              </Grid>
              <Grid item xs={12} md={7} lg={8}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} lg={3}>
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
                  <Grid item xs={12} sm={6} lg={3}>
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
                  <Grid item xs={12} lg={6}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Description" name="machineDescription" />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={3}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Brand" name="brand" />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={3}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Model" name="model" />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={3}>
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
                  <Grid item xs={12} sm={4} lg={3}>
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Table Length"
                      name="table_length"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                      }}
                      helperText="In millimeters"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Table Width"
                      name="table_width"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">mm</InputAdornment>,
                      }}
                      helperText="In millimeters"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={2}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Auto feeding" name="auto_feeding" />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={2}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Capacity" name="capacity" />
                  </Grid>
                  <Grid item xs={12} sm={4} lg={2}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Speed" name="speed" />
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} label="Memo" name="memo" />
                  </Grid>
                  <Grid item xs={12} sm={4} lg>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Low Efficiency Over"
                      name="low_efficiency"
                      type="number"
                    />
                    {ColorPickerLow !== '#ffffff' && <Box style={{ backgroundColor: ColorPickerLow, height: '20px' }} />}
                    <Box mt={1} style={{ maxWidth: '237px' }}>
                      <GithubPicker colors={colorsPiker} width="100%" color={ColorPickerLow} onChange={handleChangeColorLow} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} lg>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="Average Efficiency Over"
                      name="average_efficiency"
                      type="number"
                    />
                    {ColorPickerAverage !== '#ffffff' && <Box style={{ backgroundColor: ColorPickerAverage, height: '20px' }} />}
                    <Box mt={1} style={{ maxWidth: '237px' }}>
                      <GithubPicker colors={colorsPiker} width="100%" color={ColorPickerAverage} onChange={handleChangeColorAverage} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} lg>
                    <TextField
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      label="High Efficiency Over"
                      name="high_efficiency"
                      type="number"
                    />
                    {ColorPickerHigh !== '#ffffff' && <Box style={{ backgroundColor: ColorPickerHigh, height: '20px' }} />}
                    <Box mt={1} style={{ maxWidth: '237px' }}>
                      <GithubPicker colors={colorsPiker} width="100%" color={ColorPickerHigh} onChange={handleChangeColorHigh} />
                    </Box>
                  </Grid>
                </Grid>
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
