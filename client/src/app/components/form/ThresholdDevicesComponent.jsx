import { Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import TableGrid from '../table-grid/TableGrid';
import deviceThresholdService from '../../services/deviceThresholdService';

function ThresholdDevicesComponent(props) {
    const thresholdId = props.id
    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        deviceThresholdService.getByThreshold(thresholdId, 99999999, 0)
            .then((response) => {
                const respDevices = response.devices || []
                setDevices(respDevices)
                setLoading(false)
            });
    }, [])

    const columns = [
        {
            field: 'id',
            title: 'Serial Number',
        },
        {
            field: 'parent_id',
            title: 'Parent',
        },
        {
            field: 'label',
            title: 'Label',
        }
    ];


    return (
        <Card>
            <CardContent>
                <TableGrid
                    title=''
                    columns={columns}
                    data={devices}
                    isLoading={loading} />
            </CardContent>
        </Card>
    )
}

export default injectIntl(ThresholdDevicesComponent);