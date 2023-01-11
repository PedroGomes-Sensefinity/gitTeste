import axios from "axios";

const operationsServiceV2 = {
    save: function (endpoint, formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}v2/operations/` + endpoint, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    const toResolve = responseData.data.threshold
                    console.log(toResolve)
                    resolve(toResolve)
                })
                .catch(function (err) {
                    reject(err.response.data);
                });
        });
    },
}

export default operationsServiceV2;