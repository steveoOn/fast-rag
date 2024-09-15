import axios from 'axios';

axios.defaults.headers.common['Authorization'] = '';

const post = axios.post;

export { post };
