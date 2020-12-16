import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { TextField } from 'unform-material-ui';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { useAuth } from '../../hooks/AuthContext';
import background from '../../assets/image.jpg';

interface LoginProps {
  email: string;
  password: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  authRoot: {
    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark'
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // border: '2px solid #FFF',
    borderRadius: '5px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    padding: theme.spacing(4),
  },
  labelProps: {
    color: 'rgb(186, 215, 246)',
    fontSize: '14px',
  },
  input: {
    color: 'rgb(186, 215, 246)',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ValidationTextField = withStyles({
  root: {
    '& input:valid + fieldset': {
      borderColor: 'rgb(186, 215, 246)',
      borderWidth: 2,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: '#FFF',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FFF',
      },
    },
    '& label.Mui-focused': {
      color: '#FFF',
    },
  },
})(TextField);

const SignIn: React.FC = () => {
  const classes = useStyles();
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();

  function Copyright() {
    return (
      <Typography variant="body1" color="textPrimary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://www.mosb.com">
          MOSB
          {new Date().getFullYear()}
        </Link>
      </Typography>
    );
  }

  async function handleSubmit({ email, password }: LoginProps) {
    formRef.current?.setErrors({});

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    await schema.validate(
      { email, password },
      {
        abortEarly: false,
      },
    );

    signIn({
      email,
      password,
    });
  }

  return (
    <Box className={classes.authRoot}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid style={{ justifyContent: 'flex-start' }}>
          <div
            className={classes.paper}
            style={{
              paddingTop: '100px',
            }}
          >
            <Typography style={{ color: '#FFF' }} component="h1" variant="h5">
              Account Login
            </Typography>
            <Form
              ref={formRef}
              className={classes.form}
              onSubmit={handleSubmit}
            >
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                InputLabelProps={{
                  className: classes.labelProps,
                }}
                inputProps={{
                  className: classes.input,
                }}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <EmailIcon style={{ color: '#FFF' }} />
                //     </InputAdornment>
                //   ),
                // }}
              />
              <ValidationTextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                InputLabelProps={{
                  className: classes.labelProps,
                }}
                inputProps={{
                  className: classes.input,
                }}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <LockIcon style={{ color: '#FFF' }} />
                //     </InputAdornment>
                //   ),
                // }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                <Typography style={{ color: '#204098' }} component="h6">
                  Login
                </Typography>
              </Button>
            </Form>
          </div>
        </Grid>
      </Container>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Box>
  );
};

export default SignIn;
