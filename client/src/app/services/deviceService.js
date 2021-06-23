import axios from "axios";

const deviceService = {
    upload: function(formData){
        return new Promise(function(resolve, reject) {
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            axios.post(`${process.env.REACT_APP_REST_API_URL}device/upload/`, formData, config)
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
                    reject(Error("Something went wrong on update devices... "));
                });
        });
    },
    saveDevice: function(formData, isAddMode){
        return new Promise(function(resolve, reject) {
            const config = {
                headers: { "Content-Type": "application/json" },
            };
            console.log(formData);
            if (isAddMode) {
                axios.post(`${process.env.REACT_APP_REST_API_URL}device/`, formData, config)
                .then((response) => response.data)
                .then((responseData) => {
                    console.log("sdasss " + responseData)
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
            }
        });
    },
}

export default deviceService;
