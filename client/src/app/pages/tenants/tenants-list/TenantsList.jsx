import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
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
    }
}));

export function TenantsList() {
    const classes = useStyles();
    const navigate = useNavigate()
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditTenants) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit tenant',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.tenantsEdit, { id: rowData.id })
                    navigate(url);
                },
            })
        }
        return acts
    }, [permissions])

    const columns = [
        {
            field: 'id',
            title: 'Id',
        },
        {
            field: 'name',
            title: 'Name',
        }
    ];

    return (
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateTenants ?
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}
                            onClick={() => {
                                navigate(templates.tenantsCreate)
                            }}>
                            <AddIcon className={classes.leftIcon} />
                            New Tenant
                        </Button> : <></>}
                    <TableGrid
                        actions={actions}
                        title=''
                        columns={columns}
                        endpoint={'tenant_new'}
                        dataField='tenants_new'
                    />
                </CardContent>
            </Card>
        </Layout>
    );
}
