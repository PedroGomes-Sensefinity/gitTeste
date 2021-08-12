import history from "../history";
import { getToken } from '../services/authService';

export default function authInterceptor(axios, store) {
    axios.interceptors.response.use(
        (response) => {
            // Do something with response data
            return response;
        },
        (error) => {
            if (error.response.status === 401 && getToken()) {
                history.push("/logout");
            }
            return Promise.reject(error);
        }
    );
}
