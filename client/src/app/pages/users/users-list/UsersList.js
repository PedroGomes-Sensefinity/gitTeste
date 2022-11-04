import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ChangePasswordIcon from '@material-ui/icons/VpnKey';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ChangePasswordFormComponent from "../../../components/form/changePasswordFormComponent";
import GenericModalComponent from '../../../components/modal/genericModalComponent';
import TableGrid from '../../../components/table-grid/table-grid.component';
import { usePermissions } from '../../../modules/Permission/PermissionsProvider';


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
    const [userUsername, setUserUsername] = useState('');
    const history = useHistory()

    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditUsers) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit user',
                onClick: (_event, rowData) => {
                    history.push(`/users/edit/${rowData.id}`);
                },
            },
                {
                    icon: ChangePasswordIcon,
                    tooltip: "Change user's password",
                    onClick: (_event, rowData) => {
                        setUserId(rowData.id)
                        setUserUsername(rowData.username)
                        setShow(true);
                    },
                })
        }
        return acts
    }, [permissions])

    const ChangePasswordComponent = <ChangePasswordFormComponent userId={userId} handleClose={() => { setShow(false) }} />

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
                {permissions.canCreateUsers ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/users/new')
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New User
                    </Button> : <></>}
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'user'}
                    dataField='users'
                />
            </CardContent>

            <GenericModalComponent
                content={ChangePasswordComponent}
                show={show}
                handleClose={() => { setShow(false) }}
                title={'Changing password [' + userUsername + ']'}
            // title={intl.formatMessage({id: 'MODAL.PASSWORD.TITLE'}) + userUsername}
            />
        </Card>
    );
}
