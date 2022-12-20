import { Button, Card, CardContent } from '@material-ui/core';
import React, { useMemo } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function GeofencesList() {
    const history = useHistory()
    const classes = useStyles();
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditGeofences) {
            return [{
                icon: EditIcon,
                tooltip: 'Edit Geofence',
                onClick: (_event, rowData) => {
                    history.push(`/geofences/edit/${rowData.id}`);
                },
            }]
        }
        return acts
    }, [permissions])

    const columns = [
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'description',
            title: 'Description',
        },
        {
            field: 'alert_mode',
            title: 'Alert Mode',
        },
        {
            field: 'tenant.name',
            title: 'Tenant',
        },
    ];


    return <Card>
        <CardContent>
            {permissions.canCreateGeofences ?
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => history.push('/geofences/new')}
                    className={classes.button}>
                    <AddIcon className={classes.leftIcon} />
                    New Geofence
                </Button> : <></>}
            <TableGridV2
                actions={actions}
                title=''
                columns={columns}
                endpoint={'/v2/geofences'}
                dataField='geofences'
            />
        </CardContent>
    </Card>
}
