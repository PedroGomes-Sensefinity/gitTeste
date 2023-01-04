import React, { useEffect, useState } from 'react';
import { TabContainer } from "react-bootstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Layout } from '../../../../_metronic/layout';
import apiService from '../../../services/apiService';
import apiServiceV2 from '../../../services/v2/apiServiceV2';
import templates from '../../../utils/links';
import AssetPageHeader from './AssetsPageHeader';


export function AssetDetailPage() {
    const { id: assetId } = useParams();
    const [assetInfo, setAssetInfo] = useState(undefined)
    const [isLoading, setLoading] = useState(true)
    const [hasMetadataSchema, setMetadataSchema] = useState(false)
    const [refetch, setRefetch] = useState(false)
    const navigate = useNavigate()

    // Used to trigger a refetch of the asset so it triggers a rerender of the dependent components
    const onAssetChange = () => {
        setRefetch(curr => !curr)
    }

    useEffect(() => {
        setLoading(true)
        apiServiceV2.get(`v2/assets/` + assetId).then((results) => {
            const asset = results.asset
            console.log(asset)
            setAssetInfo(asset)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            if (err.status === 404) {
                navigate(templates.notFound)
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

    const childProps = { id: assetId, assetInfo: assetInfo, onAssetChange: onAssetChange, isLoading: isLoading }

    return <Layout>
        <AssetPageHeader assetId={assetId} hasMetadataSchema={hasMetadataSchema} />
        <TabContainer>
            <Outlet context={childProps} />
        </TabContainer>
    </Layout>
}
