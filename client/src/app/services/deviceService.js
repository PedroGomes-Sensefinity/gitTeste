import axios from "axios";

const deviceService = {
    get: function(limit, offset) {
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}device/limit/${limit}/offset/${offset}`)
                .then(function(response) {
                    if (response.status !== 200) {
                        return [];
                    }
                
                    return response.data;
                })
                .then(function(responseData) {
                    var result = {total: 0, devices: []};
                    
                    if (typeof responseData.data !== 'undefined') {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function(err) {
                    console.log(err);
                    reject(Error("Something went wrong on get devices... "));
                });
        });
    },
    getByText: function(text, limit, offset) {
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}device/search/${text}/limit/${limit}/offset/${offset}`)
                .then(function(response){
                    if (response.status !== 200) {
                        return [];
                    }
                
                    return response.data;
                })
                .then(function(responseData){
                    var result = {total: 0, devices: []};

                    if (typeof responseData.data !== 'undefined') {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function(err) {
                    console.log(err);
                    reject(Error("Something went wrong on get devices... "));
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
}

export default deviceService;
