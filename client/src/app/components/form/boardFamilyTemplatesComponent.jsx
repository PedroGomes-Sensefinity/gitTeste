import React from 'react';
import boardFamilyTemplatesService from '../../services/boardFamilyTemplatesService';
import BlockUi from "react-block-ui";
import {injectIntl} from 'react-intl';
import TableGrid from '../../components/table-grid/table-grid.component';
import {Card, CardContent} from "@material-ui/core";

class BoardFamilyTemplatesComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            templates: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        boardFamilyTemplatesService.byBoardFamily(this.state.id, 99999999, 0)
        .then((response) => {
            console.log(response);
            this.setState({templates: response.board_family_templates});
            this.setState({loading: false});
        });
    }

    render() {
        const columns = [
            {
                field: 'id',
                title: 'ID',
            },
            {
                field: 'Version',
                title: 'version',
            },        
        ];

        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
                <Card>
                    <CardContent>
                        <TableGrid
                            title=''
                            columns={columns}
                            data={this.state.templates}
                            isLoading={this.state.loading}
                        />
                    </CardContent>
                </Card>
            </BlockUi>
        );
    }
}

export default injectIntl(BoardFamilyTemplatesComponent);