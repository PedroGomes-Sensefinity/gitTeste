import axios from "axios";

const geoCoding = {
    get: function(lat, lon){
        return new Promise(function(resolve, reject) {
            axios
                .get(`${process.env.REACT_APP_REST_API_URL}georeverse/lat=${lat}&lon=${lon}`)
                .then(function(response) {
                    resolve(response)
                })
                .catch(function(err) {
                    reject(err.response.data);
                });
        });
    }
}

export default geoCoding;