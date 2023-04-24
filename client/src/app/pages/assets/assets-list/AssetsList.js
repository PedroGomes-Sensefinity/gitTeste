import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AssetTableGrid } from '../../../components/table-grid/AssetsTableGrid';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import { injectIntl } from "react-intl";

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
            title: "Dashboard",
            onClick: (_, rowData) => {
                history.push(`/assets/${rowData.id}`);
            },
        }]
        if (permissions.canEditAssets) {
            acts.push({
                icon: EditIcon,
                title: "Edit",
                tooltip: 'Edit asset',
                onClick: (_, rowData) => {
                    history.push(`/assets/${rowData.id}#edit`);
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
            field: 'tenant.name',
            title: 'Tenant',
        },
        {
            field: 'devices_ids',
            title: 'Device',
        },
        {
            field: 'asset_type.type',
            title: 'Asset Family',
        },
        {
            field: 'asset_type.label',
            title: 'Asset Type',
        },
        {
            field: 'description',
            title: 'Description',
        },
    ];

    return <Card>
        <CardContent>
            {permissions.canCreateAssets ?
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => history.push('/assets/new')}
                    className={classes.button}>
                    <AddIcon className={classes.leftIcon} />
                    New Asset
                </Button> : <></>}
            <AssetTableGrid
                actions={actions}
                columns={columns}
            />
        </CardContent>
    </Card>
}

export default injectIntl(AssetsList);