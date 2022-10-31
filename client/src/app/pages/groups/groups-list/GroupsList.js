import React, { useMemo } from 'react';

import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Button } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
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

export function GroupsList() {
    const history = useHistory()
    const classes = useStyles();
    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        if (permissions.canEditGroups) {
            return [{
                icon: EditIcon,
                tooltip: 'Edit group',
                onClick: (event, rowData) => {
                    history.push(`/groups/edit/${rowData.id}`);
                },
            }]
        }
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
        <Card>
            <CardContent>
                {permissions.canCreateGroups ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/groups/new')
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New group
                    </Button> : <></>}
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'group'}
                    dataField='groups'
                />
            </CardContent>
        </Card>
    );
}
