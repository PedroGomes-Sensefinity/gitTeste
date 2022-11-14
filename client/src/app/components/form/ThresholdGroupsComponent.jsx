import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import groupsThresholdService from '../../services/groupsThresholdService';
import TableGrid from '../table-grid/TableGrid';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function ThresholdGroupsComponent(props) {
    const thresholdId = props.id
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        groupsThresholdService.getByThreshold(thresholdId, 99999999, 0)
            .then((response) => {
                setGroups(response.groups || [])
                setLoading(false)
            });
    }, [])

    const columns = [
        {
            field: 'label',
            title: 'Group',
        }
    ];

    return (
        <Card>
            <CardContent>
                <TableGrid
                    title=''
                    columns={columns}
                    data={groups}
                    isLoading={loading}
                />
            </CardContent>
        </Card>
    );

}

export default injectIntl(ThresholdGroupsComponent);