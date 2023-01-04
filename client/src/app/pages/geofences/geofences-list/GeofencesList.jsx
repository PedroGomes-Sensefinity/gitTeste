import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { Layout } from '../../../../_metronic/layout';
import SelectableTableGrid from '../../../components/table-grid/SelectableTableGrid';
import templates from '../../../utils/links';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function GeofencesList() {
    const navigate = useNavigate()
    const classes = useStyles();
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditGeofences) {
            return [{
                icon: EditIcon,
                tooltip: 'Edit Geofence',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.geofencesEdit, { id: rowData.id })
                    navigate(url);
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

    return <Layout>
        <Card>
            <CardContent>
                {permissions.canCreateGeofences ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            const url = templates.geofencesCreate
                            navigate(url)
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New Geofence
                    </Button>
                    : <></>}
                <SelectableTableGrid
                    actions={actions}
                    columns={columns}
                    endpoint={'/v2/geofences'}
                    dataField='geofences'
                />
            </CardContent>
        </Card>
    </Layout>
}
