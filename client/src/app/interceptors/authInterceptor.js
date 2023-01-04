import { getToken } from '../services/authService';
import { history } from '../../index.js'
import templates from '../utils/links';

export default function authInterceptor(axios, store) {
    axios.interceptors.response.use(
        (response) => {
            // Do something with response data
            return response;
        },
        (error) => {
            console.log(error.response)
            if (error.response.status === 401 && getToken()) {
                history.push(templates.logout)
            }
            return Promise.reject(error);
        }
    );
}
