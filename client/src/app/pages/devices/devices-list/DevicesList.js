import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../../history';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DetailsIcon from '@material-ui/icons/Details';
import TableGrid from '../../../components/table-grid/table-grid.component';

import PermissionGate from "../../../modules/Permission/permissionGate";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

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
            field: 'container_name',
            title: 'Group',
        },
        {
            field: 'board_family.name',
            title: 'Board Family',
        },
        {
            field: 'board',
            title: 'Board ID',
        },
        {
            field: 'imei',
            title: 'IMEI',
        },
    ];

    return (
        <PermissionGate permission={'device_view'}>
            <Card>
                <CardContent>
                    <Link to='/devices/new'>
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}>
                            <AddIcon className={classes.leftIcon} />
                            New device
                        </Button>
                    </Link>
                        <TableGrid
                            actions={[
                                {
                                    icon: EditIcon,
                                    tooltip: 'Edit device',
                                    onClick: (event, rowData) => {
                                        history.push(`/devices/edit/${rowData.id}`);
                                    },
                                },{
                                    icon: DetailsIcon,
                                    tooltip: 'Inspect device',
                                    onClick: (event, rowData) => {
                                        history.push(`/devices/${rowData.id}`);
                                    },
                                },
                            ]}
                            title=''
                            columns={columns}
                            endpoint={'device'}
                            dataField='devices'
                        />
                </CardContent>
            </Card>
        </PermissionGate>
    );
}
