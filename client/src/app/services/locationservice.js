import axios from "axios";

const locationService = {
    save: function (id,formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}v2/locations`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err.response.data);
                });
        });
    },
    update: function (id,formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}v2/locations/${id}`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err.response.data);
                });
        });
    },
}

export default locationService;