/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react';
import { startOfDay, endOfDay, format } from 'date-fns';
import { convertToTimeZone } from 'date-fns-timezone/dist/convertToTimeZone';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

interface DealsMachineInterface {
  status: string;
  from: number;
  dayfrom: Date;
  to: number;
  dayto: Date;
  marginLeftDiv: number;
  widthDiv: number;
  id: string;
}

interface SeriesTableInterface {
  name: string;
  factory: string;
  operating?: number;
  connected?: number;
  deals: DealsMachineInterface[] | null;
}

interface DataMachineInterface {
  id: string;
  factory: string;
  machine: string;
  datatime: Date;
  status: string;
}

interface NewTitleDateInterface {
  title: string;
  dayTitle: Date;
  widthTitleDiv: number;
}

interface MachineInterface {
  id: string;
  name: string;
  description: string;
  group: string;
  factory: string;
}

interface PropsPage {
  dataMachine: DataMachineInterface[] | null;
  dateMachine: string | undefined;
  allMachines: MachineInterface[];
}

const useStyles = makeStyles(theme => ({
  graphicDiv: {
    backgroundColor: theme.palette.background.default,
  },
  graphicDivConnected: {
    padding: 1,
    color: '#fff',
    backgroundColor: '#db4437',
  },
  graphicDivOperating: {
    padding: 1,
    color: '#fff',
    backgroundColor: '#0f9d58',
  },
}));

const GraphicDashboard: React.FC<PropsPage> = props => {
  const classes = useStyles();
  const timeZone = 'GMT';
  const newDate = convertToTimeZone(
    props.dateMachine ? new Date(props.dateMachine) : new Date(),
    { timeZone },
  );
  const getTimeStart = startOfDay(newDate).getTime();
  const getTimeEnd = endOfDay(newDate).getTime();
  const getTimeDiff = ((getTimeEnd - getTimeStart) / 72000).toFixed(0);
  const [SeriesTable, setSeriesTable] = useState<SeriesTableInterface[] | null>(
    null,
  );
  const [TitleDate, setTitleDate] = useState<NewTitleDateInterface[] | null>(
    null,
  );
  useEffect(() => {
    let newSeriesTable: SeriesTableInterface[] | undefined;
    let newTitleDate: NewTitleDateInterface[] | undefined;
    for (let i = getTimeStart; i <= getTimeEnd; i += 3600000) {
      if (newTitleDate) {
        newTitleDate.push({
          title: format(new Date(i), 'HH:mm'),
          dayTitle: new Date(i),
          widthTitleDiv: 50,
        });
      } else {
        newTitleDate = [
          {
            title: format(new Date(i), 'HH:mm'),
            dayTitle: new Date(i),
            widthTitleDiv: 50,
          },
        ];
      }
    }
    if (newTitleDate && newTitleDate?.length > 0) {
      setTitleDate(newTitleDate);
    }
    // console.log(new Date(getTimeStart));
    // console.log(getTimeStart);
    // console.log(newTitleDate);
    if (props.dataMachine && props.allMachines) {
      // let machines: MachinesInterface[] | undefined;
      // eslint-disable-next-line react/prop-types
      props.allMachines.map(eachMachine => {
        let operating = 0;
        let connected = 0;
        let statusObject: DealsMachineInterface[] | undefined;
        let statusLast = '';
        // let statusLastTime = getTimeStart;
        let statusLastGetTime = getTimeStart;
        let marginLeftDivLast = 0;

        if (props.dataMachine) {
          // eslint-disable-next-line react/prop-types
          props.dataMachine
            // eslint-disable-next-line react/prop-types
            .filter(
              (dataMachine: DataMachineInterface) =>
                dataMachine.machine === eachMachine.description,
            )
            // eslint-disable-next-line react/prop-types
            .sort(
              (
                dataMachine1: DataMachineInterface,
                dataMachine2: DataMachineInterface,
              ) => (dataMachine1.datatime > dataMachine2.datatime ? 1 : -1),
            )
            // eslint-disable-next-line no-loop-func
            .map((dataMachine: DataMachineInterface) => {
              const dateConverTimeZone = convertToTimeZone(
                new Date(dataMachine.datatime),
                {
                  timeZone,
                },
              );
              if (statusLast && statusLast !== `status${dataMachine.status}`) {
                if (statusObject) {
                  statusObject.push({
                    status: statusLast,
                    from: statusLastGetTime,
                    dayfrom: new Date(statusLastGetTime),
                    to: dateConverTimeZone.getTime(),
                    dayto: dateConverTimeZone,
                    marginLeftDiv: marginLeftDivLast,
                    widthDiv:
                      (dateConverTimeZone.getTime() - statusLastGetTime) /
                      72000,
                    id: dataMachine.id,
                  });
                } else {
                  statusObject = [
                    {
                      status: statusLast,
                      from: statusLastGetTime,
                      dayfrom: new Date(statusLastGetTime),
                      to: dateConverTimeZone.getTime(),
                      dayto: dateConverTimeZone,
                      marginLeftDiv: marginLeftDivLast,
                      widthDiv:
                        (dateConverTimeZone.getTime() - statusLastGetTime) /
                        72000,
                      id: dataMachine.id,
                    },
                  ];
                }
                statusLast = `status${dataMachine.status}`;
                statusLastGetTime = dateConverTimeZone.getTime();
                marginLeftDivLast = 0;
              } else if (!statusLast) {
                statusLast = `status${dataMachine.status}`;
                statusLastGetTime = dateConverTimeZone.getTime();
                marginLeftDivLast =
                  (dateConverTimeZone.getTime() - getTimeStart) / 72000;
              }

              // statusLastTime = dateConverTimeZone.getTime();

              if (dataMachine.status && dataMachine.status === '0190') {
                operating += 2;
                connected += 2;
              }

              if (dataMachine.status && dataMachine.status === '0290') {
                operating += 2;
                connected += 2;
              }

              if (dataMachine.status && dataMachine.status === '0390') {
                operating += 2;
                connected += 2;
              }

              if (dataMachine.status && dataMachine.status === '0100') {
                connected += 2;
              }

              return true;
            });
        }
        /* const getTimeNow = new Date().getTime();

        if (statusObject) {
          statusObject.push({
            status: statusLast,
            from: statusLastGetTime,
            dayfrom: new Date(statusLastGetTime),
            to: statusLastTime,
            dayto: new Date(statusLastTime),
            marginLeftDiv: (statusLastTime - getTimeEnd) / 72000,
            widthDiv: 1,
            id: '',
          });
        } else {
          statusObject = [
            {
              status: statusLast,
              from: statusLastGetTime,
              dayfrom: new Date(statusLastGetTime),
              to: statusLastTime,
              dayto: new Date(statusLastTime),
              marginLeftDiv: (statusLastTime - getTimeEnd) / 72000,
              widthDiv: 1,
              id: '',
            },
          ];
        } */

        if (newSeriesTable) {
          newSeriesTable.push({
            name: eachMachine.description,
            factory: eachMachine.factory,
            operating,
            connected,
            deals: statusObject || null,
          });
        } else {
          newSeriesTable = [
            {
              name: eachMachine.description,
              factory: eachMachine.factory,
              operating,
              connected,
              deals: statusObject || null,
            },
          ];
        }

        return true;
      });
      // console.log(newSeriesTable);
      if (newSeriesTable) {
        setSeriesTable(newSeriesTable);
      }
    }
  }, [getTimeEnd, getTimeStart, props.allMachines, props.dataMachine]);

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Machine</TableCell>
            <TableCell>Factory</TableCell>
            <TableCell>Connected</TableCell>
            <TableCell>Operating</TableCell>
            <TableCell>Efficiency</TableCell>
            <TableCell>
              <div style={{ width: `${getTimeDiff}px`, float: 'left' }}>
                {TitleDate?.map((eachTitle: NewTitleDateInterface) => {
                  return (
                    <>
                      <div
                        style={{
                          width: eachTitle.widthTitleDiv,
                          float: 'left',
                        }}
                      >
                        {eachTitle.title}
                      </div>
                    </>
                  );
                })}
              </div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {SeriesTable &&
            SeriesTable.sort((eachSeries, eachSeries2) =>
              eachSeries.factory > eachSeries2.factory ? 1 : -1,
            ).map((eachSeries: SeriesTableInterface, index: number) => (
              <TableRow key={index.toString()}>
                <TableCell>{eachSeries.name}</TableCell>
                <TableCell>{eachSeries.factory}</TableCell>
                <TableCell>
                  <div className={classes.graphicDivConnected}>
                    {`${eachSeries.connected} min`}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={classes.graphicDivOperating}>
                    {`${eachSeries.operating}  min`}
                  </div>
                </TableCell>
                <TableCell>
                  {eachSeries.connected &&
                  eachSeries.connected > 0 &&
                  eachSeries.operating &&
                  eachSeries.operating > 0
                    ? `${(
                        (parseFloat(eachSeries.operating.toString()) /
                          parseFloat(eachSeries.connected.toString())) *
                        100
                      ).toFixed(2)} %`
                    : +' %'}
                </TableCell>
                <TableCell>
                  <div
                    className={classes.graphicDiv}
                    style={{ width: `${getTimeDiff}px`, float: 'left' }}
                  >
                    {eachSeries.deals
                      ? eachSeries.deals.map(
                          (eachDeal: DealsMachineInterface) => {
                            return (
                              <>
                                <div
                                  className={eachDeal.status}
                                  style={{
                                    marginLeft: eachDeal.marginLeftDiv,
                                    width: eachDeal.widthDiv,
                                    float: 'left',
                                  }}
                                >
                                  <span style={{ display: 'none' }}>
                                    {`${eachDeal.status} - ${eachDeal.marginLeftDiv}`}
                                  </span>
                                  .
                                </div>

                                {/* <div
                                className={eachDeal.status}
                                style={{
                                  width: eachDeal.widthDiv,
                                  float: 'left',
                                }}
                              >
                                .
                              </div> */}
                              </>
                            );
                          },
                        )
                      : '- '}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GraphicDashboard;
