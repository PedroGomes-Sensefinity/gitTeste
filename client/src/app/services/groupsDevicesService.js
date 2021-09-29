import axios from "axios";

const groupsDevicesService = {
    getByThreshold: function(id, limit, offset){
        return axios.get(`${process.env.REACT_APP_REST_API_URL}device/bygroup/${id}/limit/${limit}/offset/${offset}`)
            .then(function(response){
                if (response.status !== 200) {
                    return [];
                }
                return response.data.data;
            });
    }
}

export default groupsDevicesService;
