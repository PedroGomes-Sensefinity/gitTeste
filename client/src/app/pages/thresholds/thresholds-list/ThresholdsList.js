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

export function ThresholdsList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'name',
            title: 'Name',
        }
    ];

    return (
        <Card>
            <CardContent>
                <Link to='/thresholds/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New threshold
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit threshold',
                            onClick: (event, rowData) => {
                                history.push(`/thresholds/edit/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'threshold'}
                    dataField='thresholds'
                />
            </CardContent>
        </Card>
    );
}
