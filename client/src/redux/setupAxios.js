export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers['Token'] = authToken;
      }

      /**
       * Common headers
       */
      config.headers['Content-Type'] = 'text/plain';
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Accept'] = 'application/json';
      config.headers['Version'] = process.env.REACT_APP_REST_API_VERSION;

      return config;
    },
    err => Promise.reject(err)
  );
}
