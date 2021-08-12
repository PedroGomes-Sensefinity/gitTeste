import axios from "axios";

const thresholdService = {
    getBySpec: function (spec, id) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}threshold/${spec}/${id}/limit/100/offset/0`)
                .then((response) => response.data)
                .then((responseData) => {
                    var result = [];

                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on get thresholds of device... "));
                });
        });
    },
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}threshold/`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on update devices... "));
                });
        });
    },
    update: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}threshold/${formData.id}`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on update devices... "));
                });
        });
    },
}

export default thresholdService;