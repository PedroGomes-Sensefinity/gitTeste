import axios from "axios";

const apiService = {
    get: function(endpoint, limit, offset){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/limit/${limit}/offset/${offset}`)
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
                    reject(Error("Something went wrong on get " + endpoint + "... "));
                });
        });
    },
    getByText: function(endpoint, text, limit, offset){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/search/${text}/limit/${limit}/offset/${offset}`)
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
                    reject(Error("Something went wrong on get " + endpoint + " ... "));
                });
        });
    },
    getById: function(endpoint, id) {
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/${id}`)
                .then(function(response){
                    if (response.status !== 200) {
                        return [];
                    }
                
                    return response.data;
                })
                .then(function(responseData){
                    var result = {total: 0, device: []};

                    if (typeof responseData.data !== 'undefined') {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function(err) {
                    console.log(err);
                    reject(Error("Something went wrong on get " + endpoint + " by id... "));
                });
        });
    },
    count: function(endpoint) {
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/count/`)
                .then(function(response){
                    if (response.status !== 200) {
                        return [];
                    }
                
                    return response.data;
                })
                .then(function(responseData){
                    var result = {total: 0, device: []};

                    if (typeof responseData.data !== 'undefined') {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function(err) {
                    console.log(err);
                    reject(Error(`Something went wrong on count of ${endpoint}... `));
                });
        });
    },
}

export default apiService;
