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

export function GroupsList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'id',
            title: 'ID',
        },
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'parent_label',
            title: 'Parent label'
        },
    ];

    return (
        <Card>
            <CardContent>
                <Link to='/groups/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New group
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit group',
                            onClick: (event, rowData) => {
                                history.push(`/groups/edit/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'group'}
                    dataField='groups'
                />
            </CardContent>
        </Card>
    );
}
