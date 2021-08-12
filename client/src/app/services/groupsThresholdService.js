import axios from "axios";

const groupsThresholdService = {
    get: function(limit, offset) {
        return axios.get(`${process.env.REACT_APP_REST_API_URL}group/limit/${limit}/offset/${offset}`)
                    .then(async r => r.data.data);
    },
    getByThreshold: function(id, limit, offset){
        return axios.get(`${process.env.REACT_APP_REST_API_URL}group/bythreshold/${id}/limit/${limit}/offset/${offset}`)
            .then(function(response){
                if (response.status !== 200) {
                    return [];
                }
                return response.data.data;
            });
    }
}

export default groupsThresholdService;
