import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import apiServiceV2 from "../../services/v2/apiServiceV2";
import { HistoryList } from "../lists/history/HistoryList";

export default function AssetHistory(props) {
    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedContainer, setselectedContainer] = useState(0);

    const columns = [
        {
            field: "asset_label",
            title: "Label"
        },
        {
            field: "timestamp",
            title: "Location Timestamp"
        },
        {
            field: "asset_type",
            title: "Asset Type"
        },
        {
            field: "location",
            title: "Location"
        },
        {
            field: "sublocation",
            title: "SubLocation"
        },
        {
            field: "port_code",
            title: "Port Code"
        },
        {
            field: "reverse_geocoding",
            title: "Location"
        },
        {
            field: "longstanding",
            title: "Longstanding (days)"
        },
        {
            field: "geofence_timestamp",
            title: "Geofence Timestamp"
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
                title={"Asset History"}
                container_id={selectedContainer}
                endpoint={"v2/assets/" + props.asset.label + "/history"}
                dataField={"assets_tracking"}
            ></HistoryList>
        </div>
    );
}
