import React, { useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Form } from '@unform/web';
import { TextField } from 'unform-material-ui';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import background from '../../assets/background1.jpg';

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
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const formRef = useRef(null);
  const loading = false;

  function handleSubmit() {
    console.log('ok');
  }
  // const loading = useSelector(state => state.auth.loading);
  // const [backdrop, setBackdrop] = useState(loading);

  // async function handleSubmit({ email, password }) {
  //   try {
  //     // Remove all previous errors
  //     formRef.current.setErrors({});
  //     const schema = Yup.object().shape({
  //       email: Yup.string()
  //         .email()
  //         .required(),
  //       password: Yup.string()
  //         .min(4)
  //         .required(),
  //     });
  //     await schema.validate(
  //       { email, password },
  //       {
  //         abortEarly: false,
  //       }
  //     );
  //     // Validation passed
  //     dispatch(signInRequest(email, password));
  //   } catch (err) {
  //     const validationErrors = {};
  //     if (err instanceof Yup.ValidationError) {
  //       err.inner.forEach(error => {
  //         validationErrors[error.path] = error.message;
  //       });
  //       formRef.current.setErrors(validationErrors);
  //     }
  //   }
  // }
  return (
    <Box className={classes.authRoot}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Account Login
          </Typography>
          <Form ref={formRef} className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {loading ? 'Carregando' : 'Acessar'}
            </Button>
          </Form>
        </div>
      </Container>
    </Box>
  );
}
