import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import { usePermissions } from '../../../modules/Permission/PermissionsProvider';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function LocationsList() {
    const history = useHistory()
    const classes = useStyles();
    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = []
        acts.push({
            icon: EditIcon,
            tooltip: 'View or Edit Location',
            onClick: (_, rowData) => {
               history.push(`/locations/edit/${rowData.id}`);
            },
        })
        return acts
    }, [permissions])


    const columns = [
        {
            field: 'name',
            title: 'Name',
        },
    ];

    return <Card>
        <CardContent>
            {permissions.canCreateLocations ?
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => history.push('/locations/new')}
                    className={classes.button}>
                    <AddIcon className={classes.leftIcon} />
                    New Location
                </Button> : <></>}
            <TableGridV2
                actions={actions}
                title=''
                columns={columns}
                endpoint={'/v2/locations'}
                dataField='locations'
            />
        </CardContent>
    </Card>
}
