import { createGlobalStyle } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body{

    -webkit-font-smoothing: antialiased;
  }

  body, input, button{
    font-family: Roboto, sans-serif;
  }
  /* .Toastify{
    position: fixed;
    z-index: 9999;
  } */

  #root{
    min-height: 100vh
  }
`;
