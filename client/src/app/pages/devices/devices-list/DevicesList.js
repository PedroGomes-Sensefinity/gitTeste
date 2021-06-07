import React from 'react';
import ReactDOM from 'react-dom';
import MaterialTable from 'material-table';
import history from '../../../history';
import deviceService from '../../../services/deviceService';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import TableGrid from '../../../components/table-grid/table-grid.component';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export function DevicesList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'id',
            title: 'ID',
        },
        {
            field: 'parent_id',
            title: 'Parent ID',
        },
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'containers[0].label',
            title: 'Group',
        },
        {
            field: 'board_family.name',
            title: 'Board Family',
        },
        {
            field: 'board',
            title: 'Board Id',
        },
        {
            field: 'imei',
            title: 'IMEI',
        },
    ];

    return (
        <Card>
            <CardContent>
                <TableGrid
                    actions={[
                        {
                            icon: Edit,
                            tooltip: 'Edit device',
                            onClick: (event, rowData) => {
                                history.push(`/device/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    service={deviceService}
                    dataField='devices'
                />
            </CardContent>
        </Card>
    );
}
