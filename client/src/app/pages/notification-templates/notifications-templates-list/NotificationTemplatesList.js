import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';

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
    const history = useHistory()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditNotificationTemplates) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit notification template',
                onClick: (_event, rowData) => {
                    history.push(`/notification-templates/edit/${rowData.id}`);
                },
            })
        }
        return acts
    }, [permissions])


    const columns = [
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'type',
            title: 'Type',
        }, {
            field: 'tenant.name',
            title: 'Tenant'
        }
    ];

    return (
        <Card>
            <CardContent>
                {permissions.canCreateNotificationTemplates ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/notification-templates/new')
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New Notification Template
                    </Button> : <></>}
                <TableGridV2
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'/v2/notification-templates'}
                    dataField='notification_templates'
                />
            </CardContent>
        </Card>
    );
}
