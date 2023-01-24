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
            field: "timestamp",
            title: "Timestamp"
        },
        {
            field: "asset.label",
            title: "Asset"
        },
        {
            field: "device.label",
            title: "Device Label"
        },
        {
            field: 'x',
            title: 'X Value (g)'
        }, {
            field: 'y',
            title: 'Y Value (g)'
        }, {
            field: 'z',
            title: 'Z Value (g)'
        }, 
        {
            field: 'magnitude',
            title: 'Magnitude (g)'
        },
        {
            field: 'faces',
            title: 'Faces'
        },
        {
            field: 'reverse_geocoding',
            title: 'Location Impact'
        },
        {
            field: 'latitude',
            title: 'Latitude'
        },
        {
            field: 'longitude',
            title: 'Longitude'
        },
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
                title={"Asset Impacts"}
                container_id={selectedContainer}
                endpoint={"v2/assets/" + props.asset.label + "/impacts"}
                dataField={"impacts"}
            ></HistoryList>
        </div>
    );
}
