import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const MachineSettings: React.FC = () => {
  const allMachines = [
    {
      tableBd: 'machine001',
      name: '',
      group: '',
      factory: '',
    },
    {
      tableBd: 'machine002',
      name: '',
      group: '',
      factory: '',
    },
    {
      tableBd: 'machine003',
      name: '',
      group: '',
      factory: '',
    },
    {
      tableBd: 'machine004',
      name: '',
      group: '',
      factory: '',
    },
    {
      tableBd: 'machine005',
      name: '',
      group: '',
      factory: '',
    },
  ];

  const groups = [
    {
      name: 'Cutting',
    },
    {
      name: 'Machining Center',
    },
  ];

  const factories = [
    {
      name: 'MOSB',
    },
    {
      name: 'IMOP',
    },
  ];
  return (
    <>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" align="left">
            Settings
          </Typography>
          <Divider />
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Machine</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Factory</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allMachines.map((eachMachine, index) => (
                  <TableRow key={index.toString()}>
                    <TableCell>{eachMachine.tableBd}</TableCell>
                    <TableCell>{eachMachine.name}</TableCell>
                    <TableCell>{eachMachine.group}</TableCell>
                    <TableCell>{eachMachine.factory}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Box mt={2} />
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" align="left">
            Filters
          </Typography>
          <Divider />
          <Grid spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={factories}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    variant="standard"
                    label="Factories"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={groups}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    variant="standard"
                    label="Groups"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={allMachines}
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    variant="standard"
                    label="Machines"
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default MachineSettings;
