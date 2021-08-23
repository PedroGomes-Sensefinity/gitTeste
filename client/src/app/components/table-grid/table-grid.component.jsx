import React from 'react';

import MaterialTable from 'material-table';
import apiService from '../../services/apiService';

class TableGrid extends React.Component {
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            data: props.data || [],
            remote: (typeof props.data === "undefined"),
            endpoint: props.endpoint,
            total: 0,
            page: 0,
            rowsPerPage: 10,
            isLoading: false,
        };
    }

    componentDidMount() {
        if(this.state.remote) {
            //this.getData(this.state.page, this.state.rowsPerPage);
        }
    }
    componentDidUpdate(prevProps) {
        if(typeof this.props.data !== "undefined" && prevProps.data !== this.props.data) {
            this.setState({data: this.props.data});
        }
    }

    getData = () => {
        let page = this.state.page;
        let rowsPerPage = this.state.rowsPerPage;
        let pageOrigin = page;
        page = page + 1;

        this.setState({isLoading: true});

        apiService.get(this.state.endpoint, rowsPerPage, pageOrigin * rowsPerPage)
            .then((result) => {
                /*this.setState({
                    data: result[this.props.dataField],
                    page: pageOrigin,
                    total: result.total,
                });*/
                this.setState({isLoading: false});

                /*setTimeout(() => {
                    this.tableRef.current.onQueryChange();
                }, 0)*/
            });
    };

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
            pageSizeOptions: [10, 15, 100],
            exportButton: true,
            onOrderChange: (rderedColumnId, orderDirection) => {},
            onSearchChange: (search) => {},
            sorting: false
        };

        return (
            <MaterialTable
                tableRef={this.tableRef}
                actions={this.props.actions}
                title={this.props.title}
                columns={this.props.columns}
                options={options}
                data={query =>
                    new Promise((resolve, reject) => {
                        if(!this.state.remote) {
                            resolve({
                                data: this.state.data,
                                page: 0,
                                totalCount: this.state.data.length,
                            });
                            return;
                        }

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
                onChangeRowsPerPage={this.changeRowsPage}
                onChangePage={this.changePage}
                editable={this.props.editable || {}}
            />
        );
    }
}

export default TableGrid;
