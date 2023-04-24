import { Button, Checkbox, FormControlLabel } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import apiServiceV2 from '../../services/v2/apiServiceV2';
import { SelectableTableGrid } from './SelectableTableGrid';
import toaster from '../../utils/toaster';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function AssetTableToolbar(props) {
    const { selected: selectedAssets, triggerRefetch, tenantID } = props;
    const [thesholdOptions, setThresholdOptions] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [selectedThreshold, setSelectedThreshold] = useState([])

    useEffect(() => {
        apiServiceV2.get(`v2/thresholds?tenant_id=${tenantID}`)
            .then(response => {
                const thresholds = response.thresholds || []

                setThresholdOptions(thresholds)
            })
    }, [tenantID])

    const onChangeThreshold = (opt) => {
        setSelectedThreshold(opt)
    }

    const onSearchThreshold = (query) => {
        setLoading(true)
        let promise = tenantID === 0 ?
            apiServiceV2.getByLimitOffsetSearch("v2/thresholds", 50, 0, query)
            : apiServiceV2.getByLimitOffsetSearchTenant("v2/thresholds", 50, 0, query, tenantID)

        promise.then((response) => {
            const thresholds = response.thresholds || []
            setThresholdOptions(thresholds)
            setLoading(false)
        });
    }

    const onAddThreshold = useCallback(() => {
        const body = {
            asset_ids: selectedAssets.map((asset => asset.id))
        }
        apiServiceV2.post(`v2/operations/thresholds/${selectedThreshold[0].id}/assets`, body)
            .then(() => {
                toaster.notify('success', `Threshold added to assets`);
                triggerRefetch()
            }).catch(() => { });

    }, [selectedThreshold, selectedAssets])

    const onThresholdDelete = useCallback(() => {
        const body = {
            asset_ids: selectedAssets.map((asset => asset.id))
        }
        apiServiceV2.delete(`v2/operations/thresholds/${selectedThreshold[0].id}/assets`, body)
            .then(() => {
                toaster.notify('success', `Threshold removed from assets`);
                triggerRefetch()
            }).catch(() => { });

    }, [selectedThreshold, selectedAssets])

    return <Toolbar>
        {selectedAssets.length > 0 && (
            <>
                <Typography
                    style={{ margin: "0px 10px 10px 0px" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {selectedAssets.length} selected
                </Typography>

                <AsyncTypeahead style={{ margin: "0px 10px 10px 10px" }}
                    id='threshold-action'
                    labelKey='label'
                    isLoading={isLoading}
                    disabled={tenantID === 0}
                    size="lg"
                    clearButton={true}
                    placeholder='Search Thresholds...'
                    selected={selectedThreshold}
                    onSearch={onSearchThreshold}
                    onChange={onChangeThreshold}
                    options={thesholdOptions}
                    useCache={false}
                />

                <Button style={{ margin: "0px 10px 10px 10px" }} onClick={onAddThreshold} disabled={!selectedThreshold.length} variant='contained' color='primary' startIcon={<AddIcon />}>
                    Add Threshold
                </Button>

                <Button style={{ margin: "0px 10px 10px 10px" }} onClick={onThresholdDelete} disabled={!selectedThreshold.length} variant='contained' color='error' startIcon={<DeleteIcon />} >Remove Threshold
                </Button>
            </>
        )
        }
    </Toolbar >
}


export const AssetTableGrid = ({ actions, columns }) => {
    const [filters, setFilters] = useState("")

    return <>

        <FormControlLabel
            control={<Checkbox onChange={(e) => { (e.target.checked ? setFilters("&device=true") : setFilters("&device=false")) }} />}
            label="Filter By Assets Tracked (Assets with Device)"
        />
        <SelectableTableGrid
            actions={actions}
            columns={columns}
            filters={filters}
            endpoint={"/v2/assets"}
            dataField='assets'
            toolbar={AssetTableToolbar} />
    </>


}

