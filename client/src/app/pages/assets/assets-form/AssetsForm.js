import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { TabContainer } from "react-bootstrap";

import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import DeviceSelector from "./DeviceSelector";


export function AssetsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    function renderSwitch(value) {
        switch (value ) {
            case 0:
                return <DeviceSelector assetId={id}/>
            case 1: 
                return <AssetsFormComponent id={id} />
            case 2: 
                return <AssetDevicesComponent id={id} />
        }
    }

    return <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Dashboard" />
                    <Tab label="Asset Info"/>
                    <Tab label="Devices" disabled={typeof id === 'undefined'} />
                </Tabs>
            </Paper>
            
            <TabContainer>
                {renderSwitch(value)}
            </TabContainer>
        </div>
}
        