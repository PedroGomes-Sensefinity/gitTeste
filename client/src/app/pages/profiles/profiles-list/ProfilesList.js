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
    },
}));

export function ProfilesList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'id',
            title: 'ID',
        },
        {
            field: 'name',
            title: 'Name',
        }
    ];

    return (
        <Card>
            <CardContent>
                <Link to='/profiles/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New Profile
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit profile',
                            onClick: (event, rowData) => {
                                history.push(`/profiles/edit/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'profile'}
                    dataField='profiles'
                />
            </CardContent>
        </Card>
    );
}