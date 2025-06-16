import axios from 'axios';
import qs from 'qs';  // qs muss installiert sein

const api = axios.create({
  baseURL: 'http://localhost:5080/api',
  paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
});

export default api;
