import axios from "axios";

const floorMapService = {
    save: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}floormaps/`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err.response.data);
                });
        });
    },
    update: function (formData) {
        return new Promise(function (resolve, reject) {
            axios.put(`${process.env.REACT_APP_REST_API_URL}floormaps/${formData.id}`, formData)
                .then((response) => response.data)
                .then((responseData) => {
                    let result = [];
                    if (responseData.code === 200) {
                        result = responseData.data;
                    }
                    resolve(result);
                })
                .catch(function (err) {
                    reject(err.response.data);
                });
        });
    },
    upload: async function (formData) {
        return new Promise(function (resolve, reject) {
            axios.post(`${process.env.REACT_APP_REST_API_URL}floormaps/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) => resolve(response.data.data))
                .catch(function (err) {
                    console.log(err);
                    reject(Error("Something went wrong on upload image... "));
                });
        });
    },
}

export default floorMapService;
