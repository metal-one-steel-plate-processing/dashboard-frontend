/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-octal */
import React from 'react';
import { parseISO, formatDuration, startOfToday } from 'date-fns';

import Highcharts from 'highcharts/highcharts-gantt';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

interface MachinesInterface {
  model: string;
  current: number;
  operating: number;
  connected: number;
  percentage: number;
  deals: DealsMachineInterface[];
}

interface DealsMachineInterface {
  status: string;
  from: number;
  to: number;
  color: string;
}

interface SeriesInterface {
  name: string;
  data: {
    id: string;
    status: string;
    start: number;
    end: number;
    y: number;
  }[];
  current: DealsMachineInterface;
  operating: number;
  connected: number;
  percentage: number;
}

interface DataMachineInterface {
  id: string;
  factory: string;
  machine: string;
  datatime: Date;
  status: string;
}

interface PropsPage {
  dataMachine: DataMachineInterface[] | null;
  allMachines: string[];
}

const GraphicDashboard: React.FC<PropsPage> = props => {
  const { map } = Highcharts;
  if (props.dataMachine && props.allMachines) {
    let machines: MachinesInterface[] | undefined;
    // eslint-disable-next-line react/prop-types
    props.allMachines.map(eachMachine => {
      let operating = 0;
      let connected = 0;
      let statusObject: DealsMachineInterface[] | undefined;
      let statusLast = '';
      let statusLastTime = startOfToday().getTime();
      let statusLastGetTime = startOfToday().getTime();

      // eslint-disable-next-line react/prop-types
      if (props.dataMachine) {
        // eslint-disable-next-line react/prop-types
        props.dataMachine
          // eslint-disable-next-line react/prop-types
          .filter(
            (dataMachine: DataMachineInterface) =>
              dataMachine.machine === eachMachine,
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
            if (statusLast && statusLast !== dataMachine.status) {
              let statusColor = '#fff';
              switch (statusLast) {
                case '0100':
                  statusColor = '#ea4335';
                  break;
                case '0190':
                  statusColor = '#34a853';
                  break;
                case '0290':
                  statusColor = '#fbbc05';
                  break;
                default:
                  break;
              }
              if (statusObject) {
                statusObject.push({
                  status: statusLast,
                  from: statusLastGetTime,
                  to: parseISO(dataMachine.datatime.toString()).getTime(),
                  color: statusColor,
                });
              } else {
                statusObject = [
                  {
                    status: statusLast,
                    from: statusLastGetTime,
                    to: parseISO(dataMachine.datatime.toString()).getTime(),
                    color: statusColor,
                  },
                ];
              }
              statusLast = dataMachine.status;
              statusLastGetTime = parseISO(
                dataMachine.datatime.toString(),
              ).getTime();
            } else if (!statusLast) {
              statusLast = dataMachine.status;
              statusLastGetTime = parseISO(
                dataMachine.datatime.toString(),
              ).getTime();
            }

            if (dataMachine.status && dataMachine.status === '0190') {
              operating += 2;
              connected += 2;
            }

            if (dataMachine.status && dataMachine.status === '0290') {
              operating += 2;
              connected += 2;
            }

            if (dataMachine.status && dataMachine.status === '0100') {
              connected += 2;
            }

            statusLastTime = parseISO(
              dataMachine.datatime.toString(),
            ).getTime();

            return true;
          });
      }

      /* if (
        !statusObject &&
        props.dataMachine &&
        (props.dataMachine.filter(
          (dataMachine: DataMachineInterface) =>
            dataMachine.machine === eachMachine,
        ).length > 0 ||
          statusLastTime !== statusLastGetTime)
      ) { */
      let statusColor = '#fff';
      switch (statusLast) {
        case '0100':
          statusColor = '#ea4335';
          break;
        case '0190':
          statusColor = '#34a853';
          break;
        case '0290':
          statusColor = '#fbbc05';
          break;
        default:
          break;
      }

      if (statusObject) {
        statusObject.push({
          status: statusLast,
          from: statusLastGetTime,
          to: statusLastTime,
          color: statusColor,
        });
      } else {
        statusObject = [
          {
            status: statusLast,
            from: statusLastGetTime,
            to: statusLastTime,
            color: statusColor,
          },
        ];
      }
      /* } */

      if (statusObject) {
        if (machines) {
          machines.push({
            model: eachMachine,
            current: 0,
            operating,
            connected,
            percentage: 0,
            deals: statusObject,
          });
        } else {
          machines = [
            {
              model: eachMachine,
              current: 0,
              operating,
              connected,
              percentage: 0,
              deals: statusObject,
            },
          ];
        }
      }

      return true;
    });

    if (machines) {
      const series = machines?.map((machine: MachinesInterface, index) => {
        const data = machine.deals.map(deal => {
          return {
            id: `deal-${index}`,
            status: deal.status,
            start: deal.from,
            end: deal.to,
            y: index,
            color: deal.color,
          };
        });
        return {
          name: machine.model,
          operating: machine.operating,
          connected: machine.connected,
          percentage: machine.percentage,
          data,
          current: machine.deals[machine.current],
        };
      });

      const newOptions = {
        series,
        title: {
          text: '',
        },
        tooltip: {
          pointFormat:
            '<span>{point.status}</span><br/><span>From: {point.start:%Y-%b-%e %H:%M:%S}</span><br/><span>To: {point.end:%Y-%b-%e %H:%M:%S}</span>',
        },
        xAxis: {
          currentDateIndicator: true,
        },
        yAxis: {
          type: 'category',
          grid: {
            columns: [
              {
                title: {
                  text: 'Machine',
                },
                categories: map(series, (s: SeriesInterface) => {
                  return s.name;
                }),
              },
              {
                title: {
                  text: '%',
                },
                categories: map(series, (s: SeriesInterface) => {
                  return (s.operating > 0 && s.connected > 0
                    ? (parseFloat(s.operating.toString()) /
                        parseFloat(s.connected.toString())) *
                      100
                    : 0
                  ).toFixed(1);
                }),
              },
              {
                title: {
                  text: 'Oper.',
                },
                categories: map(series, (s: SeriesInterface) => {
                  return formatDuration(
                    { minutes: s.operating },
                    { format: ['hours', 'minutes'] },
                  );
                }),
              },
              {
                title: {
                  text: 'On',
                },
                categories: map(series, (s: SeriesInterface) => {
                  return formatDuration(
                    { minutes: s.connected },
                    { format: ['hours', 'minutes'] },
                  );
                }),
              },
            ],
          },
        },
      };
      // setOptions(newOptions);

      return (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType="ganttChart"
          options={newOptions}
        />
      );
    }

    return <h5>No Graph 1</h5>;
  }

  return <h5>No Graph</h5>;
};

export default GraphicDashboard;
