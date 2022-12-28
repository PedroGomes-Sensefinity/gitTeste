import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { te } from 'date-fns/locale';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import TableGrid from '../../../components/table-grid/TableGrid';
import templates from '../../../utils/links'


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
}));

export function DevicesList() {
    const classes = useStyles();
    const history = useHistory()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const actions = useMemo(() => {
        const acts = [{
            icon: MdSpaceDashboard,
            tooltip: 'Inspect device',
            onClick: (_event, rowData) => {
                history.push(`/devices/${rowData.id}`);
            },
        }]
        if (permissions.canEditDevices) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit device',
                onClick: (_event, rowData) => {
                    const url = templates.deviceEdit.templateObj.expand({ id: rowData.id })
                    history.push(url);
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
            field: 'parent_id',
            title: 'Parent ID',
        },
        {
            field: 'label',
            title: 'Label',
        },
        {
            field: 'container_name',
            title: 'Group',
        },
        {
            field: 'board_family.name',
            title: 'Board Family',
        },
        {
            field: 'board',
            title: 'Board ID',
        },
        {
            field: 'imei',
            title: 'IMEI',
        },
    ];

    return (
        <Card>
            <CardContent>
                {permissions.canCreateDevices ?
                    <Link to={templates.deviceCreate.templateObj.expand()}>
                        <Button
                            variant='contained'
                            color='secondary'
                            className={classes.button}>
                            <AddIcon className={classes.leftIcon} />
                            New device
                        </Button>
                    </Link> : <></>}
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'device'}
                    dataField='devices'
                />
            </CardContent>
        </Card>
    );
}
