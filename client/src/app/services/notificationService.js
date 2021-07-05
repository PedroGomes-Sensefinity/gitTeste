import axios from "axios";

const notificationService = {
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