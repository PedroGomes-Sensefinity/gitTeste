import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import history from '../../../history';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Button } from '@material-ui/core';
import apiService from '../../../services/apiService'

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TableGrid from '../../../components/table-grid/table-grid.component';

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
    const [data, setData] = React.useState([]);
    const classes = useStyles();

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
        new Promise((resolve, reject) => {
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
        })
        .then((result) => {
            console.log(result);
            result.data.forEach(threshold => {
                const rule = JSON.parse(threshold['rule']);
                switch(rule['type']) {
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
                    default:
                        console.log("Error: Unidentified threshold type.")
                }
            })
            setData(result.data);
        });
    }


    return (
        <Card>
            <CardContent>
                <Link to='/thresholds/new'>
                    <Button
                        variant='contained'
                        color='secondary'
                        className={classes.button}>
                        <AddIcon className={classes.leftIcon} />
                        New threshold
                    </Button>
                </Link>
                <TableGrid
                    actions={[
                        {
                            icon: EditIcon,
                            tooltip: 'Edit threshold',
                            onClick: (event, rowData) => {
                                history.push(`/thresholds/edit/${rowData.id}`);
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    data = {data}
                />
            </CardContent>
        </Card>
    );
}
