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
import { CSVLink } from 'react-csv';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
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
  table_width?: number;
  table_length?: number;
  model?: string;
  brand?: string;
  manufacturer?: string;
  power?: string;
  power_source_model?: string;
  power_source_manufacturer?: string;
  manufacturer_torch?: string;
  torch_quantity?: string;
  type_laser?: string;
  usage_tickness?: string;
  min_tickness?: string;
  max_tickness?: string;
  standard_table?: string;
  grill_lifecycle?: string;
}

interface MachineExportInterface {
  name: string;
  description: string;
  group: string;
  subgroup: string;
  low_efficiency: number;
  average_efficiency: number;
  high_efficiency: number;
  factory: string;
  table_width?: number;
  table_length?: number;
  model?: string;
  brand?: string;
  manufacturer?: string;
  power?: string;
  power_source_model?: string;
  power_source_manufacturer?: string;
  manufacturer_torch?: string;
  torch_quantity?: string;
  type_laser?: string;
  usage_tickness?: string;
  min_tickness?: string;
  max_tickness?: string;
  standard_table?: string;
  grill_lifecycle?: string;
}

interface IReceiptsExport {
  nameFile: string;
  dataExport: MachineExportInterface[];
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
    maxHeight: 340,
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
  const [DataExportCSV, setDataExportCSV] = useState<IReceiptsExport | null>(null);
  const EditMachineRef = useRef<DialogHandles>(null);
  const [CSVSeparator, setCSVSeparator] = useState(';');

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
        const dataExportArray: React.SetStateAction<MachineExportInterface[]> = [];

        if (responseSettings.data && responseSettings.data.length > 0) {
          responseSettings.data.map(
            (eachSettingsUsers: UserSettingsInterface) =>
              eachSettingsUsers.description === 'csvSeparator' && eachSettingsUsers.option1 && setCSVSeparator(eachSettingsUsers.option1),
          );
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

              dataExportArray.push({
                name: eachMachine.name,
                description: eachMachine.description,
                group: eachMachine.group,
                subgroup: eachMachine.subgroup,
                low_efficiency: eachMachine.low_efficiency,
                average_efficiency: eachMachine.average_efficiency,
                high_efficiency: eachMachine.high_efficiency,
                factory: eachMachine.factory,
                table_width: eachMachine.table_width,
                table_length: eachMachine.table_length,
                model: eachMachine.model,
                brand: eachMachine.brand,
                manufacturer: eachMachine.manufacturer,
                power: eachMachine.power,
                power_source_model: eachMachine.power_source_model,
                power_source_manufacturer: eachMachine.power_source_manufacturer,
                manufacturer_torch: eachMachine.manufacturer_torch,
                torch_quantity: eachMachine.torch_quantity,
                type_laser: eachMachine.type_laser,
                usage_tickness: eachMachine.usage_tickness,
                min_tickness: eachMachine.min_tickness,
                max_tickness: eachMachine.max_tickness,
                standard_table: eachMachine.standard_table,
                grill_lifecycle: eachMachine.grill_lifecycle,
              });
            }

            return true;
          });
          if (dataExportArray && dataExportArray.length > 0) {
            setDataExportCSV({ nameFile: `machines_${new Date().getTime()}`, dataExport: dataExportArray });
          } else {
            setDataExportCSV(null);
          }
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

  function handleDataExportCSV() {
    (document.getElementById('ButtonCSVLink') as HTMLAnchorElement).click();
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">loading machines</Typography>
      </Backdrop>
      <MachineEdit ref={EditMachineRef} reloadMachines={loadMachines} />
      <CSVLink
        style={{ display: 'none' }}
        id="ButtonCSVLink"
        filename={DataExportCSV ? `${DataExportCSV.nameFile}.csv` : 'undefined_name.csv'}
        separator={CSVSeparator}
        data={DataExportCSV ? DataExportCSV.dataExport : []}
      >
        CSV
      </CSVLink>
      <Button variant="contained" color="secondary" size="small" startIcon={<GetAppIcon />} onClick={() => handleDataExportCSV()}>
        Export CSV
      </Button>
      <Box mt={1} />
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCellIcon} />
              <TableCell style={{ minWidth: '200px' }}>Machine</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Description</TableCell>
              <TableCell style={{ minWidth: '180px' }}>Group</TableCell>
              <TableCell style={{ minWidth: '180px' }}>Subgroup</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Low Efic.</TableCell>
              <TableCell style={{ minWidth: '130px' }}>Average Efic.</TableCell>
              <TableCell style={{ minWidth: '120px' }}>High Efic.</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Factory</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Brand</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Model</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Power Manufacturer</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Power Model</TableCell>
              <TableCell style={{ minWidth: '200px' }}>Manufacturer</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Torch</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Laser</TableCell>
              <TableCell style={{ minWidth: '100px' }}>T.Length</TableCell>
              <TableCell style={{ minWidth: '100px' }}>T.Width</TableCell>
              <TableCell style={{ minWidth: '100px' }}>T.Standard</TableCell>
              <TableCell style={{ minWidth: '150px' }}>Min Tickness</TableCell>
              <TableCell style={{ minWidth: '150px' }}>Max Tickness</TableCell>
              <TableCell style={{ minWidth: '150px' }}>Usage Tickness</TableCell>
              <TableCell style={{ minWidth: '100px' }}>Power</TableCell>
              <TableCell style={{ minWidth: '150px' }}>Grill Lifecycle</TableCell>
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
                    <TableCell>{eachMachine.brand}</TableCell>
                    <TableCell>{eachMachine.model}</TableCell>
                    <TableCell>{eachMachine.power_source_manufacturer}</TableCell>
                    <TableCell>{eachMachine.power_source_model}</TableCell>
                    <TableCell>{eachMachine.manufacturer}</TableCell>
                    <TableCell>{eachMachine.torch_quantity}</TableCell>
                    <TableCell>{eachMachine.type_laser}</TableCell>
                    <TableCell>{eachMachine.table_length}</TableCell>
                    <TableCell>{eachMachine.table_width}</TableCell>
                    <TableCell>{eachMachine.standard_table}</TableCell>
                    <TableCell>{eachMachine.min_tickness}</TableCell>
                    <TableCell>{eachMachine.max_tickness}</TableCell>
                    <TableCell>{eachMachine.usage_tickness}</TableCell>
                    <TableCell>{eachMachine.power}</TableCell>
                    <TableCell>{eachMachine.grill_lifecycle}</TableCell>
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
