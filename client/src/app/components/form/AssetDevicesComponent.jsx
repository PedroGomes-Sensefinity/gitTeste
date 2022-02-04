import React from 'react';
import {makeStyles} from '@material-ui/styles';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import TableGrid from '../../components/table-grid/table-grid.component';
import {Card, CardContent} from "@material-ui/core";
import apiService from "../../services/apiService";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import DoneIcon from "@material-ui/icons/Done";
import DeleteIcon from '@material-ui/icons/Clear';
import deviceService from "../../services/deviceService";
import assetsService from "../../services/assetsService";
import toaster from '../../utils/toaster';

class AssetDevicesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            asset: {},
            devices: [],
            devicesSearch: [],
            selectedDevicesId: [],
            selectedDevices: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        this.initGridDevices();
    }

    initGridDevices = () => {
        this.setState({loading: true});
        apiService.getById('asset', this.state.id).then((response) => {
            this.setState({asset: response.assets[0]});
            this.setState({devices: response.assets[0].devices});
            this.setState({loading: false});
        });
    }

    filterDevicesSelected = (options) => {
        let data = [];
        options.map((t) => {
            if(!this.state.selectedDevicesId.includes(t.id)) {
                data.push({
                    id: t.id,
                    label: `${t.id} - ${t.label}`
                });
            }
        });
        return data;
    }

    handleSearchDevice = (query) => {
        this.setState({loading: true});

        deviceService.getToAsset(query, 100, 0).then((response) => {
            this.setState({ devicesSearch: [] });

            if (typeof response.devices !== undefined && Array.isArray(response.devices)) {
                this.setState({ devicesSearch: this.filterDevicesSelected(response.devices) });
            }

            this.setState({ loading: false });
        });
    };

    onChangeDevice = (opt) => {
        let selectedDevicesId = [];

        if (opt.length > 0) {
            selectedDevicesId = opt.map((t) => t.id);
        }

        this.setState({ selectedDevicesId: selectedDevicesId});
        this.setState({ selectedDevices: opt});
    };

    filterBy = () => true;

    addDevices = () => {
        let devices = this.state.selectedDevicesId.map((t) => {
            return {id: t}
        });

        this.setState({ loading: true });

        assetsService.addAssetDevice(this.state.asset.id, {devices: devices}).then((response) => {
            this.initGridDevices();
            this.setState({selectedDevicesId: []});
            this.setState({selectedDevices: []});
            this.setState({ loading: false });
            toaster.notify('success', this.state.intl.formatMessage({id: 'ASSET_DEVICE.INCLUDED'}));
        });
    }

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    render() {
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
            <BlockUi tag='div' blocking={this.state.blocking}>
                <Card>
                    <CardContent>
                        <div className='form-group row'>
                            <div className='col-xl-6 col-lg-6'>
                                <label>Devices</label>
                                <AsyncTypeahead
                                    id='typeahead-devices'
                                    labelKey='label'
                                    size="lg"
                                    multiple
                                    onChange={this.onChangeDevice}
                                    options={this.state.devicesSearch}
                                    placeholder=''
                                    onSearch={this.handleSearchDevice}
                                    selected={this.state.selectedDevices}
                                    isLoading={this.state.loading}
                                    filterBy={this.filterBy}
                                    useCache={false}
                                />
                            </div>
                            <div className='col-xl-6 col-lg-6'>
                                <button
                                    type='button'
                                    className='btn btn-success mr-2 mt-8'
                                    onClick={this.addDevices}
                                    disabled={this.state.selectedDevicesId.length === 0}
                                >
                                    <DoneIcon/>
                                    Add devices
                                </button>
                            </div>
                        </div>
                        <TableGrid
                            actions={[
                                {
                                    icon: DeleteIcon,
                                    tooltip: 'Remove device from asset',
                                    onClick: (event, rowData) => {
                                        let devices = [{id: rowData.id}];
                                        assetsService.deleteAssetDevice({devices: devices}).then((response) => {
                                            this.initGridDevices();
                                            this.setState({selectedDevicesId: []});
                                            this.setState({selectedDevices: []});
                                            this.setState({loading: false});
                                            toaster.notify('success', this.state.intl.formatMessage({id: 'ASSET_DEVICE.REMOVED'}));
                                        });
                                    },
                                },
                            ]}
                            title=''
                            columns={columns}
                            data={this.state.devices}
                            isLoading={this.state.loading}
                        />
                    </CardContent>
                </Card>
            </BlockUi>
        );
    }
}

export default injectIntl(AssetDevicesComponent);