import axios from "axios";

const apiServiceV2 = {
    
    get: function(endpoint){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}`)
                .then(function(response) {
                    let data = [];
                    if (response.status === 200) {
                        data = response.data.data;
                    }
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err.response.data);
                });
        });
    },

    getByLimitOffset: function(endpoint, limit, offset){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}?limit=${limit}&offset=${offset}`)
                .then(function(response) {
                    let data = [];
                    if (response.status === 200) {
                        data = response.data.data;
                    }
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err.response.data);
                });
        });
    },

    getByLimitOffsetSearch: function(endpoint, limit, offset, search){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}?limit=${limit}&offset=${offset}&search=${search}`)
                .then(function(response) {
                    let data = [];
                    if (response.status === 200) {
                        data = response.data.data;
                    }
                    resolve(data);
                })
                .catch(function(err) {
                    reject(err.response.data);
                });
        });
    }

}


export default apiServiceV2;