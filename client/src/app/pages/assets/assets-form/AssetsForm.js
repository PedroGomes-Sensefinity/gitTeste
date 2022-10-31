import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from 'react';
import BlockUi from "react-block-ui";
import { TabContainer } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetFormExtraFields from "../../../components/form/AssetFormExtraFields";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import apiService from '../../../services/apiService';
import DeviceSelector from "./DeviceSelector";


export function AssetsForm({match, location}) {
    const {id: assetId} = match.params;
    const baseURL = location.pathname
    const [assetInfo, setAssetInfo] = useState(undefined)
    const [isLoading, setLoading] = useState(true)
    const [hasMetadataSchema, setMetadataSchema] = useState(false)
    // we use this hook so it doesn't show the splash screen
    const history = useHistory()
    
    function handleChange(event, newValue) {
        setValue(newValue);
        updateLink(newValue)
    }
    
    const updateLink = (value) => {
        switch (value) {
            case 0:
                history.push(`${baseURL}`)
                return 
            case 1:
                history.push(`${baseURL}#edit`)
                return 
            case 2:
                history.push(`${baseURL}#devices`)
                return
            case 3: 
                history.push(`${baseURL}#extra-fields`)
                return
        }
    }
            
    const initialValue = useMemo(() => {
        switch(location.hash) {
            case '': return 0
            case '#edit': return 1
            case '#devices': return 2
            case '#extra-fields': return 3
        }
    }, [location.hash])
    
    const [value, setValue] = useState(initialValue);
    const componentToBeRendered = useMemo(() => {
        if(isLoading) {
            return <></>
        }
        switch (value) {
            case 0:
                return <DeviceSelector asset={assetInfo}/>
            case 1: 
                return <AssetsFormComponent id={assetId} asset={assetInfo}/>
            case 2: 
                return <AssetDevicesComponent id={assetId} />
            case 3:
                return <AssetFormExtraFields id={assetId}/>
        }
    } , [value, assetInfo, isLoading]);

    useEffect(() => {
        setLoading(true)
        apiService.getById(`asset/`, assetId ).then((results) => {
            const asset = results.assets[0]
            setAssetInfo(asset)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            if(err.status === 404) {
                history.push('/not-found')
            }
        })
    },[assetId])

    useEffect(() => {
        apiService.getByEndpoint("asset/" + assetId + "/asset-type").then((response) => {
            if(response.asset_type === undefined) {
                setMetadataSchema(false)
            } else {
                if(response.asset_type.metadataschema !== undefined && response.asset_type.metadataschema !== "{}"){
                    setMetadataSchema(true)
                }
            }
        });
      }, []);

    return <div>
            <Paper square>
                <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                    <Tab label="Dashboard" />
                    <Tab label="Asset Info"/>
                    <Tab label="Devices" disabled={typeof assetId === 'undefined'} />
                    <Tab label="Extra Fields" disabled={typeof assetId === 'undefined' || hasMetadataSchema === false} />
                </Tabs>
            </Paper>
            <BlockUi tag='div' blocking={isLoading}> 
                <TabContainer>
                    {componentToBeRendered}
                </TabContainer>
            </BlockUi>
        </div>
}
        