import React, {useEffect,useState} from 'react';

import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";

import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetFormExtraFields from "../../../components/form/AssetFormExtraFields";

import apiService from '../../../services/apiService';

export function AssetsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = React.useState(0);
    const [hasMetadataSchema, setMetadataSchema] = React.useState(false)

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    useEffect(() => {
        let endpoint = "asset/" + id + "/asset-type"
        apiService.getByEndpoint(endpoint).then((response) => {
          if(response.asset_type.metadataschema != undefined && response.asset_type.metadataschema != "{}"){
                setMetadataSchema(true)
          }
      });
      }, []); 

    return (<div>
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                <Tab label="Asset"/>
                <Tab label="Devices" disabled={typeof id === 'undefined'} />
                <Tab label="Extra Fields" disabled={typeof id === 'undefined' || hasMetadataSchema === false} />
            </Tabs>
        </Paper>
        <TabContainer>
            {value === 0 && <AssetsFormComponent id={id} />}
        </TabContainer>
        <TabContainer>
            {value === 1 && <AssetDevicesComponent id={id} />}
        </TabContainer>
        <TabContainer>
            {value === 2 && <AssetFormExtraFields id={id}/>}
        </TabContainer>
    </div>

    );
}