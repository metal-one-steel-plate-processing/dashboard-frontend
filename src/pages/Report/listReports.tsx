import React from 'react';
import { Link as LinkRD } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import TimelineIcon from '@material-ui/icons/Timeline';
import ViewHeadlineIcon from '@material-ui/icons/ViewHeadline';

const ReportList: React.FC = () => {
  return (
    <>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button component={LinkRD} to="/">
          <ListItemIcon>
            <ViewHeadlineIcon />
          </ListItemIcon>
          <ListItemText primary="Real Time" />
        </ListItem>
        <ListItem button component={LinkRD} to="/report">
          <ListItemIcon>
            <TimelineIcon />
          </ListItemIcon>
          <ListItemText primary="Interval" />
        </ListItem>
        <ListItem button component={LinkRD} to="/report-machine-group">
          <ListItemIcon>
            <VerticalSplitIcon />
          </ListItemIcon>
          <ListItemText primary="Interval Machine Group" />
        </ListItem>
      </List>
    </>
  );
};

export default ReportList;
