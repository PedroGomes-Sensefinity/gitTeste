import React, { useMemo } from 'react';
import TableGridHistory from '../../table-grid/TableGridHistory';

export function HistoryList(props) {
    return(
        <TableGridHistory
        actions={props.actions || []}
        title={props.title}
        columns={props.columns}
        filter={props.filter}
        container_id={props.container_id}
        endpoint={props.endpoint}
        dataField={props.dataField}
    />);
}
