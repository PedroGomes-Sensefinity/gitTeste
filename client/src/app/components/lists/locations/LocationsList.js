import { makeStyles } from "@material-ui/core/styles";
import React from 'react';
import TableGridContainers from '../../table-grid/TableGridContainers';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function LocationsList(props) {
    const columns = [
        {
            field: 'asset_label',
            title: 'Label',
        },
        {
            field: 'timestamp',
            title: 'Location Timestamp',
        },
        {
            field: 'asset_type',
            title: 'Asset Type',
        },
        {
            field: 'location',
            title: 'Location',
        },
        {
            field: 'sublocation',
            title: 'SubLocation',
        },
        {
            field: 'port_code',
            title: 'Port Code',
        },
        {
            field: 'reverse_geocoding',
            title: 'Reverse Geocoding',
        },
        {
            field: 'longstanding',
            title: 'Longstanding',
        },
        {
            field: 'geofence_timestamp',
            title: 'Geofence Timestamp',
        },
        {
            field: 'geofence_label',
            title: 'Geofence Label',
        },
        {
            field: 'geofence_status',
            title: 'Geofence Status',
        }
    ];

    return(
        <TableGridContainers
        title={props.location}
        columns={columns}
        location={props.location}
        container_id={props.container_id}
        endpoint={'v2/assets/tracking'}
        dataField='assets_tracking'
    />)
}
