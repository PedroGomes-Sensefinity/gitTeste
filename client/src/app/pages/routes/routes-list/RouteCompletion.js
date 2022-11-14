import React, { useEffect } from 'react';

import { Card, CardContent } from '@material-ui/core';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import TableGrid from '../../../components/table-grid/TableGrid';

export function RouteCompletion() {
    const [timefilter, setTimefilter] = React.useState();

    let dateEnd = moment.utc();
    let dateStart = moment().subtract(1, "days").utc();

    const [date, setStatusDate] = React.useState({ start: dateStart.format('YYYY-MM-DDTHH:mm:00.00[Z]'), end: dateEnd.format('YYYY-MM-DDTHH:mm:00.00[Z]') });

    const [, setSelection] = React.useState("");


    const columns = [
        {
            field: 'Label',
            title: 'Label',
        },
        {
            field: 'Description',
            title: 'Description',
        },
        {
            field: 'Completion',
            title: 'Completion(%)',
        }
    ];

    const timefilterOptions = [
        {
            id: 'today',
            name: 'Last 24 Hours',
        },
        {
            id: 'last2days',
            name: 'Last 2 Days',
        },
        {
            id: 'lastweek',
            name: 'Last Week',
        },
        {
            id: 'last15days',
            name: 'Last 15 Days',
        },
        {
            id: 'lastmonth',
            name: 'Last Month',
        },
    ];

    const onChangeTimefilter = (event) => {
        let dateStart = '';
        let dateEnd = moment.utc();

        switch (event.target.value) {
            default:
                dateStart = moment().subtract(1, "days").utc();
                break;
            case 'today':
                dateStart = moment().subtract(1, "days").utc();
                break;
            case 'last2days':
                dateStart = moment().subtract(2, "days").utc();
                break;
            case 'lastweek':
                dateStart = moment().subtract(7, "days").utc();
                break;
            case 'last15days':
                dateStart = moment().subtract(15, "days").utc();
                break;
            case 'lastmonth':
                dateStart = moment().subtract(1, "months").utc();
                break;
        }
        setTimefilter(event.target.value);

        setStatusDate({
            start: dateStart.format('YYYY-MM-DDTHH:mm:00.00[Z]'),
            end: dateEnd.format('YYYY-MM-DDTHH:mm:00.00[Z]')
        })

    }

    useEffect(() => {
        setSelection("Find group");
    }, []);

    return (
        <Card>
            <CardContent key={date.start}>
                <div className='row'>
                    <div className='col-xl-2 col-lg-2'>
                        <Form>
                            <Form.Group controlId='timefilter'>
                                <Form.Label>Time filter</Form.Label>
                                <Form.Control as='select' size='sm' name="timefilter" onChange={onChangeTimefilter} value={timefilter}>
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
                    title=''
                    columns={columns}
                    endpoint={'route-completion'}
                    dataField='routecompletion'
                    date={date}
                />
            </CardContent>
        </Card>
    );
}
