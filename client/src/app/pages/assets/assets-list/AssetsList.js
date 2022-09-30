import React, {useEffect, useState} from 'react';

import history from '../../../history';
import {Button, Card, CardContent, CircularProgress} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/table-grid.component';
import DetailsIcon from '@material-ui/icons/Details';
import AddIcon from "@material-ui/icons/Add";
import {makeStyles} from "@material-ui/core/styles";
import usePermissions from '../../../utils/customHooks';
import PermissionDenied from '../../../modules/Permission/permissionDenied';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));
export function AssetsList() {
    const classes = useStyles();
    const [actions, setActions] = useState([])
    const {
        asset_view: canView, 
        asset_edit: canEdit, 
        asset_create: canCreate
    } = usePermissions('asset_view', 'asset_edit', 'asset_create')

    const [isLoading, setLoading] = useState(true)


    useEffect(() => {
        // Change this so it removes action on permission change very rare usecase tho
        if(canEdit === undefined || canView === undefined )
            return 

        let newActions = []
        if(canView) {
            newActions.push(
                {
                    icon: DetailsIcon,
                    tooltip: 'Inspect device',
                    onClick: (_, rowData) => {
                        history.push(`/assets/${rowData.id}`);
                    },
                }
            )
        }

        if(canEdit) {
            newActions.push(
                {
                    icon: EditIcon,
                    tooltip: 'Edit asset',
                    onClick: (_, rowData) => {
                        history.push(`/assets/${rowData.id}/edit`);
                    },
                },
            )
        }
        setActions(newActions)
        setLoading(false)

    }, [canView, canCreate, canEdit])

    const columns = [
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'description',
            title: 'Description',
        },
    ];

    if (isLoading)
        //check this maybe apply to more componnents
        return <CircularProgress />
    else if(!canEdit && !canView) 
        return <PermissionDenied/>
    else
        return <Card>
                    <CardContent>
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => history.push('/assets/new')}
                            disabled={!canCreate}
                            className={classes.button}>
                            <AddIcon className={classes.leftIcon} />
                            New Asset
                        </Button>
                        <TableGrid
                            actions={actions}
                            title=''
                            columns={columns}
                            endpoint={'asset'}
                            dataField='assets'
                        />
                    </CardContent>
                </Card>
}
