import axios from "axios";

const notificationService = {
    get: function(type, status, dateStart, dateEnd, limit, offset){
        return new Promise(function(resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}notification/${type}/bydates/${dateStart}/${dateEnd}/status/${status}/limit/${limit}/offset/${offset}`)
                .then(function(response) {
                    if (response.status !== 200) {
                        return [];
                    }

                    return response.data;
                })
                .then((response) => {
                    let result = [];

                    if (typeof response.data !== 'undefined') {
                        result = response.data;
                    }
                    resolve(result);
                })
                .catch(function(err) {
                    console.log(err);
                    reject(Error("Something went wrong on get notifications... "));
                });
        });
    },
    count: function (type, status, dateStart, dateEnd) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}notification/${type}/bydates/${dateStart}/${dateEnd}/count/status/${status}`)
                .then((response) => response.data)
                .then((responseData) => {
                    var result = [];

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
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}notificationstemplate/`, formData)
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
                    reject(Error("Something went wrong on save notification template... "));
                });
        });
    },
    update: function (formData) {
        console.log(formData)
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}notificationstemplate/${formData.id}`, formData)
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
                    reject(Error("Something went wrong on update template... "));
                });
        });
    },
}

export default notificationService;