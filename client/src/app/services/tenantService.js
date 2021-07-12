import axios from "axios";

const tenantService = {
    getInfo: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}tenant/info/`, formData)
                .then((response) => response.data)
                .then((result) => {
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on get tenant info... "));
                });
        });
    },
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}tenant/`, formData)
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
                    reject(Error("Something went wrong on save tenant... "));
                });
        });
    },
    update: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}tenant/${formData.id}`, formData)
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
                    reject(Error("Something went wrong on update tenants... "));
                });
        });
    },
}

export default tenantService;
