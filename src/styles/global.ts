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

  .status0100{
    background-color: #ea4335;
    color: #ea4335;
  }
  .status0190{
    background-color: #34a853;
    color: #34a853;
  }
  .status0290{
    background-color: #fbbc05;
    color: #fbbc05;
  }
  .status0390{
    background-color: #34a853;
    color: #34a853;
  }
`;
