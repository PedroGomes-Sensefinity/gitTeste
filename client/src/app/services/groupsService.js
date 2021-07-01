import axios from "axios";

const groupsService = {
    get: function(limit, offset) {
        return axios.get(`${process.env.REACT_APP_REST_API_URL}group/limit/${limit}/offset/${offset}`)
                    .then(async r => r.data.data);
    },
}

export default groupsService;
