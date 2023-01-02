import React, { useMemo } from 'react';
import TableGridHistory from '../../table-grid/TableGridHistory';

export function HistoryList(props) {
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
        <TableGridHistory
        title={props.title}
        columns={columns}
        filter={props.filter}
        container_id={props.container_id}
        endpoint={props.endpoint}
        dataField={props.dataField}
    />);
}
