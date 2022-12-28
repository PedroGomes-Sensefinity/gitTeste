import axios from "axios";

const elasticService = {
    get: function(path){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}elastic/` + path)
                .then(function(response) {
                    resolve(response)
                })
                .catch(function(err) {
                    reject(err.response.data);
                });
        });
    }
}

export default elasticService;