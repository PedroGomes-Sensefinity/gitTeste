import { getToken } from '../app/services/authService';

export default function setupAxios(axios, store) {
    axios.interceptors.request.use(
        (config) => {
            const authToken = getToken();

            if (authToken) {
                config.headers['Token'] = authToken;
            }

            /**
             * Common headers
             */
            if (typeof config.headers['Content-Type'] === 'undefined') {
                config.headers['Content-Type']  = 'application/json';
            }
            config.headers['Cache-Control'] = 'no-cache';
            config.headers['Accept']        = 'application/json';
            config.headers['Version']       = process.env.REACT_APP_REST_API_VERSION;

            return config;
        },
        (err) => Promise.reject(err)
    );
}