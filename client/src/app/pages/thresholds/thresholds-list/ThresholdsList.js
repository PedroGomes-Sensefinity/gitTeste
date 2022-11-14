import { Button, Card, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiService from '../../../services/apiService';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/TableGrid';
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

export function ThresholdsList() {
    const [data, setData] = useState([]);
    const classes = useStyles();
    const history = useHistory()

    const { permissions } = usePermissions()
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
            field: 'name',
            title: 'Name',
        },
        {
            field: 'type',
            title: 'Type',
        }
    ];

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        new Promise((resolve, _reject) => {
            let method = 'get';
            let params = ['threshold', 999999, 0];

            apiService[method](...params)
                .then((result) => {
                    resolve({
                        data: result['thresholds'],
                        page: 0,
                        totalCount: result.total,
                    });
                });
        }).then((result) => {
            if (result.data !== undefined) {
                if (result.length !== 0) {
                    result.data.forEach(threshold => {
                        const rule = JSON.parse(threshold['rule']);
                        switch (rule['type']) {
                            case 'temperaturedegree':
                            case 'temperature':
                                threshold['type'] = "Temperature";
                                break;
                            case 'geofences':
                            case 'geofence':
                                threshold['type'] = "Geo-fences";
                                break;
                            case 'humidityrelative':
                                threshold['type'] = "Humidity";
                                break;
                            case 'buttonpressed':
                                threshold['type'] = "Button pressed"
                                break;
                            case 'movementstatus':
                                threshold['type'] = "Movement status"
                                break;
                            case 'acceleration':
                                threshold['type'] = "Acceleration"
                                break;
                            default:
                                console.log("Error: Unidentified threshold type.")
                        }
                    })
                }
                setData(result.data);
            }
        });
    }


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
                <TableGrid
                    actions={actions}
                    title=''
                    columns={columns}
                    data={data}
                />
            </CardContent>
        </Card>
    );
}