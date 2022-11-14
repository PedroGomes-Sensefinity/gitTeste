import React, { useRef, useState } from 'react';

import MaterialTable from '@material-table/core';
import apiService from '../../services/apiService';

function TableGrid(props) {
    const tableRef = useRef(null)

    const data = props.data
    const date = props.date
    const actions = props.actions
    const dataField = props.dataField
    const title = props.title
    const columns = props.columns
    const editable = props.editable
    const isRemote = props.data === undefined
    const endpoint = props.endpoint
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const isLoading = props.isLoading

    const options = {
        pageSize: rowsPerPage,
        pageSizeOptions: [10, 50, 100],
        exportButton: true,
        onOrderChange: () => { },
        onSearchChange: () => { },
        sorting: false
    };

    if (!isRemote) {
        return (
            <MaterialTable
                tableRef={tableRef}
                actions={actions}
                title={title}
                columns={columns}
                options={options}
                data={data}
                editable={editable || {}}
            />
        );
    }

    if (isRemote) {
        return (
            <MaterialTable
                tableRef={tableRef}
                actions={actions}
                title={title}
                columns={columns}
                options={options}
                data={query =>
                    new Promise((resolve, reject) => {
                        const pageSize = query.pageSize;
                        const page = query.page;
                        let method = 'get';
                        let params = [endpoint, pageSize, page * pageSize];

                        if (query.search !== "") {
                            method = 'getByText'
                            params = [endpoint, query.search, pageSize, page * pageSize]
                        }
                        if (date !== undefined) {
                            if (date.start !== "0" && query.search === "") {
                                method = 'getByTimestamp'
                                params = [endpoint, date.start, date.end, pageSize, page * pageSize]
                            } else {
                                method = 'getByTimestampSearch'
                                params = [endpoint, query.search, date.start, date.end, pageSize, page * pageSize]
                            }
                        }

                        apiService[method](...params)
                            .then((result) => {
                                const newData = result[dataField] || []
                                resolve({
                                    data: newData,
                                    page: page,
                                    totalCount: result.total || 0,
                                });
                            });
                    })
                }
                isLoading={isLoading}
                editable={props.editable || {}}
            />
        );
    }


}

export default TableGrid;
