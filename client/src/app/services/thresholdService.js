import axios from "axios";

const thresholdService = {
    getByDevice: function (device) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}threshold/bydevice/${device}/limit/100/offset/0`)
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
    }
}

export default thresholdService;