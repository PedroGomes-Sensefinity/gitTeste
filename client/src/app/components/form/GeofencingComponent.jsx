import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import geofenceService from "../../services/geofenceservice";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import Map from "../geo-fencing-map/map";
import TableGrid from '../table-grid/TableGrid';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function GeofencingComponent(props) {
    const id = props.id;
    const isAddMode = !id
    const classes = useStyles();
    const [blocking, setBlocking] = useState(false)
    const [geofences, setGeofences] = useState([])
    const [thresholds, setThresholds] = useState([])
    const [selectedThresholds, setSelectedThresholds] = useState([])
    const selectedThresholdsId = selectedThresholds.map(t => t.id)
    const [loading, setLoading] = useState(false)

    const [initialValues, setInitialValues] = useState({ id: '', label: '', description: '', alert_mode: '1', })

    useEffect(() => {
        //Edit Case
        if (typeof id !== 'undefined' && id !== 0) {
            //Get Geofence Data
            apiService.getById("geofence", id).then((response) => {
                const geofence = response.geofence
                switch (geofence.alert_mode) {
                    case "None":
                        geofence.alert_mode = "1"
                        break;
                    case "In":
                        geofence.alert_mode = "2"
                        break;
                    case "Out":
                        geofence.alert_mode = "3"
                        break;
                    case "In/Out":
                        geofence.alert_mode = "4"
                        break;
                }
                setInitialValues({ id: geofence.id, label: geofence.label, description: geofence.description, alert_mode: geofence.alert_mode })
                const shapes = JSON.parse(geofence.metadata)
                const geofencesArr = []
                // Shapes Data
                Object.keys(shapes).forEach((key) => {
                    geofencesArr.push(JSON.parse(shapes[key]))
                })
                setGeofences(geofencesArr)
                // Add threshold to Geofence Data
                const endpoint = "geofence/" + id + "/thresholds"
                apiService.getByEndpoint(endpoint).then((response) => {
                    setSelectedThresholds(response.thresholds)
                    const ids = selectedThresholdsId
                    const respThresholds = response.thresholds || []
                    respThresholds.forEach((threshold) => {
                        ids.push(threshold.id)
                    })
                });
            });
        }
    }, []);

    const options = [
        { id: 1, name: "None" },
        { id: 2, name: "In" },
        { id: 3, name: "Out" },
        { id: 4, name: "In/Out" },
    ]

    const getGeofenceIndexById = useCallback((id) => {
        for (let i = 0; i < geofences.length; i++) {
            if (geofences[i].id === id) {
                return i;
            }
        }
        return -1;
    }, [geofences])

    const onChangeShape = (shapes) => {
        setGeofences(shapes)
    };

    const filterBy = () => true;

    const onChangeThreshold = (opt) => {
        setSelectedThresholds(opt)
    };

    const handleSearchThreshold = (query) => {
        setLoading(true)

        apiService.getByText('threshold', query, 100, 0).then((response) => {
            const respThresholds = response.thresholds || []
            setThresholds(filterThresholdSelected(respThresholds))
            setLoading(false)
        });
    };

    const filterThresholdSelected = (options) => options
        .filter(t => selectedThresholdsId.includes(t.id))
        .map(t => {
            return {
                id: t.id,
                label: t.name
            }
        })

    const columnsGeofences = [
        {
            field: 'name',
            title: 'Shape'
        }
    ];


    const validationSchema = Yup.object().shape({
        label: Yup.string().required('Label is required'),
        alert_mode: Yup.string().required('AlertMode is required'),
    });

    const save = (fields, { setFieldValue, setSubmitting }) => {
        if (geofences.length === 0) {
            toaster.notify('error', "Geofence needs at least 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        setBlocking(true);
        setSubmitting(true);
        switch (fields["alert_mode"]) {
            case "1":
                fields["alert_mode"] = "None"
                break;
            case "2":
                fields["alert_mode"] = "In"
                break;
            case "3":
                fields["alert_mode"] = "Out"
                break;
            case "4":
                fields["alert_mode"] = "In/Out"
                break;
        }
        const data = {}
        for (let i = 0; i < geofences.length; i++) {
            data[i] = (JSON.stringify(geofences[i]))
        }
        fields["metadata"] = JSON.stringify(data)
        fields["thresholdsIds"] = selectedThresholdsId
        const endpoint = isAddMode ? "save" : "update"
        console.log(endpoint)
        geofenceService[endpoint](fields)
            .then((_response) => {
                toaster.notify('success', "Success Geofences!");
                setSubmitting(false);
                setBlocking(false);

                switch (fields["alert_mode"]) {
                    case "None":
                        fields["alert_mode"] = "1"
                        break;
                    case "In":
                        fields["alert_mode"] = "2"
                        break;
                    case "Out":
                        fields["alert_mode"] = "3"
                        break;
                    case "In/Out":
                        fields["alert_mode"] = "4"
                        break;
                }
                setFieldValue('alert_mode', fields["alert_mode"], false);

                if (isAddMode) {
                    setFieldValue('label', '', false);
                    setFieldValue('description', '', false);
                    setFieldValue('alert_mode', '1', false);
                    setGeofences([])
                    setThresholds([])
                    setSelectedThresholds([])
                }
                setBlocking(false);
                setSubmitting(false);
            });
    };

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setFieldValue, setSubmitting, resetForm }) => {
                    save(values, {
                        setFieldValue,
                        setSubmitting,
                        resetForm,
                    });
                }}
            >
                {({
                    isValid,
                    getFieldProps,
                    errors,
                    touched,
                    isSubmitting,
                    handleSubmit,
                }) => <form
                    className='card card-custom'
                    onSubmit={handleSubmit}>
                        {/* begin::Header */}
                        <div
                            className={`card-header py-3 ` + classes.headerMarginTop}>
                            <div className='card-title align-items-start flex-column'>
                                <h3 className='card-label font-weight-bolder text-dark'>
                                    Geofences
                                </h3>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    Create or Edit Geofences
                                </span>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    <label className="required">&nbsp;</label> All fields marked with asterisks are required
                                </span>
                            </div>
                            <div className='card-toolbar'>
                                <button
                                    type='submit'
                                    className='btn btn-success mr-2'
                                    disabled={
                                        isSubmitting ||
                                        (touched && !isValid)
                                    }>
                                    <DoneIcon />
                                    Save Changes
                                    {isSubmitting}
                                </button>
                                <Link
                                    to='/geofences/list'
                                    className='btn btn-secondary'>
                                    Back to list
                                </Link>
                            </div>
                        </div>
                        {/* end::Header */}

                        {/* begin::Form */}
                        <div className='form'>
                            <div className='card-body'>
                                <div className='form-group row'>

                                    <div className='col-xl-6 col-lg-6'>
                                        <label className={`required`}>Label</label>
                                        <Field
                                            as="input"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'label'
                                            )}`}
                                            name='name'
                                            placeholder='Set the Geofence label'
                                            {...getFieldProps('label')}
                                        />
                                        <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                    </div>


                                    <div className='col-xl-6 col-lg-6'>
                                        <label>Threshold</label>
                                        <div>
                                            <AsyncTypeahead
                                                id='typeahead-threshold'
                                                labelKey='label'
                                                size="lg"
                                                multiple
                                                onChange={onChangeThreshold}
                                                options={thresholds}
                                                placeholder=''
                                                selected={selectedThresholds}
                                                onSearch={handleSearchThreshold}
                                                isLoading={loading}
                                                filterBy={filterBy}
                                                useCache={false}
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className='form-group row'>
                                    <div className='col-xl-6 col-lg-6'>
                                        <label>Description</label>
                                        <Field
                                            as="textarea"
                                            rows='1'
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'description'
                                            )}`}
                                            name='description'
                                            placeholder='Set the description'
                                            {...getFieldProps(
                                                'description'
                                            )}
                                        />
                                    </div>

                                    <div className='col-xl-6 col-lg-6'>
                                        <label className={`required`}>Alert Mode</label>
                                        <Field
                                            type={"number"}
                                            as="select"
                                            default="1"
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'alert_mode'
                                            )}`}
                                            name='alert_mode'
                                            placeholder=''
                                            {...getFieldProps('alert_mode')}
                                        >
                                            {options.map((e) => {
                                                return (<option key={e.id} value={e.id}>{e.name}</option>);
                                            })}
                                        </Field>
                                        <ErrorMessage
                                            name='alert_mode'
                                            component='div'
                                            className='invalid-feedback'
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* end::Form */}
                        {/* begin::Form */}
                        <div className='form'>
                            <div className='card-body'>
                                <div className="form-group row">
                                    {/*begin:: Map */}
                                    <div className={`col-xl-6 col-lg-6`}>
                                        <Map shapes={geofences} onChangeShape={onChangeShape} />
                                    </div>
                                    <div className={`col-xl-6 col-lg-6  `}>
                                        <TableGrid
                                            title=''
                                            columns={columnsGeofences}
                                            data={geofences}
                                            style={{ height: 500 }}
                                            editable={{
                                                onRowUpdate: (newData, oldData) =>
                                                    new Promise((resolve, _reject) => {
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
                }
            </Formik>
        </BlockUi>
    );
}

export default injectIntl(GeofencingComponent);
