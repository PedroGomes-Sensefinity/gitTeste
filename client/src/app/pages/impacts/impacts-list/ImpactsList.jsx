import VisibilityIcon from '@mui/icons-material/Visibility';
import { Card, CardContent } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import React, { useEffect, useState } from "react";
import { Impacts } from "../Impacts";
import { HistoryList } from "../../../components/lists/history/HistoryList";
import apiServiceV2 from "../../../services/v2/apiServiceV2";

// General Styles
const style = {
    position: "absolute",
    bgcolor: "background.paper",
    border: "3px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: "auto",
    marginTop: "50px",
    marginLeft: "550px",
    marginRight: "550px"
};

const OVERLAY_STYLE = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    top: "0",
    left: "0",
    width: "auto",
    height: "auto",
    backgroundColor: "rgba(0,0,0, .8)",
    zIndex: "1000",
    overflowY: "auto",
    overflowX: "auto"
};

export function ImpactsList() {

    const [containersOptions, setContainersOptions] = useState([{ id: 0, label: "Containers Not Found" }]);
    const [selectedContainer, setselectedContainer] = useState(0);

    const [modalOpen, setModalOpen] = useState(false)
    const [modalData, setModalData] = useState({ x: 0, y: 0, z: 0, magnitude: 0 })


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
            title: "Device ID"
        },
        {
            field: 'x',
            title: 'X Value'
        }, {
            field: 'y',
            title: 'Y Value'
        }, {
            field: 'z',
            title: 'Z Value'
        }, {
            field: 'magnitude',
            title: 'Magnitude'
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

    const handleModalClose = () => {
        setModalOpen(false)
    }

    const onModalOpen = (rowData) => {
        setModalData({ x: rowData.x, y: rowData.y, z: rowData.y, magnitude: rowData.magnitude })
        setModalOpen(true)
    }


    const actions = [{
        icon: VisibilityIcon,
        tooltip: 'View Impact',
        onClick: (_event, rowData) => {
            onModalOpen(rowData)
        },
    }]

    return (
        <Card>
            <CardContent>
                <Modal
                    hideBackdrop
                    open={modalOpen}
                    onClose={handleModalClose}
                    style={OVERLAY_STYLE}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: "90%", height: "90%" }}>
                        <Button
                            size="small"
                            onClick={handleModalClose}
                            type="button"
                            style={{ margin: "15px" }}
                            className={`btn btn-danger mr-1 d-block mr-0 ml-auto`}
                        >
                            X
                        </Button>
                        {/*Uncomment line below for container*/}
                        {/*<Impacts  {...modalData}  /> */}
                    </Box>
                </Modal>
                <FormControl style={{ margin: "15px" }}>
                    <InputLabel id="select-container">Group</InputLabel>
                    <Select labelId="select-container" value={selectedContainer} onChange={onChangeContainer}>
                        {containersOptions.map(c => (
                            <MenuItem value={c.id}>{c.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <HistoryList
                    actions={actions}
                    columns={columns}
                    key={selectedContainer}
                    title={"Impacts History"}
                    container_id={selectedContainer}
                    endpoint={"v2/impacts"}
                    dataField={"impacts"}
                />
            </CardContent>
        </Card>
    );
}
