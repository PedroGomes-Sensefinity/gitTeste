import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/styles';
import deviceThresholdService from '../../services/deviceThresholdService';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import TableGrid from '../../components/table-grid/table-grid.component';
import {Card, CardContent} from "@material-ui/core";

class ThresholdDevicesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            devices: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        deviceThresholdService.getByThreshold(this.state.id, 100, 0)
        .then((response) => {
            this.setState({devices: response.devices});
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
            },
            {
                field: 'group',
                title: 'Group',
            }
        ];

        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
                <Card>
                    <CardContent>
                        <TableGrid
                            title=''
                            columns={columns}
                            data={this.state.devices}
                        />
                    </CardContent>
                </Card>
            </BlockUi>
        );
    }
}

export default injectIntl(ThresholdDevicesComponent);