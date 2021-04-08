import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import Dashboard from '../pages/Dashboard';
import Report from '../pages/Report';
import ReportMachineGroup from '../pages/ReportMachineGroup';
import Appointments from '../pages/Appointments';
import SignIn from '../pages/SignIn';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/report" component={Report} isPrivate />
    <Route path="/report-machine-group" component={ReportMachineGroup} isPrivate />
    <Route path="/appointments" component={Appointments} isPrivate />
  </Switch>
);

export default Routes;
