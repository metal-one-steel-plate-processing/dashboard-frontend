import axios from 'axios';

const api = axios.create({
  baseURL: 'http://13.58.200.14:3333',
});

export default api;
