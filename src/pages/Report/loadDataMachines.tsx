import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DateRangePicker, DateRange } from 'materialui-daterange-picker';
import TextField, {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from '@material-ui/core/TextField';

const LoadDataMachinesReport: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange>({});

  const toggle = () => setOpen(!open);

  return (
    <Grid container spacing={2} justify="center">
      <Grid item xs={12}>
        <Typography align="center" onClick={() => setOpen(true)}>
          {`${dateRange.startDate ? dateRange.startDate : ''}${
            dateRange.endDate ? ' to ' : ''
          }${dateRange.endDate ? dateRange.endDate : ''}`}
        </Typography>
      </Grid>
      <Grid item xs={12} md={9} lg={7} xl={5}>
        <DateRangePicker
          open={open}
          toggle={toggle}
          onChange={range => setDateRange(range)}
        />
      </Grid>
    </Grid>
  );
};

export default LoadDataMachinesReport;
