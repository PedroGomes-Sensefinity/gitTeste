import React, {useState} from 'react';

import { Link } from 'react-router-dom';
import history from '../../../history';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import ChangePasswordIcon from '@material-ui/icons/VpnKey';
import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/table-grid.component';
import GenericModalComponent from '../../../components/modal/genericModalComponent'
import ChangePasswordFormComponent from "../../../components/form/changePasswordFormComponent";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    iconSmall: {
        fontSize: 20,
    },
}));

export function TenantsList() {
    const classes = useStyles();
    const [show, setShow] = useState(false);
    const [tenantId, setTenantId] = useState(0);
    const [tenantUsername, setTenantUsername] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const ChangePasswordComponent = <ChangePasswordFormComponent tenantId={tenantId} />

    const columns = [
        {
            field: 'name',
            title: 'Name',
        },
        {
            field: 'username',
            title: 'Username',
        }
    ];

    return (
        <Card>
            <CardContent>
                <Link to='/tenants/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New Tenant
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit tenant',
                            onClick: (event, rowData) => {
                                history.push(`/tenants/edit/${rowData.id}`);
                            },
                        },
                        {
                            icon: ChangePasswordIcon,
                            tooltip: "Change user's password",
                            onClick: (event, rowData) => {
                                setTenantId(rowData.id)
                                setTenantUsername(rowData.username)
                                handleShow(true);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'tenant'}
                    dataField='tenants'
                />
            </CardContent>

            <GenericModalComponent
                content={ChangePasswordComponent}
                show={show}
                handleClose={handleClose}
                title={'Changing password [' + tenantUsername + ']'}
                // title={intl.formatMessage({id: 'MODAL.PASSWORD.TITLE'}) + tenantUsername}
            />
        </Card>

    );
}
