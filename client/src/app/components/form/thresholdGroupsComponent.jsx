import React from 'react';
import {makeStyles} from '@material-ui/styles';
import groupsThresholdService from '../../services/groupsThresholdService';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import TableGrid from '../../components/table-grid/table-grid.component';
import {Card, CardContent} from "@material-ui/core";

class ThresholdGroupsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            groups: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        groupsThresholdService.getByThreshold(this.state.id, 99999999, 0)
        .then((response) => {
            this.setState({groups: response.groups});
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
                field: 'label',
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
                            data={this.state.groups}
                        />
                    </CardContent>
                </Card>
            </BlockUi>
        );
    }
}

export default injectIntl(ThresholdGroupsComponent);