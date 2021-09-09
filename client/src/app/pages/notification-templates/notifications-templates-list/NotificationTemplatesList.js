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

export function NotificationTemplatesList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'type',
            title: 'Type',
        }
    ];

    return (
        <Card>
            <CardContent>
                <Link to='/notification-templates/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New Notification Template
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit notification template',
                            onClick: (event, rowData) => {
                                history.push(`/notification-templates/edit/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'notificationstemplate'}
                    dataField='notifications_templates'
                />
            </CardContent>
        </Card>
    );
}
