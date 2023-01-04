import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ChangePasswordIcon from '@material-ui/icons/VpnKey';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { Layout } from '../../../../_metronic/layout';
import ChangePasswordFormComponent from "../../../components/form/ChangePasswordFormComponent";
import GenericModalComponent from '../../../components/modal/GenericModalComponent';
import TableGrid from '../../../components/table-grid/TableGrid';
import templates from '../../../utils/links';


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
    const navigate = useNavigate()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditUsers) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit user',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.usersEdit, { id: rowData.id })
                    navigate(url);
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
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateUsers ?
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}
                            onClick={() => {
                                navigate(templates.usersCreate)
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
        </Layout>
    );
}
