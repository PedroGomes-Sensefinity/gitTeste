import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import apiServiceV2 from '../../services/apiServiceV2';
import sublocationService from "../../services/sublocationservice";
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import Map from "../geo-fencing-map/map";
import TableGrid from '../table-grid/TableGrid';
import {useSelector} from 'react-redux'
const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

function SubLocationFormComponent(props) {

    const id = props.id;
    const isAddMode = !id
    const classes = useStyles();
    const { permissions } = useSelector(({ auth }) => ({ permissions: auth.permissions }))
    const [blocking, setBlocking] = useState(false)
    const [geofences, setGeofences] = useState([])
    const [locationsOptions, setLocationsOptions] = useState([
        { id: 1, name: "No Location" },
    ])

    const [initialValues, setInitialValues] = useState({ id: '', name: '', port_code: '', location_id: 1 })

    useEffect(() => {
        //Get Locations Available
        apiServiceV2.get("v2/locations?limit=50").then((response) => {
            const respLocations = response.locations || []

            const options = respLocations.map((location) => {
                return { id: location.id, name: location. name }
            })
            setLocationsOptions(options)
            console.log(options)
        });

        //Edit Case
        if (typeof id !== 'undefined' && id !== 0) {
            //Get Geofence Data
            apiServiceV2.get("v2/sublocations/" + id).then((response) => {
                setInitialValues({ id: response.sublocation.id, name: response.sublocation.name, port_code: response.sublocation.port_code, location_id: response.sublocation.location_id })
                const geofencesArr = []
                if(response.sublocation.geofence !== undefined && response.sublocation.geofence !== "{}"){
                    geofencesArr.push(JSON.parse(response.sublocation.geofence))
                    setGeofences(geofencesArr)
                }
            });
        }
    }, []);

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

    const columnsGeofences = [
        {
            field: 'name',
            title: 'Shape'
        }
    ];


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        location_id: Yup.string().required('Location is required'),
    });

    const save = (fields, { setFieldValue, setSubmitting }) => {
        if (geofences.length === 0) {
            toaster.notify('error', "SubLocation needs 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        if (geofences.length  > 1) {
            toaster.notify('error', "SubLocation must only have 1 Shape!");
            setBlocking(false);
            setSubmitting(false);
            return
        }
        setBlocking(true);
        setSubmitting(true);
        const endpoint = isAddMode ? "save" : "update"
        console.log(endpoint)
        fields["geofence"] = JSON.stringify(geofences[0])
        if(fields["id"] === ""){
            fields["id"] = 0
        }else{
            fields["id"] = parseInt(fields["id"])
        }
        fields["location_id"] = parseInt(fields["location_id"])
        console.log(fields)
        sublocationService[endpoint](id,fields)
            .then((_response) => {
                toaster.notify('success', "Success SubLocations!");
                setSubmitting(false);
                setBlocking(false);

                if (isAddMode) {
                    setFieldValue('location_id', 1, false);
                    setFieldValue('name', '', false);
                    setFieldValue('id', '', false);
                    setGeofences([])
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
                                    SubLocation
                                </h3>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    Create or Edit SubLocations
                                </span>
                                <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                    <label className="required">&nbsp;</label> All fields marked with asterisks are required
                                </span>
                            </div>
                            <div className='card-toolbar'>
                                {permissions.canEditLocations && <button
                                    type='submit'
                                    className='btn btn-success mr-2'
                                    disabled={
                                        isSubmitting ||
                                        (touched && !isValid)
                                    }>
                                    <DoneIcon />
                                    Save Changes
                                    {isSubmitting}
                                </button>}
                                <Link
                                    to='/sublocations/list'
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
                                        <label className={`required`}>Name</label>
                                        <Field
                                            as="input"
                                            disabled={!permissions.canEditLocations}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'name'
                                            )}`}
                                            name='name'
                                            placeholder='Set the Location Name'
                                            {...getFieldProps('name')}
                                        />
                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                    </div>

                                    <div className='col-xl-6 col-lg-6'>
                                        <label>Port Code</label>
                                        <Field
                                            as="input"
                                            disabled={!permissions.canEditLocations}
                                            className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                { errors, touched },
                                                'port_code'
                                            )}`}
                                            name='port_code'
                                            placeholder='Set the Port Code'
                                            {...getFieldProps('port_code')}
                                        />
                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                    </div>
                                    </div>

                                    <div className='form-group row'>

                                        <div className='col-xl-6 col-lg-6'>
                                            <label className={`required`}>Location</label>
                                            <Field
                                                type={"number"}
                                                disabled={!permissions.canEditLocations}
                                                as="select"
                                                className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                    { errors, touched },
                                                    'location_id'
                                                )}`}
                                                name='location_id'
                                                placeholder=''
                                                {...getFieldProps('location_id')}
                                            >
                                                <option key='' value=''></option>
                                                {locationsOptions.map((e) => {
                                                    return (<option key={e.id} value={e.id}>{e.name}</option>);
                                                })}
                                            </Field>
                                            <ErrorMessage
                                                name='asset_type_id'
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
                                        <Map zoom={15} shapes={geofences} onChangeShape={onChangeShape} />
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

export default injectIntl(SubLocationFormComponent);
