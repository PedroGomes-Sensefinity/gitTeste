import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableGridV2 from '../../../components/table-grid/TableGridV2';
import templates from '../../../utils/links';


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
                    const url = templates.thresholdsEdit.templateObj.expand({ id: rowData.id })
                    history.push(url);
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
                            const url = templates.thresholdsCreate.templateString
                            history.push(url)
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