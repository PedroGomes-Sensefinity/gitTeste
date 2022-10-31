import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/table-grid.component';
import { usePermissions } from '../../../modules/Permission/PermissionsProvider';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));
export function RoutesList() {
    const classes = useStyles();
    const history = useHistory()
    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditRoutes) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit route',
                onClick: (_event, rowData) => {
                    history.push(`/routes/edit/${rowData.id}`);
                },
            })
        }
        return acts
    }, [permissions])

    const columns = [
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'description',
            title: 'Description',
        },
    ];

    useEffect(() => {

    }, []);

    return (
        <Card>
            <CardContent>
                {permissions.canCreateRoutes ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/routes/new')
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New Route
                    </Button> : <></>}
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'route'}
                    dataField='routes'
                />
            </CardContent>
        </Card>
    );
}
