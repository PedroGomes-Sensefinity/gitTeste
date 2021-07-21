import axios from "axios";

const passwordChangeService = {
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}passwordchange/${formData.id}`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    var result = [];

                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on save device thresholds... "));
                });
        });
    }
}

export default passwordChangeService;
