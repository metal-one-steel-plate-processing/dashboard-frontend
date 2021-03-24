import React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton, Tooltip } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

/* import Socketio from 'socket.io-client'; */

const StatusMachines: React.FC = () => {
  /* const [loading, setLoading] = useState(false); */
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <>
      <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs={1}>
          <Tooltip title="Return to Dashboard">
            <Typography component={Link} to="/dashboard">
              <IconButton>
                <ArrowBackIcon style={{ color: '#000' }} fontSize="large" />
              </IconButton>
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item xs={11}>
          <Box mt={isLarge ? 1 : 2}>
            <Grid container spacing={1}>
              <Grid item xs key="disabled">
                <Box
                  bgcolor="text.disabled"
                  color="background.paper"
                  pl={1}
                  component={Paper}
                >
                  <Typography noWrap variant={isLarge ? 'caption' : 'h6'}>
                    Off
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs key="warning">
                <Box
                  bgcolor="warning.main"
                  color="warning.contrastText"
                  pl={1}
                  component={Paper}
                >
                  <Typography variant={isLarge ? 'caption' : 'h6'}>
                    Setup
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs key="success">
                <Box
                  bgcolor="success.main"
                  color="success.contrastText"
                  pl={1}
                  component={Paper}
                >
                  <Typography variant={isLarge ? 'caption' : 'h6'}>
                    Production
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs key="info">
                <Box
                  bgcolor="info.main"
                  color="info.contrastText"
                  pl={1}
                  component={Paper}
                >
                  <Typography variant={isLarge ? 'caption' : 'h6'}>
                    Rework
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs key="error">
                <Box
                  bgcolor="error.main"
                  color="error.contrastText"
                  pl={1}
                  component={Paper}
                >
                  <Typography variant={isLarge ? 'caption' : 'h6'}>
                    Stop
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Box mt={isLarge ? 1 : 2} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default StatusMachines;
