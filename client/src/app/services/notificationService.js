import axios from "axios";

const notificationService = {
    get: function(type, status, dateStart, dateEnd, limit, offset){
        return new Promise(function(resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}notification/${type}/bydates/${dateStart}/${dateEnd}/status/${status}/limit/${limit}/offset/${offset}`)
            .then(function(response){
                if (response.status !== 200) {
                    return [];
                } else {
                    return response.json();
                }
            })
            .then(function(responseData){
                var result = [];
                if (typeof responseData.data !== 'undefined') {
                    result = responseData.data.alarms;
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
                    console.log(err);
                    reject(Error("Something went wrong on get count of notifications... "));
                });
        });
    }
}

export default notificationService;