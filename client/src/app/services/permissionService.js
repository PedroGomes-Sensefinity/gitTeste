import axios from "axios";

const permissionService = {
    hasPermission: function (slug) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}permission/check/${slug}`)
                .then(response => {
                    //only possible when request is successfull
                    resolve(response.data)
                })
                .catch((err) => {
                    //triggered on 4XX status code
                    reject(err.response.data);
                });
        });
    },
    getUserPermissions: function () {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_REST_API_URL}permissions`)
                .then(response => {
                    //only possible when request is successfull)
                    resolve(response.data.data.permissions)
                }).catch((err) => {
                    //triggered on 4XX status code
                    reject(err.response.data);
                })
        })
    }
}

export default permissionService;