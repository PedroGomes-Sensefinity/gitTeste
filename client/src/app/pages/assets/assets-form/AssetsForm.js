import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from 'react';
import BlockUi from "react-block-ui";
import { TabContainer } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetFormExtraFields from "../../../components/form/AssetFormExtraFields";
import AssetHistory from "../../../components/history/AssetHistory";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import apiService from '../../../services/apiService';
import apiServiceV2 from '../../../services/v2/apiServiceV2';
import DeviceSelector from "./DeviceSelector";
import { injectIntl } from "react-intl";
import AssetImpacts from "../../../components/history/AssetImpacts";


export function AssetsForm({ match, location }) {
    const { id: assetId } = match.params;
    const baseURL = location.pathname
    const [assetInfo, setAssetInfo] = useState(undefined)
    const [isLoading, setLoading] = useState(true)
    const [hasMetadataSchema, setMetadataSchema] = useState(false)
    const [refetch, setRefetch] = useState(false)
    // we use this hook so it doesn't show the splash screen
    const history = useHistory()

    function handleChange(event, newValue) {
        setValue(newValue);
        updateLink(newValue)
    }

    // Used to trigger a refetch of the asset so it triggers a rerender of the dependent components
    const onAssetChange = () => {
        setRefetch(curr => !curr)
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
                history.push(`${baseURL}#history`)
                return
            case 4:
                history.push(`${baseURL}#impacts`)
                return
            case 5:
                history.push(`${baseURL}#extra-fields`)
                return
        }
    }

    const initialValue = useMemo(() => {
        switch (location.hash) {
            case '': return 0
            case '#edit': return 1
            case '#devices': return 2
            case '#history': return 3
            case '#impacts': return 4
            case '#extra-fields': return 5
        }
    }, [location.hash])

    const [value, setValue] = useState(initialValue);
    const componentToBeRendered = useMemo(() => {
        if (isLoading) {
            return <></>
        }
        switch (value) {
            case 0:
                return <DeviceSelector asset={assetInfo} />
            case 1:
                return <AssetsFormComponent id={assetId} asset={assetInfo} />
            case 2:
                return <AssetDevicesComponent id={assetId} asset={assetInfo} onAssetChange={onAssetChange} />
            case 3:
                return <AssetHistory id={assetId} asset={assetInfo} />
            case 4:
                return <AssetImpacts id={assetId} asset={assetInfo} />
            case 5:
                return <AssetFormExtraFields id={assetId} />
        }
    }, [value, assetInfo, isLoading]);

    useEffect(() => {
        setLoading(true)
        apiServiceV2.get(`v2/assets/` + assetId).then((results) => {
            const asset = results.asset
            setAssetInfo(asset)
            setLoading(false)
        }).catch(err => {
            if (err.status === 404) {
                history.push('/error/error-v1')
            }
        })
    }, [assetId, refetch])

    useEffect(() => {
        apiService.getByEndpoint("v2/assets/" + assetId).then((response) => {
            if (response.asset.asset_type.metadataschema != undefined && response.asset.asset_type.metadataschema != "{}") {
                setMetadataSchema(true)
            } else {
                setMetadataSchema(false)
            }
        });
    }, []);

    return <div>
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                <Tab label="Dashboard" />
                <Tab label="Asset Info" />
                <Tab label="Devices" disabled={typeof assetId === 'undefined'} />
                <Tab label="History" disabled={typeof assetId === 'undefined'} />
                <Tab label="Impacts" disabled={typeof assetId === 'undefined'} />
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


export default injectIntl(AssetsForm);
