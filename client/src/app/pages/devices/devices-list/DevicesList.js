import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../../history';
import apiService from '../../../services/apiService';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/table-grid.component';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
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
                        },
                    ]}
                    title=''
                    columns={columns}
                    service={apiService}
                    endpoint={'device'}
                    dataField='devices'
                />
            </CardContent>
        </Card>
    );
}
