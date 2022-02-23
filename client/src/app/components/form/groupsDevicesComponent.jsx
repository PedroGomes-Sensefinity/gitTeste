import React from 'react';
import {makeStyles} from '@material-ui/styles';
import groupsDevicesService from '../../services/groupsDevicesService';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import TableGrid from '../../components/table-grid/table-grid.component';
import {Card, CardContent} from "@material-ui/core";

class GroupsDevicesComponent extends React.Component {
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
        this.setState({loading: true});
        groupsDevicesService.getByThreshold(this.state.id, 99999999, 0)
        .then((response) => {
            this.setState({devices: response.devices});
            this.setState({loading: false});
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
                        <TableGrid
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

export default injectIntl(GroupsDevicesComponent);