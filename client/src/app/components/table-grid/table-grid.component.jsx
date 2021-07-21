import React, { forwardRef } from 'react';

import MaterialTable from 'material-table';
import apiService from '../../services/apiService';

class TableGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data || [],
            total: 0,
            page: 0,
            rowsPerPage: 10,
        };
    }

    componentDidMount() {
        this.getData(this.state.page, this.state.rowsPerPage);
        if(typeof this.props.data === 'undefined') {
            this.getData(this.state.page, this.state.rowsPerPage);
        }
    }
    componentDidUpdate(prevProps) {
        if(typeof this.props.data !== "undefined" && prevProps.data !== this.props.data) {
            this.setState({data: this.props.data});
        }
    }

    getData = (page, rowsPerPage) => {
        let pageOrigin = page;
        page = page + 1;
        apiService
            .get(this.props.endpoint,rowsPerPage, pageOrigin * rowsPerPage)
            .then((result) => {
                this.setState({
                    page: pageOrigin,
                    data: result[this.props.dataField],
                    total: result.total
                });
            });
    };

    getSortedData = (changedColumn, order) => {};

    changePage = (page) => {
        this.props.onChangePage(page);
    };

    changeRowsPage = (rowsPerPage) => {
        this.props.onChangeRowsPage(rowsPerPage);
    };

    render() {
        const options = {
            pageSize: 10,
            pageSizeOptions: [10, 15, 100],
            exportButton: true,
            isLoading: true,
            onOrderChange: (rderedColumnId, orderDirection) => {},
            onSearchChange: (search) => {}
        };

        return (
            <MaterialTable
                actions={this.props.actions}
                title={this.props.title}
                columns={this.props.columns}
                options={options}
                data={this.state.data}
                onChangeRowsPerPage={this.changeRowsPage}
                onChangePage={this.changePage}
            />
        );
    }
}

export default TableGrid;
