import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://3.20.238.219:3333',

  // baseURL: 'http://localhost:3333',

  baseURL: 'https://apidashboard.mosb.com.br',
});

export default api;
