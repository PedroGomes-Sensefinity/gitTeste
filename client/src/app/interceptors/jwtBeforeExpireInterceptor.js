import {
    getToken,
    checkJwtIsCloseToExpire,
    signIn,
    setToken,
} from '../services/authService';

let isRefreshing = false;

export default function jwtBeforeExpire(axios, store) {
    axios.interceptors.request.use(
        (response) => {
            const authToken = getToken();

            if (authToken && checkJwtIsCloseToExpire() && !isRefreshing) {
                isRefreshing = true;
                signIn()
                    .then((response) => response.data)
                    .then((r) => {
                        let tenant = r.data.token[0];
                        setToken(tenant.hash);
                        isRefreshing = false;
                    })
                    .catch((r) => {
                        console.log(r);
                    });
            }

            return response;
        },
        (err) => Promise.reject(err)
    );
}
