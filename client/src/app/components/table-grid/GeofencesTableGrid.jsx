import { Button, MenuItem, Select } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';
import apiServiceV2 from '../../services/v2/apiServiceV2';
import toaster from '../../utils/toaster';
import { SelectableTableGrid } from './SelectableTableGrid';

const alert_modes = ["None", "In", "In/Out"]

function GeofencesTableToolbar(props) {
    const { selected, triggerRefetch } = props;
    const [value, setValue] = useState(0)

    const onSelectChange = (e) => {
        setValue(e.target.value)
    }

    const bulkEditGeofences = useCallback(() => {
        const fields = {
            geofence_ids: selected.map(geofence => geofence.id),
            alert_mode: alert_modes[value]
        }

        console.log(fields)

        apiServiceV2.post("v2/operations/geofences-alarm-types", fields)
            .then(response => {
                console.log(response)
                const affected = response.affected
                toaster.notify('success', `Updated ${affected} geofences`);
                triggerRefetch()
            })

    }, [selected, value])

    return (
        <Toolbar>
            {selected.length > 0 && (
                <>
                    <Typography
                        style={{ margin: "0px 10px 10px 0px" }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {selected.length} selected
                    </Typography>

                    <Select style={{ margin: "0px 10px 10px 10px" }} value={value} onChange={onSelectChange}>
                        {alert_modes.map((value, idx) => (<MenuItem key={idx} value={idx}>{value}</MenuItem>))}
                    </Select>

                    <Button variant='contained' color='primary' style={{ margin: "0px 10px 10px 10px" }} onClick={bulkEditGeofences}>Save</Button>
                </>
            )
            }
        </Toolbar >
    );
}

export const GeofencesTableGrid = ({ actions, columns }) => {
    return <SelectableTableGrid
        actions={actions}
        columns={columns}
        endpoint={'/v2/geofences'}
        dataField='geofences'
        toolbar={GeofencesTableToolbar}
    />

}