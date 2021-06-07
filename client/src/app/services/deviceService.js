import axios from "axios";

const deviceService = {
    get: function(limit, offset){
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
    getByText: function(text, limit, offset){
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
    }/*,
    getByTextOrderby: function(text, limit, offset, sort, order){
        return new Promise(function(resolve, reject) {
            fetch(restDevices.header.apiUrl + 'device/search/' + text + '/limit/' + limit + '/offset/' + offset + '/sort/' + sort + '/order/' + order, {
                method: 'GET',
                headers: restDevices.header.apiHeaders,
                mode: 'cors'
            })
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
                    result = responseData.data.devices;
                } else {
                    localStorage.removeItem('@sense/api/token');
                }
                resolve(result);
            })
            .catch(function(err) {
                console.log(err);
                reject(Error("Something went wrong on get devices... "));
            });
        });
    },
    getOrderby: function(limit, offset, sort, order){
        return new Promise(function(resolve, reject) {
            fetch(restDevices.header.apiUrl + 'device/limit/' + limit + '/offset/' + offset + '/sort/' + sort + '/order/' + order, {
                method: 'GET',
                headers: restDevices.header.apiHeaders,
                mode: 'cors'
            })
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
                    result = responseData.data.devices;
                } else {
                    localStorage.removeItem('@sense/api/token');
                }
                resolve(result);
            })
            .catch(function(err) {
                console.log(err);
                reject(Error("Something went wrong on get devices... "));
            });
        });
    }*/
}

export default deviceService;
