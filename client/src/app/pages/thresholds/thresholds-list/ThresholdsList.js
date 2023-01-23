import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import apiService from '../../../services/apiService';
import { injectIntl } from "react-intl";

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

export function ThresholdsList() {
    const [data, setData] = useState([]);
    const classes = useStyles();
    const history = useHistory()

    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditThresholds) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit threshold',
                onClick: (_event, rowData) => {
                    history.push(`/thresholds/${rowData.id}/edit`);
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
            field: 'type',
            title: 'Type',
        },
        {
            field: 'tenant.name',
            title: 'Tenant',
        },
    ];


    return (
        <Card>
            <CardContent>
                {permissions.canCreateThresholds ?
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}
                        onClick={() => {
                            history.push('/thresholds/new')
                        }}>
                        <AddIcon className={classes.leftIcon} />
                        New threshold
                    </Button> : <></>}
                <TableGridV2
                    actions={actions}
                    title=''
                    columns={columns}
                    endpoint={'/v2/thresholds'}
                    dataField='thresholds'
                />
            </CardContent>
        </Card>
    );
}

export default injectIntl(ThresholdsList);