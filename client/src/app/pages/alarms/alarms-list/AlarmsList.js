import React, { useEffect, useMemo } from 'react';

import { Card, CardContent } from '@material-ui/core';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import history from '../../../history';
import notificationService from "../../../services/notificationService";

import { useLang } from '../../../../_metronic/i18n/Metronici18n';
import TableGrid from '../../../components/table-grid/table-grid.component';

export function AlarmsList() {
    const [, setTimefilter] = React.useState();
    const [data, setData] = React.useState([]);
    const [statusDateStart, setStatusDateStart] = React.useState('-');
    const [statusDateEnd, setStatusDateEnd] = React.useState('-');
    const locale = useLang();
    const { permissions } = usePermissions()

    const actions = useMemo(() => {
        const acts = []
        if (permissions.canEditNotificationTemplates) {
            acts.push({
                icon: EditIcon,
                tooltip: 'Edit notification template',
                onClick: (_event, rowData) => {
                    history.push(
                        `/notification-templates/edit/${rowData.id}`
                    );
                }
            })
        }
        return acts
    }, [permissions])

    const timefilterOptions = [
        {
            id: 'last24hours',
            name: 'Last 24 hours',
        },
        {
            id: 'lastweek',
            name: 'Last week',
        },
        {
            id: 'lastmonth',
            name: 'Last month',
        },
    ];
    const columns = [
        {
            field: 'id',
            title: 'ID',
        },
        {
            field: 'timestamp',
            title: 'Time',
            type: 'datetime',
            dateSetting: { locale: locale },
        },
        {
            field: 'device',
            title: 'Device',
        },
        {
            field: 'type',
            title: 'Type'
        },
        {
            field: 'data.value',
            title: 'Value',
        },
    ];

    const onChangeTimefilter = (event) => {
        let dateStart = '';
        let dateEnd = moment.utc();

        switch (event.target.value) {
            default:
                dateStart = moment().subtract(1, "days").utc();
                break;
            case 'lastweek':
                dateStart = moment().subtract(7, "days").utc();
                break;
            case 'lastmonth':
                dateStart = moment().subtract(1, "months").utc();
                break;
        }

        // Format: 2021-07-19T07:59:00.00Z
        setStatusDateStart(dateStart.format('YYYY-MM-DDTHH:mm:00.00[Z]'));
        setStatusDateEnd(dateEnd.format('YYYY-MM-DDTHH:mm:00.00[Z]'));
        setTimefilter(event.target.value);
        getData();
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        notificationService.get('alarm', 'created', statusDateStart, statusDateEnd, 999999, 0/* getOffset(page, rowsPage) */)
            .then((result) => {
                if (result.length !== 0) {
                    result.alarms.forEach(alarm => {
                        switch (alarm.type) {
                            case 'temperaturedegree':
                                alarm.type = "Temperature";
                                break;
                            case 'geofences':
                                alarm.type = "Geo-fences";
                                break;
                            case 'humidityrelative':
                                alarm.type = "Humidity";
                                break;
                            case 'buttonpressed':
                                alarm.type = "Button pressed"
                                break;
                            default:
                                console.log("Error: Unidentified threshold type.")
                        }
                    });
                }
                setData(result.alarms);
            });
    }

    return (
        <Card>
            <CardContent>
                <div className='row'>
                    <div className='col-xl-2 col-lg-2'>
                        <Form>
                            <Form.Group controlId='timefilter'>
                                <Form.Label>Time filter</Form.Label>
                                <Form.Control as='select' size='sm' name="timefilter" onChange={onChangeTimefilter}>
                                    {timefilterOptions.map((filter) => (
                                        <option value={filter.id} key={filter.id}>
                                            {filter.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <TableGrid
                    actions={[]}
                    title=''
                    columns={columns}
                    data={data}
                />
            </CardContent>
        </Card>
    );
}
