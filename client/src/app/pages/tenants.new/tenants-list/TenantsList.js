import React from 'react';
import { Link } from 'react-router-dom';
import history from '../../../history';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/table-grid.component';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function TenantsNewList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'id',
            title: 'Id',
        },
        {
            field: 'name',
            title: 'Name',
        }
    ];

    return (
        <Card>
            <CardContent>
                <Link to='/tenants-new/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New Tenant
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit tenant',
                            onClick: (event, rowData) => {
                                history.push(`/tenants-new/edit/${rowData.id}`);
                            },
                        }
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'tenant_new'}
                    dataField='tenants_new'
                />
            </CardContent>
        </Card>
    );
}
