import axios from "axios";

const apiService = {
    
    get: function(endpoint, limit, offset){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/limit/${limit}/offset/${offset}`)
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
    getByEndpoint: function(endpoint){
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
    getByTimestamp: function(endpoint, dateStart, dateEnd, limit, offset){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/datestart/${dateStart}/dateend/${dateEnd}/limit/${limit}/offset/${offset}`)
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
    getByTimestampSearch: function(endpoint, text,dateStart, dateEnd, limit, offset){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/search/${text}/datestart/${dateStart}/dateend/${dateEnd}/limit/${limit}/offset/${offset}`)
                .then(function(response) {
                    var data = [];
                    
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
                    reject(err.response.data);
                });
        });
    },
    getByTextOrdered: function(endpoint, text, limit, offset, field, sort, order){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/search/${text}/limit/${limit}/offset/${offset}/sort/${sort}/order/${order}`)
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
                    reject(err.response.data);
                });
        });
    },
    getById: function(endpoint, id) {
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}${endpoint}/${id}`)
                .then((response) => {
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
                    reject(err.response.data);
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
                    reject(err.response.data);
                });
        });
    },
    upload: async function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) => resolve(response.data.data))
                .catch(function (err) {
                    reject(Error("Something went wrong on upload image... "));
                });
        });
    },
}

export default apiService;
