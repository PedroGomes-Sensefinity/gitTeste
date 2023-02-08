import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import { injectIntl } from "react-intl";

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
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

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
        },
        {
            field: 'tenant.name',
            title: 'Tenant',
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
                <TableGridV2
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'/v2/floormaps'}
                    dataField='floor_maps'
                />
            </CardContent>
        </Card>
    );
}

export default injectIntl(FloorMapsList);