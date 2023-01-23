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
import { injectIntl } from "react-intl";

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

export function ImpactsList(props) {
    const selectedContainer = props.container

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
            title: "Device Label"
        },
        {
            field: 'x',
            title: 'X Value (mg)'
        }, {
            field: 'y',
            title: 'Y Value (mg)'
        }, {
            field: 'z',
            title: 'Z Value (mg)'
        }, 
        {
            field: 'magnitude',
            title: 'Magnitude (mg)'
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


    const handleModalClose = () => {
        setModalOpen(false)
    }

    const onModalOpen = (rowData) => {
        setModalData({ x: rowData.x, y: rowData.y, z: rowData.z, magnitude: rowData.magnitude })
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
                        <Impacts {...modalData} />
                    </Box>
                </Modal>
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

export default injectIntl(ImpactsList);