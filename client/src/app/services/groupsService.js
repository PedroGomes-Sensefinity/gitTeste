import axios from "axios";

const groupsService = {
    get: function(limit, offset) {
        return axios
            .get(`${process.env.REACT_APP_REST_API_URL}group/limit/${limit}/offset/${offset}`)
            .then((r) => r.data)
            .then((r) => {
                if (r.code === 200) {
                    return r.data;
                }
                return [];
            })
    },
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}group/`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on create group... "));
                });
        });
    },
    update: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}group/${formData.id}`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on update group... "));
                });
        });
    }
}

export default groupsService;
