import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { Layout } from '../../../../_metronic/layout';
import TableGrid from '../../../components/table-grid/TableGrid';
import templates from '../../../utils/links';



const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));
export function RoutesList() {
    const classes = useStyles();
    const navigate = useNavigate()
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditRoutes) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit route',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.routesEdit, { id: rowData.id })
                    navigate(url);
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

    useEffect(() => {

    }, []);

    return (
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateRoutes ?
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}
                            onClick={() => {
                                navigate(templates.routesCreate)
                            }}>
                            <AddIcon className={classes.leftIcon} />
                            New Route
                        </Button> : <></>}
                    <TableGrid
                        actions={actions}
                        title=''
                        columns={columns}
                        endpoint={'route'}
                        dataField='routes'
                    />
                </CardContent>
            </Card>
        </Layout>
    );
}
