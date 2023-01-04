import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../../../../_metronic/layout';
import TableGrid from '../../../components/table-grid/TableGrid';
import templates from '../../../utils/links';

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
    const navigate = useNavigate()
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditFloorMaps) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit Floor Map',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.floorMapsEdit, { id: rowData.id })
                    navigate(url);
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
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateFloorMaps ?
                        <Link to={templates.floorMapsCreate}>
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
        </Layout>
    );
}
