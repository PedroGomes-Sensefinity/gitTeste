import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/TableGrid';
import { usePermissions } from '../../../modules/Permission/PermissionsProvider';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function FloorMapsList() {
    const classes = useStyles();
    const history = useHistory()
    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditFloorMaps) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit Floor Map',
                onClick: (_event, rowData) => {
                    history.push(`/floor-maps/edit/${rowData.id}`);
                },
            })
        }
        return acts
    }, [permissions])

    const columns = [
        {
            field: 'id',
            title: 'ID',
        },
        {
            field: 'label',
            title: 'Label',
        }
    ];

    return (
        <Card>
            <CardContent>
                {permissions.canCreateFloorMaps ?
                    <Link to='/floor-maps/new'>
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}>
                            <AddIcon className={classes.leftIcon} />
                            New Floor Map
                        </Button>
                    </Link> : <></>}
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'floormaps'}
                    dataField='floormaps'
                />
            </CardContent>
        </Card>
    );
}
