import React, { useRef, useState } from 'react';

import MaterialTable from '@material-table/core';
import apiServiceV2 from '../../services/v2/apiServiceV2';

function TableGridV2(props) {
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
                        let method = 'getByLimitOffset';
                        let params = [endpoint, pageSize, page * pageSize];

                        if (query.search !== "") {
                            method = 'getByLimitOffsetSearch'
                            params = [endpoint, pageSize, page * pageSize, query.search]
                        }

                        apiServiceV2[method](...params)
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

export default TableGridV2;
