import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import TableGridContainers from '../../table-grid/TableGridContainers';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function LongStandingList(props) {
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
        title={props.port_code}
        columns={columns}
        port_code={props.port_code}
        interval={props.interval}
        container_id={props.container_id}
        endpoint={'v2/assets/tracking'}
        dataField='assets_tracking'
    />)
}
