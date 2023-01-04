import React, { useMemo } from 'react';

import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { generatePath, useNavigate } from 'react-router-dom';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { useSelector } from 'react-redux';
import TableGrid from '../../../components/table-grid/TableGrid';
import templates from '../../../utils/links';
import { Layout } from '../../../../_metronic/layout';

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

export function ProfilesList() {
    const classes = useStyles();
    const navigate = useNavigate()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditProfiles) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit profile',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.profilesEdit, { id: rowData.id })
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
            field: 'name',
            title: 'Name',
        }
    ];

    return (
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateProfiles ?
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}
                            onClick={() => {
                                navigate(templates.profilesCreate)
                            }}>
                            <AddIcon className={classes.leftIcon} />
                            New Profile
                        </Button> : <></>}
                    <TableGrid
                        actions={actions}
                        title=''
                        columns={columns}
                        endpoint={'profile'}
                        dataField='profiles'
                    />
                </CardContent>
            </Card>
        </Layout>
    );
}