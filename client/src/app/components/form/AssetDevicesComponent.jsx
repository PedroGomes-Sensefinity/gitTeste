import { Card, CardContent } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Clear';
import DoneIcon from "@material-ui/icons/Done";
import React, { useState, useEffect } from 'react';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { injectIntl } from 'react-intl';
import TableGrid from '../../components/table-grid/TableGrid';
import apiService from "../../services/apiService";
import deviceService from "../../services/deviceService";
import AlertDialog from "../../utils/AlertDialog/alertDialog";
import toaster from '../../utils/toaster';
import assetsServiceV2 from "../../services/v2/assetsServiceV2";


function AssetDevicesComponent({ intl, id: assetId, asset, onAssetChange }) {
    const [loading, setLoading] = useState(false)
    const [devices, setDevices] = useState([])
    const [devicesSearch, setDevicesSearch] = useState([])
    const [selectedDevices, setSelectedDevices] = useState([])
    const selectedDevicesId = selectedDevices.map(device => device.id)

    useEffect(() => {
        if (asset.devices_ids !== undefined) {
            asset.devices_ids.forEach(id=>{
                apiService.getById("device", id).then(response =>{
                    const newDevices = devices
                    newDevices.push(response.devices[0])
                    setDevices([...newDevices])
                })
            })
        }
    },[]);

    const filterDevicesSelected = (options) => options
        .filter(t => !selectedDevicesId.includes(t.id))
        .map((t) => {
            return {
                id: t.id,
                label: `${t.id} - ${t.label}`
            }
        });


    const handleSearchDevice = (query) => {
        setLoading(true);
        deviceService.getToAsset(query, 100, 0).then((response) => {
            const respDevices = response.devices || []
            setDevicesSearch(filterDevicesSelected(respDevices))
            setLoading(false)
        });
    };

    const onChangeDevice = (opt) => {
        setSelectedDevices(opt)
    };

    const filterBy = () => true;

    const addDevices = () => {
        let devices = selectedDevices.map((t) => {
            return { id: t.id }
        })
        const id = devices[0].id
        setLoading(true)
        assetsServiceV2.addDeviceToAsset(id, asset.id).then((response) =>{
            setSelectedDevices([])
            toaster.notify('success', intl.formatMessage({ id: 'ASSET_DEVICE.INCLUDED' }));
            onAssetChange()
            setLoading(false)
        })
    }
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
                <div className='form-group row'>
                    <div className='col-xl-6 col-lg-6'>
                        <label>Devices</label>
                        <AsyncTypeahead
                            id='typeahead-devices'
                            labelKey='label'
                            size="lg"
                            onChange={onChangeDevice}
                            options={devicesSearch}
                            placeholder=''
                            onSearch={handleSearchDevice}
                            selected={selectedDevices}
                            isLoading={loading}
                            filterBy={filterBy}
                            useCache={false}
                        />
                    </div>
                    <div className='col-xl-6 col-lg-6' >
                        {devices?.length === 0 && <button
                            type='button'
                            className='btn btn-success mr-2 mt-8'
                            onClick={addDevices}
                            disabled={selectedDevicesId.length === 0}
                        >
                            <DoneIcon />
                            Add device
                        </button>}
                        {devices?.length !== 0 && <AlertDialog len={devices.length} buttonTitle="Add device" title="Warning - Device on Asset" content="Are you sure you want to add more than one Device to an Asset?" onYes={addDevices}></AlertDialog>}
                    </div>
                </div>
                <TableGrid
                    actions={[
                        {
                            icon: DeleteIcon,
                            tooltip: 'Remove device from asset',
                            onClick: (_event, rowData) => {
                                assetsServiceV2.deleteDeviceToAsset(rowData.id, asset.id).then(() => {
                                    setDevices(deviceList => deviceList.filter(dev => dev.id !== rowData.id))
                                    setLoading(false)
                                    toaster.notify('success', intl.formatMessage({ id: 'ASSET_DEVICE.REMOVED' }));
                                    onAssetChange()
                                });
                            },
                        },
                    ]}
                    title=''
                    columns={columns}
                    data={devices}
                    isLoading={loading}
                />
            </CardContent>
        </Card>
    );
}

export default injectIntl(AssetDevicesComponent);