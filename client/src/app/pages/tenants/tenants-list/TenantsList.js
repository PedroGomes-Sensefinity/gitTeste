import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/TableGrid';
import { injectIntl } from "react-intl";

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
    const history = useHistory()
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    
    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditTenants) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit tenant',
                onClick: (_event, rowData) => {
                    history.push(`/tenants/edit/${rowData.id}`);
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
        <Card>
            <CardContent>
                {permissions.canCreateTenants ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/tenants/new')
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
    );
}

export default injectIntl(TenantsList);