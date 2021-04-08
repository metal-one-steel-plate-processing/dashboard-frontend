import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdropComponent: {
      zIndex: theme.zIndex.tooltip + 1,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
    },
    progress: {
      width: '50%',
      marginBottom: 10,
    },
  }),
);

interface InterfaceProps {
  state?: boolean;
  message?: string;
}

const BackdropComponent: React.FC<InterfaceProps> = props => {
  const classes = useStyles();
  const backdropProps = props;

  return (
    <div>
      <Backdrop className={classes.backdropComponent} style={{ zIndex: 9999 }} open={backdropProps.state ? backdropProps.state : false}>
        <LinearProgress className={classes.progress} color="secondary" />
        <Typography align="center">{backdropProps.message ? backdropProps.message : 'loading'}</Typography>
      </Backdrop>
    </div>
  );
};

export default BackdropComponent;
