import React, { useRef, useState } from "react";

import MaterialTable from "@material-table/core";
import apiServiceV2 from "../../services/v2/apiServiceV2";

function TableGridHistory(props) {
    const tableRef = useRef(null);

    const data = props.data;
    const date = props.date;
    const actions = props.actions;
    const dataField = props.dataField;
    const title = props.title;
    const columns = props.columns;
    const editable = props.editable;
    const isRemote = props.data === undefined;
    const endpoint = props.endpoint;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const isLoading = props.isLoading;

    const options = {
        pageSize: rowsPerPage,
        pageSizeOptions: [5, 25, 50],
        exportButton: true,
        onOrderChange: () => {},
        onSearchChange: () => {},
        sorting: false,
        search: false
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
                        if(props.container_id === 0){
                            resolve({
                                data: [],
                                page: page,
                                totalCount: 0
                            });
                        }else{
                            apiServiceV2
                            .get(
                                props.endpoint +
                                    "?limit=" +
                                    pageSize +
                                    "&offset=" +
                                    page * pageSize +
                                    "&container_id=" +
                                    props.container_id
                            )
                            .then(result => {
                                const newData = result[dataField] || [];
                                resolve({
                                    data: newData,
                                    page: page,
                                    totalCount: result.total || 0
                                });
                            }).catch(result =>{
                                resolve({
                                    data: [],
                                    page: page,
                                    totalCount: 0
                                });
                            });
                        }
                    })
                }
                isLoading={isLoading}
                editable={props.editable || {}}
            />
        );
    }
}

export default TableGridHistory;
