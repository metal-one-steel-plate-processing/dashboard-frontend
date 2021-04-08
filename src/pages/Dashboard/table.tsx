/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ptLocale from 'date-fns/locale/pt-BR';
// import parseISO  from 'date-fns/parseISO';
import { format, utcToZonedTime } from 'date-fns-tz';

interface DataMachineInterface {
  id: string;
  factory: string;
  machine: string;
  datatime: Date;
  status: string;
}

interface PropsPage {
  allMachines: string[];
  dataMahchines: DataMachineInterface[] | null;
}

function handleFormatDate(data: string | number | Date) {
  const dataFormatada = data
    ? format(utcToZonedTime(data, 'Europe/London'), 'yyyy-MM-dd HH:mm:ss', {
        timeZone: 'Europe/London',
        locale: ptLocale,
      })
    : '';
  return dataFormatada;
}

const DashboardTable: React.FC<PropsPage> = props => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Factory</TableCell>
          <TableCell>Machine</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.dataMahchines &&
          props.dataMahchines.map((row: { id: string; factory: string; machine: string; datatime: Date; status: string }, index) => (
            <TableRow key={`${row.id}`}>
              <TableCell>{index}</TableCell>
              <TableCell>{row.factory}</TableCell>
              <TableCell>{row.machine}</TableCell>
              <TableCell>{handleFormatDate(row.datatime)}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default DashboardTable;
