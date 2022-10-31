import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';
import history from '../../../history';
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

export function BoardFamiliesList() {
    const classes = useStyles();

    const columns = [
        {
            field: 'name',
            title: 'Name',
        }
    ];

    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditBoardFamilies) {
            acts.push(
                {
                    icon: EditIcon,
                    tooltip: 'Edit board family',
                    onClick: (event, rowData) => {
                        history.push(`/board-families/edit/${rowData.id}`);
                    },
                })
        }
        return acts
    }, [permissions])

    return (
        <Card>
            <CardContent>
                {permissions.canCreateBoardFamilies ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/board-families/new')
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New board family
                    </Button> : <></>
                }
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'board_families'}
                    dataField='board_families'
                />
            </CardContent>
        </Card>
    );
}
