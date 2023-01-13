import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GeofencesTableGrid } from '../../../components/table-grid/GeofencesTableGrid';


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
            return [
                {
                    icon: MdSpaceDashboard,
                    tooltip: 'View Geofence',
                    onClick: (_event, rowData) => {
                        history.push(`/geofences/${rowData.id}#history`);
                    }
                },
                {
                    icon: EditIcon,
                    tooltip: 'Edit Geofence',
                    onClick: (_event, rowData) => {
                        history.push(`/geofences/${rowData.id}#edit`);
                    },
                }
            ]
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
            <GeofencesTableGrid
                actions={actions}
                columns={columns}
            />
        </CardContent>
    </Card>
}
