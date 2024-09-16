import axios from 'axios';

axios.defaults.headers.common['Authorization'] = '';

const post = axios.post;
const get = axios.get;
const del = axios.delete;

export { post, get, del };
