import axios from "axios";

const deviceService = {
    get: function (limit, offset) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}device/limit/${limit}/offset/${offset}`)
                .then((response) => response.data)
                .then((responseData) => {
                    var result = [];

                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    reject(Error("Something went wrong on update devices... "));
                });
        });
    },
    upload: function (formData) {
        return new Promise(function (resolve, reject) {
            const config = {
                headers: {"Content-Type": "multipart/form-data"},
            };
            axios.post(`${process.env.REACT_APP_REST_API_URL}device/upload/`, formData, config)
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
                    reject(Error("Something went wrong on update devices... "));
                });
        });
    },
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}device/`, formData)
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
            axios.put(`${process.env.REACT_APP_REST_API_URL}device/${formData.id}`, formData)
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
    config: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}config/`, formData)
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
    provision: function(count){
        return new Promise(function(resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}device/provision/${count}`)
            .then((response) => response.data )
            .then((responseData) => {
                var result = [];

                if (responseData.code === 200) {
                    result = responseData.data;
                }
                resolve(result);
            })
            .catch(function(err) {
                console.log(err);
                reject(Error("Something went wrong on post devices provision... "));
            });
        });
    },
}

export default deviceService;