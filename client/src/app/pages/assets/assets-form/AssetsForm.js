import React, {useEffect,useState} from 'react';

import {Paper, Tab, Tabs} from "@material-ui/core";
import {TabContainer} from "react-bootstrap";

import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import DeviceSelector from "./DeviceSelector";

import AssetFormExtraFields from "../../../components/form/AssetFormExtraFields";

import apiService from '../../../services/apiService';

export function AssetsForm({match}) {
    const {id} = match.params;
    const [value, setValue] = useState(0);
    const [hasMetadataSchema, setMetadataSchema] = useState(false)

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
            case 3:
                return <AssetFormExtraFields id={id}/>
        }
    }
    useEffect(() => {
        let endpoint = "asset/" + id + "/asset-type"
        apiService.getByEndpoint(endpoint).then((response) => {
          if(response.asset_type.metadataschema != undefined && response.asset_type.metadataschema != "{}"){
                setMetadataSchema(true)
          }
      });
      }, []); 

    return <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Dashboard" />
                    <Tab label="Asset Info"/>
                    <Tab label="Devices" disabled={typeof id === 'undefined'} />
                    <Tab label="Extra Fields" disabled={typeof id === 'undefined' || hasMetadataSchema === false} />
                </Tabs>
            </Paper>
            
            <TabContainer>
                {renderSwitch(value)}
            </TabContainer>
        </div>
}
        