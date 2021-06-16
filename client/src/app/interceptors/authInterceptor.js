import history from "../history";

export default function authInterceptor(axios, store) {
    axios.interceptors.response.use(
        (response) => {
            // Do something with response data
            return response;
        },
        (error) => {
            if (error.response.status === 401) {
                history.push("/logout");
            }
            return Promise.reject(error);
        }
    );
}
