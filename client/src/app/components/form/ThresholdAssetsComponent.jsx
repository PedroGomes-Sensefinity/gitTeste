import { CardContent } from "@material-ui/core";
import React from "react";
import { Card } from "react-bootstrap";
import { injectIntl } from 'react-intl';
import TableGridV2 from "../table-grid/TableGridV2";


function ThresholdAssetsComponent(props) {

    const thresholdId = props.id

    const columns = [
        {
            field: "label",
            title: "Label"
        }, {
            field: "asset_type.label",
            title: "Asset Type"
        },
    ];

    return (
        <Card>
            <CardContent>
                <TableGridV2
                    actions={[]}
                    title=''
                    columns={columns}
                    endpoint={`/v2/thresholds/${thresholdId}/assets`}
                    dataField='assets'
                />
            </CardContent>
        </Card>
    );
}

export default injectIntl(ThresholdAssetsComponent);