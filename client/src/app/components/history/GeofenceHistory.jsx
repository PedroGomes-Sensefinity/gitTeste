import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import apiServiceV2 from "../../services/v2/apiServiceV2";
import { HistoryList } from "../lists/history/HistoryList";
import { useOutletContext } from "react-router-dom";

export default function GeofenceHistory() {

    const { id: geofenceId } = useOutletContext()
    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedContainer, setselectedContainer] = useState(0);

    const columns = [
        {
            field: "timestamp",
            title: "Timestamp"
        },
        {
            field: "asset_label",
            title: "Label"
        },
        {
            field: "asset_type",
            title: "Asset Type"
        },
        {
            field: "reverse_geocoding",
            title: "Reverse Geocoding"
        },
        {
            field: "geofence_label",
            title: "Geofence Label"
        },
        {
            field: "geofence_status",
            title: "Geofence Status"
        }
    ];

    useEffect(() => {
        apiServiceV2.get("v2/tenants/containers").then(response => {
            const respContainers = response.containers || [];

            const containersOptionsR = respContainers.map(container => {
                return { id: container.id, label: container.label };
            });

            setContainersOptions(containersOptionsR);
            setselectedContainer(containersOptionsR[0].id);
        });
    }, []);

    function onChangeContainer(e) {
        setselectedContainer(e.target.value);
        console.log(e.target.value);
    }

    return (
        <div className={`card card-custom`}>
            <FormControl style={{ margin: "15px" }}>
                <InputLabel id="select-container">Group</InputLabel>
                <Select labelId="select-container" value={selectedContainer} onChange={onChangeContainer}>
                    {containersOptions.map(c => (
                        <MenuItem value={c.id}>{c.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <HistoryList
                columns={columns}
                key={selectedContainer}
                title={"Geofence History"}
                container_id={selectedContainer}
                endpoint={"v2/geofences/" + geofenceId + "/history"}
                dataField={"assets_tracking"}
            ></HistoryList>
        </div>
    );
}
