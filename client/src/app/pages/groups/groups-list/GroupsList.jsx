import React, { useMemo } from 'react';

import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { generatePath, Link, useNavigate } from 'react-router-dom';

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

export function GroupsList() {
    const navigate = useNavigate()
    const classes = useStyles();
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditGroups) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit group',
                onClick: (_event, rowData) => {
                    const url = generatePath(templates.groupEdit, { id: rowData.id })
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
        },
        {
            field: 'parent_label',
            title: 'Parent label'
        },
    ];

    return (
        <Layout>
            <Card>
                <CardContent>
                    {permissions.canCreateGroups ?
                        <Link to={templates.groupCreate}>
                            <Button
                                variant='contained'
                                color='secondary'
                                className={classes.button}>
                                <AddIcon className={classes.leftIcon} />
                                New group
                            </Button></Link> : <></>}
                    <TableGrid
                        actions={actions}
                        title=''
                        columns={columns}
                        endpoint={'group'}
                        dataField='groups'
                    />
                </CardContent>
            </Card>
        </Layout>
    );
}
