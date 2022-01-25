import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/styles';
import thresholdService from '../../services/thresholdService';
import apiService from '../../services/apiService';

import DoneIcon from '@material-ui/icons/Done';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';
import Map from "../geo-fencing-map/map";
import TableGrid from '../table-grid/table-grid.component';

class ThresholdGeofencingComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            threshold: {},
            geofences: [],
            loading: false,
            blocking: false,
        };
    }

    componentDidMount() {

    }

    initialValues = {
        id: parseInt(this.props.id)
    };

    validationSchema = Yup.object().shape({});

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    save = (fields, { setSubmitting }) => {
        let threshold = this.state.threshold;
        let rule = JSON.parse(threshold.rule)
        rule['geofences'] = this.state.geofences;
        threshold.rule = JSON.stringify(rule);

        this.setState({blocking: true});

        thresholdService.update(threshold)
            .then((response) => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'THRESHOLD.UPDATED'}));

            }).catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    onChangeShape = (shapes) => {
        this.setState({ geofences: shapes });
    };

    render() {
        const columnsGeofences = [
            {
                field: 'name',
                title: 'Shape'
            }, {
                field: 'alert',
                title: 'Alert on',
                lookup: { 'in': 'In', 'out': 'Out' }
            }
        ];

        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm }) => {
                    this.save(values, {
                        setSubmitting
                    });
                }}
                >
                {({
                    isSubmitting,
                    handleSubmit
                }) => {
                    const classes = this.useStyles();

                    useEffect(() => {
                            apiService
                            .getById('threshold', this.state.id)
                            .then((response) => {
                                const res = response.thresholds[0];
                                const rule = JSON.parse(res.rule);

                                this.setState({threshold: res});

                                if("geofences" in rule) {
                                    this.setState({geofences: rule.geofences});
                                }
                            });
                    }, []);

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={
                                    `card-header py-3 ` +
                                    classes.headerMarginTop
                                }>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Geofences
                                    </h3>
                                    {typeof this.state.id !== "undefined" &&
                                        <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                            Define geofences
                                        </span>
                                    }
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                        disabled={isSubmitting}>
                                        <DoneIcon />
                                        Save Changes
                                        {isSubmitting}
                                    </button>
                                    <Link
                                        to='/thresholds/list'
                                        className='btn btn-secondary'>
                                        Back to list
                                    </Link>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className="form-group row">
                                        <div className={`col-xl-6 col-lg-6`}>
                                            <Map shapes={this.state.geofences} onChangeShape={this.onChangeShape} />
                                        </div>
                                        <div className={`col-xl-6 col-lg-6`}>
                                            <TableGrid
                                                title=''
                                                columns={columnsGeofences}
                                                data={this.state.geofences}
                                                style={{height: 500}}
                                                editable={{
                                                    onRowUpdate: (newData, oldData) =>
                                                        new Promise((resolve, reject) => {
                                                            setTimeout(() => {
                                                                const dataUpdate = [...this.state.geofences];
                                                                const index = oldData.tableData.id;
                                                                dataUpdate[index] = newData;
                                                                this.onChangeShape(dataUpdate);
                                                                resolve();
                                                            }, 1000)
                                                        })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}
                        </form>
                    );
                }}
            </Formik>
            </BlockUi>
        );
    }
}

export default injectIntl(ThresholdGeofencingComponent);