import { Button, Card, CardContent } from '@material-ui/core';
import React, { useMemo } from 'react';

import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DetailsIcon from '@material-ui/icons/Details';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/table-grid.component';
import { usePermissions } from '../../../modules/Permission/PermissionsProvider';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function AssetsList() {
    const history = useHistory()
    const classes = useStyles();
    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = [{
            icon: DetailsIcon,
            tooltip: 'Inspect asset',
            onClick: (_, rowData) => {
                history.push(`/assets/${rowData.id}`);
            },
        }]
        if (permissions.canEditAssets) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit asset',
                onClick: (_, rowData) => {
                    history.push(`/assets/${rowData.id}#edit`);
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
            field: 'description',
            title: 'Description',
        },
    ];

    return <Card>
        <CardContent>
            {permissions.canCreateAssets ?
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => history.push('/assets/new')}
                    className={classes.button}>
                    <AddIcon className={classes.leftIcon} />
                    New Asset
                </Button> : <></>}
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
