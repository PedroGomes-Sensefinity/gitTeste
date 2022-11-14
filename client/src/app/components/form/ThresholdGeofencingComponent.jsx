import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import thresholdService from '../../services/thresholdService';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import Map from "../geo-fencing-map/map";
import TableGrid from '../table-grid/TableGrid';


const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function ThresholdGeofencingComponent(props) {
    const intl = props.intl
    const thresholdId = props.id
    const [threshold, setThreshold] = useState({})
    const [geofences, setGeofences] = useState([])
    const [blocking, setBlocking] = useState(false)
    const classes = useStyles();

    const initialValues = {
        id: thresholdId
    }

    useEffect(() => {
        apiService
            .getById('threshold', thresholdId)
            .then((response) => {
                const respThresholds = response.thresholds || []
                if (respThresholds.length > 0) {
                    const res = respThresholds[0];
                    const rule = JSON.parse(res.rule);

                    setThreshold(res)
                    if ("geofences" in rule) {
                        setGeofences(rule.geofences)
                    }
                }
            });
    }, []);

    const validationSchema = Yup.object().shape({});
    const save = (setSubmitting) => {
        let localThreshold = threshold;
        let rule = JSON.parse(localThreshold.rule)
        rule['geofences'] = geofences;
        localThreshold.rule = JSON.stringify(rule);
        setBlocking(true)
        thresholdService.update(localThreshold)
            .then((_response) => {
                toaster.notify('success', intl.formatMessage({ id: 'THRESHOLD.UPDATED' }));

            }).catch((err) => {
                toaster.notify('error', err.data.detail);
            })
            .finally(() => {
                setBlocking(false)
                setSubmitting(false);
            });
    };

    const getGeofenceIndexById = (id) => {
        geofences.forEach((elem, idx) => {
            if (elem.id === id)
                return idx
        })
        return -1
    };

    const onChangeShape = (shapes) => {
        setGeofences(shapes)
    };

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
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={({ setSubmitting }) => {
                    save(setSubmitting);
                }}
            >
                {({
                    isSubmitting,
                    handleSubmit
                }) => {
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
                                    {typeof id !== "undefined" &&
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
                                            <Map shapes={geofences} onChangeShape={onChangeShape} />
                                        </div>
                                        <div className={`col-xl-6 col-lg-6`}>
                                            <TableGrid
                                                title=''
                                                columns={columnsGeofences}
                                                data={geofences}
                                                style={{ height: 500 }}
                                                editable={{
                                                    onRowUpdate: (newData, oldData) =>
                                                        new Promise((resolve, reject) => {
                                                            setTimeout(() => {
                                                                const dataUpdate = [...geofences];
                                                                const index = getGeofenceIndexById(oldData.tableData.id);
                                                                dataUpdate[index] = newData;
                                                                onChangeShape(dataUpdate);
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


export default injectIntl(ThresholdGeofencingComponent);