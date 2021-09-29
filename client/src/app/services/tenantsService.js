import axios from "axios";

const tenantsService = {
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}tenant_new/`, formData)
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
            axios.put(`${process.env.REACT_APP_REST_API_URL}tenant_new/${formData.id}`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = responseData.data;
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on update tenant... "));
                });
        });
    },
    upload: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) => resolve(response.data.data))
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on upload image... "));
                });
        });
    },
    tenantAttachment: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}tenant_personalization`, formData)
                .then((response) => resolve(response.data.data))
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on upload image... "));
                });
        });
    },
}

export default tenantsService;