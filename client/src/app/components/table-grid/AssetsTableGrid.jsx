import { Button } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import apiServiceV2 from '../../services/v2/apiServiceV2';
import { SelectableTableGrid } from './SelectableTableGrid';
import toaster from '../../utils/toaster';
import { IconButton } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function AssetTableToolbar(props) {
    const { selected: selectedAssets, triggerRefetch } = props;
    const [thesholdOptions, setThresholdOptions] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [selectedThreshold, setSelectedThreshold] = useState([])

    useEffect(() => {
        apiServiceV2.get("v2/thresholds")
            .then(response => {
                const thresholds = response.thresholds || []
                setThresholdOptions(thresholds)
            })
    }, [])

    const onChangeThreshold = (opt) => {
        setSelectedThreshold(opt)
    }

    const onSearchThreshold = (query) => {
        setLoading(true)
        apiServiceV2.getByLimitOffsetSearch("v2/thresholds", 50, 0, query).then((response) => {
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

    const onThresholdDekete = useCallback(() => {
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

                <Button style={{ margin: "0px 10px 10px 10px" }} onClick={onThresholdDekete} disabled={!selectedThreshold.length} variant='contained' color='error' startIcon={<DeleteIcon />} >Remove Threshold
                </Button>
            </>
        )
        }
    </Toolbar >
}


export const AssetTableGrid = ({ actions, columns }) => {
    return <SelectableTableGrid
        actions={actions}
        columns={columns}
        endpoint={'/v2/assets'}
        dataField='assets'
        toolbar={AssetTableToolbar}
    />

}

