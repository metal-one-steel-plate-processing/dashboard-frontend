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

  .high{
    background-color: #20bf55;
    color: #fff;
  }
  .middle{
    background-color: #0b4f6c;
    color: #fff;
  }
  .low{
    background-color: #01baef;
    color: #fff;
  }
  .status0100{
    background-color: #f44336;
    color: #f44336;
  }
  .status0101{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0102{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0103{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0180{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0181{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0182{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0183{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0190{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0190{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0380{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0382{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0383{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0500{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0580{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status8188{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status8588{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0290{
    background-color: #4caf50;
    color: #4caf50;
  }
  .status0390{
    background-color: #4caf50;
    color: #4caf50;
  }
`;
