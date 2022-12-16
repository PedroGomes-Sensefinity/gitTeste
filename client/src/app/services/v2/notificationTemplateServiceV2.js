import axios from "axios";

const notificationTemplateServiceV2 = {
    create: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}v2/notification-templates`, formData)
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
    update: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}v2/notification-templates/${formData.id}`, formData)
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
    getByID: function(id) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}v2/notification-templates/${id}`)
                .then((response) => response.data)
                .then((responseData) => {
                    console.log(responseData)
                    if(responseData.status === "OK") {
                        resolve(responseData.data.notification_template)
                    } else {
                        resolve(undefined)
                    }
                })
                .catch((err) => {
                    reject(err.response.data);
                });
        });
    }
}

export default notificationTemplateServiceV2;