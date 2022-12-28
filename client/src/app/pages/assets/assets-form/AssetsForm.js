import React, { useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import { LazyRender } from "../../../utils/LazyRender";
import { TabContainer } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AssetDevicesComponent from "../../../components/form/AssetDevicesComponent";
import AssetFormExtraFields from "../../../components/form/AssetFormExtraFields";
import AssetsFormComponent from "../../../components/form/AssetsFormComponent";
import apiService from '../../../services/apiService';
import apiServiceV2 from '../../../services/v2/apiServiceV2';
import AssetsFormHeader from './AssetsFormHeader';
import templates from "../../../utils/links";
import DeviceSelector from "./DeviceSelector";


export function AssetsForm({ match }) {
    const { id: assetId } = match.params;
    const [assetInfo, setAssetInfo] = useState(undefined)
    const [isLoading, setLoading] = useState(true)
    const [hasMetadataSchema, setMetadataSchema] = useState(false)
    const [refetch, setRefetch] = useState(false)

    // we use this hook so it doesn't show the splash screen
    const history = useHistory()

    // Used to trigger a refetch of the asset so it triggers a rerender of the dependent components
    const onAssetChange = () => {
        setRefetch(curr => !curr)
    }

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

    return <>
        <AssetsFormHeader assetId={assetId} hasMetadataSchema={hasMetadataSchema} />
        <TabContainer>
            <Switch>
                <Route exact path={templates.assetsDashboard.templateString}>
                    {
                        <LazyRender isLoading={isLoading}>
                            <DeviceSelector asset={assetInfo} />
                        </LazyRender>
                    }
                </Route>
                <Route path={templates.assetsEdit.templateString}>
                    {
                        <LazyRender isLoading={isLoading}>
                            <AssetsFormComponent id={assetId} asset={assetInfo} />
                        </LazyRender>
                    }
                </Route>
                <Route path={templates.assetsDevices.templateString}>
                    {<LazyRender isLoading={isLoading}>
                        <AssetDevicesComponent id={assetId} asset={assetInfo} onAssetChange={onAssetChange} />
                    </LazyRender>
                    }
                </Route>
                <Route path={templates.assetsExtraFields.templateString}>
                    {
                        <LazyRender isLoading={isLoading}>
                            <AssetFormExtraFields id={assetId} />
                        </LazyRender>
                    }
                </Route>
            </Switch>
        </TabContainer>
    </>
}
