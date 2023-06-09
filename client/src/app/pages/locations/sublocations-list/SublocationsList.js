import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { MdSpaceDashboard } from "react-icons/md";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

export function SubLocationsList() {
    const history = useHistory()
    const classes = useStyles();
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))


    const actions = useMemo(() => {
        const acts = []

        acts.push({
            icon: permissions.canEditSubLocations ? EditIcon : MdSpaceDashboard,
            tooltip: permissions.canEditSubLocations ? 'Edit Sublocation' : 'View Sublocation',
            onClick: (_, rowData) => {
                history.push(`/sublocations/edit/${rowData.id}`);
            },
        })

        return acts
    }, [permissions])


    const columns = [
        {
            field: 'name',
            title: 'Name',
        },
        {
            field: 'port_code',
            title: 'Port Code',
        }, {
            field: 'tenant.name',
            title: 'Tenant'
        }
    ];

    return <Card>
        <CardContent>
            {permissions.canCreateLocations ?
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => history.push('/sublocations/new')}
                    className={classes.button}>
                    <AddIcon className={classes.leftIcon} />
                    New SubLocation
                </Button> : <></>}
            <TableGridV2
                actions={actions}
                title=''
                columns={columns}
                endpoint={'/v2/sublocations'}
                dataField='sublocations'
            />
        </CardContent>
    </Card>
}

export default injectIntl(SubLocationsList);