import React, { useMemo } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
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
            title: 'Current Location',
        },
        {
            field: 'longstanding',
            title: 'Longstanding (days)',
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
