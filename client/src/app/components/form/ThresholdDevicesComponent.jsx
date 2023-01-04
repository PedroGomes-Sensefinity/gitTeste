import { Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import TableGrid from '../table-grid/TableGrid';
import deviceThresholdService from '../../services/deviceThresholdService';
import { useOutletContext } from "react-router-dom";

function ThresholdDevicesComponent(props) {
    const { thresholdId, isLoading } = useOutletContext()
    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(isLoading)

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