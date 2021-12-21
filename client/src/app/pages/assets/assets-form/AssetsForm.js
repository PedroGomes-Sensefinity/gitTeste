import React from "react";
import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";

import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";

export function AssetsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (<div>
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                <Tab label="Asset"/>
                <Tab label="Devices" disabled={typeof id === 'undefined'} />
            </Tabs>
        </Paper>
        <TabContainer>
            {value === 0 && <AssetsFormComponent id={id} />}
        </TabContainer>
        <TabContainer>
            {value === 1 && <AssetDevicesComponent id={id} />}
        </TabContainer>
    </div>

    );
}