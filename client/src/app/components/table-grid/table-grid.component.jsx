import React from 'react';

import MaterialTable from 'material-table';
import apiService from '../../services/apiService';

class TableGrid extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            remote: (typeof props.data === "undefined"),
            endpoint: props.endpoint,
            total: 0,
            page: 0,
            rowsPerPage: 10,
            isLoading: props.isLoading || false,
        };
    }

    componentDidMount() {
    }
    componentDidUpdate(prevProps) {
        if(typeof this.props.data !== "undefined" && prevProps.data !== this.props.data) {
            this.setState({data: this.props.data});
            //this.tableRef.current.onQueryChange();
        }
    }

    getSortedData = (changedColumn, order) => {};

    changePage = (page) => {
        //this.props.onChangePage(page);
    };

    changeRowsPage = (rowsPerPage) => {
        //this.props.onChangeRowsPage(rowsPerPage);
    };

    render() {
        const options = {
            pageSize: this.state.rowsPerPage,
            pageSizeOptions: [10, 50, 100],
            exportButton: true,
            onOrderChange: (rderedColumnId, orderDirection) => {},
            onSearchChange: (search) => {},
            sorting: false
        };

        if(!this.state.remote) {
            return (
                <MaterialTable
                    tableRef={this.tableRef}
                    actions={this.props.actions}
                    title={this.props.title}
                    columns={this.props.columns}
                    options={options}
                    data={this.state.data}
                    editable={this.props.editable || {}}
                />
            );
        }

        if (this.state.remote) {
            return (
                <MaterialTable
                    tableRef={this.tableRef}
                    actions={this.props.actions}
                    title={this.props.title}
                    columns={this.props.columns}
                    options={options}
                    data={query =>
                        new Promise((resolve, reject) => {
                            const pageSize = query.pageSize;
                            const page = query.page;
                            let method = 'get';
                            let params = [this.props.endpoint, pageSize, page * pageSize];
    
                            if(query.search !== "") {
                                method = 'getByText'
                                params = [this.props.endpoint, query.search, pageSize, page * pageSize]
                            }
    
                            apiService[method](...params)
                            .then((result) => {
                                resolve({
                                    data: result[this.props.dataField],
                                    page: page,
                                    totalCount: result.total,
                                });
                            });
                        })
                    }
                    isLoading={this.state.isLoading}
                    editable={this.props.editable || {}}
                />
            );
        }
    }
}

export default TableGrid;
