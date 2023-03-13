import { CardContent } from "@material-ui/core";
import React from "react";
import { Card } from "react-bootstrap";
import { injectIntl } from "react-intl";
import TableGridV2 from "../table-grid/TableGridV2";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";

function ThresholdGeofencesComponent(props) {
    const thresholdId = props.id;
    const history = useHistory();
    const columns = [
        {
            field: "label",
            title: "Label"
        },
        {
            field: "description",
            title: "Description"
        }
    ];

    const actions = [
        {
            icon: EditIcon,
            tooltip: "Edit Geofence",
            onClick: (_event, rowData) => {
                history.push(`/geofences/${rowData.id}/#edit`);
            }
        }
    ];
    return (
        <Card>
            <CardContent>
                <TableGridV2
                    actions={actions}
                    title=""
                    columns={columns}
                    endpoint={`/v2/thresholds/${thresholdId}/geofences`}
                    dataField="geofences"
                />
            </CardContent>
        </Card>
    );
}

export default injectIntl(ThresholdGeofencesComponent);
