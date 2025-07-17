import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Replace with your FastAPI base URL
  headers: {
    'Accept': 'application/json',
  },
});

export default api;
