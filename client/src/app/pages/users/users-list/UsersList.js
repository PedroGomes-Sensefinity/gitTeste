import React, {useState} from 'react';

import { Link } from 'react-router-dom';
import history from '../../../history';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';

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

export function UsersList() {
    const classes = useStyles();
    const [show, setShow] = useState(false);
    const [userId, setUserId] = useState(0);
    const [tenantUsername, setTenantUsername] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const ChangePasswordComponent = <ChangePasswordFormComponent userId={userId} />

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
                <Link to='/users/new'>
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
                            tooltip: 'Edit user',
                            onClick: (event, rowData) => {
                                history.push(`/users/edit/${rowData.id}`);
                            },
                        },
                        {
                            icon: ChangePasswordIcon,
                            tooltip: "Change user's password",
                            onClick: (event, rowData) => {
                                setUserId(rowData.id)
                                setTenantUsername(rowData.username)
                                handleShow(true);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    endpoint={'user'}
                    dataField='users'
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
