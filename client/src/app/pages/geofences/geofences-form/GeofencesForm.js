import GeofencingComponent from '../../../components/form/GeofencingComponent';
import { Paper, Tab, Tabs } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from 'react';
import BlockUi from "react-block-ui";
import { TabContainer } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import apiServiceV2 from '../../../services/v2/apiServiceV2';
import GeofenceHistory from '../../../components/history/GeofenceHistory';
import GeofencesAssetsComponent from '../../../components/form/GeofencesAssetsComponent';
import { injectIntl } from "react-intl";

export function GeofencesForm({ match, location }) {
    const { id: geofenceId } = match.params;
    const baseURL = location.pathname
    const [geofenceInfo, setGeofenceInfo] = useState(undefined)
    const [isLoading, setLoading] = useState(true)
    // we use this hook so it doesn't show the splash screen
    const history = useHistory()

    function handleChange(event, newValue) {
        setValue(newValue);
        updateLink(newValue)
    }

    const updateLink = (value) => {
        switch (value) {
            case 0:
                history.push(`${baseURL}#edit`)
                return
            case 1:
                history.push(`${baseURL}#history`)
                return
            case 2:
                history.push(`${baseURL}#assets`)
                return
        }
    }

    const initialValue = useMemo(() => {
        switch (location.hash) {
            case '#edit': return 0
            case '#history': return 1
            case '#assets': return 2
        }
    }, [location.hash])

    const [value, setValue] = useState(initialValue);
    const componentToBeRendered = useMemo(() => {
        if (isLoading) {
            return <></>
        }
        switch (value) {
            case 0:
                return <GeofencingComponent id={geofenceId} />
            case 1:
                return <GeofenceHistory id={geofenceId} />
            case 2:
                return <GeofencesAssetsComponent id={geofenceId} />
        }
    }, [value, geofenceInfo, isLoading]);

    useEffect(() => {
        setLoading(true)
        apiServiceV2.get(`v2/geofences/` + geofenceId).then((results) => {
            const geofence = results.geofence
            setGeofenceInfo(geofence)
            setLoading(false)
        }).catch(err => {
            if (err.status === 404) {
                history.push('/error/error-v1')
            }
        })
    }, [geofenceId])

    return <div>
        <Paper square>
            <Tabs value={value} indicatorColor="primary" textColor="primary" onChange={handleChange}>
                <Tab label="Geofence Info" />
                <Tab label="History" disabled={typeof geofenceId === 'undefined'} />
                <Tab label="Assets" disabled={typeof geofenceId === 'undefined'} />
            </Tabs>
        </Paper>
        <BlockUi tag='div' blocking={isLoading}>
            <TabContainer>
                {componentToBeRendered}
            </TabContainer>
        </BlockUi>
    </div>
}

export default injectIntl(GeofencesForm);