import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import templates from '../../../utils/links'
const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    }
}));

export function AssetsList() {
    const history = useHistory()
    const classes = useStyles();
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))

    const actions = useMemo(() => {
        const acts = [{
            icon: MdSpaceDashboard,
            tooltip: 'Inspect asset',
            onClick: (_, rowData) => {
                history.push(`/assets/${rowData.id}`);
            },
        }]
        if (permissions.canEditAssets) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit asset',
                onClick: (_, rowData) => {
                    history.push(templates.assetsEdit.templateObj.expand({ id: rowData.id }));
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
        {
            field: 'tenant.name',
            title: 'Tenant',
        },
    ];

    return <Card>
        <CardContent>
            {permissions.canCreateAssets ?
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => history.push(templates.assetsCreate.templateString)}
                    className={classes.button}>
                    <AddIcon className={classes.leftIcon} />
                    New Asset
                </Button> : <></>}
            <TableGridV2
                actions={actions}
                title=''
                columns={columns}
                endpoint={'/v2/assets'}
                dataField='assets'
            />
        </CardContent>
    </Card>
}
