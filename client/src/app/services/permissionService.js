import axios from "axios";

const permissionService = {
    hasPermission: function (slug) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}permission/check/${slug}`)
                .then((response) => response.data)
                .then((responseData) => {
                    var result = [];

                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err.response.data);
                });
        });
    }
}

export default permissionService;