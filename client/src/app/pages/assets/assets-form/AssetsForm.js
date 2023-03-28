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
import { useSelector } from 'react-redux';
import { KibanaDashboard } from "../../dashboards/KibanaDashboard";

export function AssetsForm({ match, location }) {
    const { id: assetId } = match.params;
    const baseURL = location.pathname
    const [assetInfo, setAssetInfo] = useState(undefined)
    const [isLoading, setLoading] = useState(true)
    const [kibanaTabs, setKibanaTabs] = useState([])
    const [dashboards, setDashboards] = useState([])
    const [hasMetadataSchema, setMetadataSchema] = useState(false)
    const [refetch, setRefetch] = useState(false)
    // we use this hook so it doesn't show the splash screen
    const history = useHistory()
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

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
            case "dashboard":
                history.push(`${baseURL}`)
                return
            case "info":
                history.push(`${baseURL}#edit`)
                return
            case "devices":
                history.push(`${baseURL}#devices`)
                return
            case "history":
                history.push(`${baseURL}#history`)
                return
            case "impacts":
                history.push(`${baseURL}#impacts`)
                return
            case "extrafields":
                history.push(`${baseURL}#extra-fields`)
                return
            default:
                history.push(`${baseURL}`)
                return
        }
    }

    const initialValue = useMemo(() => {
        switch (location.hash) {
            case '': return "dashboard"
            case '#edit': return "info"
            case '#devices': return "devices"
            case '#history': return "history"
            case '#impacts': return "impacts"
            case '#extra-fields': return "extrafields"
        }
    }, [location.hash])

    const [value, setValue] = useState(initialValue);
    const componentToBeRendered = useMemo(() => {
        if (isLoading) {
            return <></>
        }
        console.log(value)
        switch (value) {
            case "dashboard":
                return <DeviceSelector asset={assetInfo} />
            case "info":
                return <AssetsFormComponent id={assetId} asset={assetInfo} />
            case "devices":
                return <AssetDevicesComponent id={assetId} asset={assetInfo} onAssetChange={onAssetChange} />
            case "history":
                return <AssetHistory id={assetId} asset={assetInfo} />
            case "impacts":
                return <AssetImpacts id={assetId} asset={assetInfo} />
            case "extrafields":
                return <AssetFormExtraFields id={assetId} />
            default:
                return <KibanaDashboard url={dashboards[value].dashboard_url} />;
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
        apiServiceV2.get(`v2/assets/` + assetId + `/dashboards`).then((results) => {
            const dashboards = results.dashboards
            console.log(dashboards)
            const dashboardTabs = []
            for (const i in dashboards) {
                console.log(i)
                dashboardTabs.push(<Tab value={i} label={dashboards[i].dashboard_name} />)
            }
            setDashboards(dashboards)
            setKibanaTabs(dashboardTabs)
        }).catch(err => {
            console.log(err)
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
                <Tab value="dashboard" label="Dashboard" />
                {kibanaTabs}
                <Tab value="info" label="Asset Info" />
                <Tab value="devices" label="Devices" disabled={typeof assetId === 'undefined'} />
                {permissions.canCreateThresholdGeofences && <Tab value="history" label="History" disabled={typeof assetId === 'undefined'} />}
                {permissions.canViewImpacts && <Tab value="impacts" label="Impacts" disabled={typeof assetId === 'undefined'} />}
                <Tab value="extrafields" label="Extra Fields" disabled={typeof assetId === 'undefined' || hasMetadataSchema === false} />
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
