import axios from "axios";

const deviceThresholdService = {
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}devicethreshold/`, formData)
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
                    reject(Error("Something went wrong on save device thresholds... "));
                });
        });
    },
    getByThreshold: function(deviceId, limit, offset){
        return new Promise(function(resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}device/bythreshold/${deviceId}/limit/${limit}/offset/${offset}`)
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

export default deviceThresholdService;