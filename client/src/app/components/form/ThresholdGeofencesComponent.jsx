import { CardContent, Button } from "@material-ui/core";
import React from "react";
import { Card } from "react-bootstrap";
import { injectIntl } from "react-intl";
import TableGridV2 from "../table-grid/TableGridV2";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    },
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    iconSmall: {
        fontSize: 20
    }
}));

function ThresholdGeofencesComponent(props) {
    const classes = useStyles();
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
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => {
                        history.push(`/geofences/new?threshold_id=${thresholdId}`);
                    }}
                >
                    <AddIcon className={classes.leftIcon} />
                    Add New Geofence
                </Button>
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
