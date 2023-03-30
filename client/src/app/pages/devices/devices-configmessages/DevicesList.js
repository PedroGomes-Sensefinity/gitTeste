import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/TableGrid';
import { injectIntl } from "react-intl";
import TableGridV2 from '../../../components/table-grid/TableGridV2';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

export function DevicesConfigMessages() {
    const classes = useStyles();
    const history = useHistory()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const actions = useMemo(() => {
        const acts = [{
            icon: MdSpaceDashboard,
            tooltip: 'Inspect device',
            onClick: (_event, rowData) => {
                history.push(`/devices/${rowData.device_id}`);
            },
        }]
        return acts
    }, [permissions])
    const columns = [
        {
            field: 'device_id',
            title: 'Device ID',
        },
        {
            field: 'date_created',
            title: 'Date Created',
        },
        {
            field: 'message',
            title: 'Message',
        },
        {
            field: 'sent',
            title: 'Sent',
        }
    ];

    return (
        <Card>
            <CardContent>
                <TableGridV2
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'/v2/configmessages'}
                    dataField='message_configs'
                />
            </CardContent>
        </Card>
    );
}

export default injectIntl(DevicesConfigMessages);