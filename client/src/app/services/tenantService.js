import axios from "axios";

const tenantService = {
    getInfo: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.get(`${process.env.REACT_APP_REST_API_URL}tenant/info/`, formData)
                .then((response) => response.data)
                .then((result) => {
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on get tenant info... "));
                });
        });
    },
}

export default tenantService;
