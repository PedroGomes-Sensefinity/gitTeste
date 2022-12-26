import React, { useMemo } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import TableGridLocation from '../../table-grid/TableGridLocation';

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
            field: 'geofence_label',
            title: 'Geofence Label',
        },
        {
            field: 'geofence_status',
            title: 'Geofence Status',
        }
    ];

    return(
        <TableGridLocation
        title={props.location}
        columns={columns}
        location={props.location}
        container_id={props.container_id}
        endpoint={'v2/assets/tracking'}
        dataField='assets_tracking'
    />)
}
