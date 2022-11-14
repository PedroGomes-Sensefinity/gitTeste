import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import Table from 'react-bootstrap/Table';
import { injectIntl } from 'react-intl';
import NumberFormat from 'react-number-format';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import floorMapService from '../../services/floorMapService';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));
function FloorMapAnchorsFormComponent(props) {
    const intl = props.intl
    const floorMapId = props.id
    const isAddMode = !props.id
    const [floormap, setFloorMap] = useState({})
    const [listAnchors, setListAnchors] = useState([])
    const [blocking, setBlocking] = useState(false)
    const classes = useStyles()



    useEffect(() => {
        if (!isAddMode && floorMapId !== 'new') {
            apiService
                .getById('floormaps', floorMapId)
                .then((response) => {
                    const respFloorMap = response.floormaps || []
                    if (respFloorMap.length > 0) {
                        const res = response.floormaps[0];
                        init(res);
                        setFloorMap(res)
                    }
                });
        }
    }, []);

    const initialValues = {
        label: '',
        description: '',
        x: '',
        y: '',
        z: '',
    };

    const validationSchema = Yup.object().shape({
        label: Yup.string().max(50).required('Label is required'),
        description: Yup.string().max(100),
        x: Yup.number().required('X is required'),
        y: Yup.number().required('Y is required'),
        z: Yup.number().required('Z is required'),
    });

    const save = () => {
        setBlocking(true)
        let metadata = JSON.parse(floormap.metadata);
        metadata.anchors = listAnchors;
        floormap.metadata = JSON.stringify(metadata);

        floorMapService.update(floormap)
            .then((_r) => {
                toaster.notify('success', intl.formatMessage({ id: 'FLOORMAP.UPDATED' }));
                setBlocking(false)
            });
    };

    const init = (floormap) => {
        const metadata = JSON.parse(floormap.metadata);

        if ('anchors' in metadata) {
            setListAnchors(metadata.anchors)
        }
    }

    const addAnchor = (values) => {
        // deep copy 
        const anchors = listAnchors.map(anchor => { return { ...anchor } });
        const coordinates = getCoordinatesFromXYZ(values);
        const newAnchor = {
            label: values.label,
            description: values.description,
            x: parseFloat(values.x),
            y: parseFloat(values.y),
            z: parseFloat(values.z),
            lat: coordinates.lat,
            lon: coordinates.lon,
        };
        anchors.push(newAnchor);
        setListAnchors(anchors)
    };

    const updateAnchor = (values) => {
        const index = values.index;
        const coordinates = getCoordinatesFromXYZ(values);

        // deep clone array
        const funcLocalAnchors = listAnchors.map(anchor => { return { ...anchor } });
        const anchor = funcLocalAnchors[index];

        anchor.label = values.label;
        anchor.description = values.description;
        anchor.x = parseFloat(values.x);
        anchor.y = parseFloat(values.y);
        anchor.z = parseFloat(values.z);
        anchor.lat = coordinates.lat;
        anchor.lon = coordinates.lon;

        funcLocalAnchors[index] = anchor
        setListAnchors(funcLocalAnchors)
    };

    const fillAnchor = (index, { setFieldValue }) => {
        const anchor = listAnchors[index]
        if (typeof anchor !== "undefined") {
            setFieldValue('label', anchor.label, false);
            setFieldValue('description', anchor.description, false);
            setFieldValue('x', anchor.x, false);
            setFieldValue('y', anchor.y, false);
            setFieldValue('z', anchor.z, false);
            setFieldValue('index', index, false);
        }
    }

    const deleteAnchor = (index) => {
        const anchors = listAnchors.map(anchor => { return { ...anchor } });
        if (typeof anchors[index] !== "undefined") {
            anchors.splice(index, 1);
            setListAnchors(anchors)
        }
    }

    const getCoordinatesFromXYZ = (_values) => {
        return {
            lat: 38.7744549,
            lon: -9.3319229
        }
    }

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    if ('index' in values) {
                        updateAnchor(values)
                    } else {
                        addAnchor(values);
                    }
                    resetForm(initialValues);
                }}
            >
                {({
                    isValid,
                    getFieldProps,
                    errors,
                    touched,
                    handleSubmit,
                    setFieldValue,
                    values,
                    resetForm
                }) => {
                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 ` + classes.headerMarginTop}>
                                <div className='card-title align-items-start flex-column'>
                                    <h3 className='card-label font-weight-bolder text-dark'>
                                        Anchors
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Parameterization of anchors
                                    </span>
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='button'
                                        className='btn btn-success mr-2'
                                        onClick={() => save()}
                                    >
                                        <DoneIcon /> Save
                                    </button>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className='form-group row'>
                                        <div className='col-xl-2 col-lg-2'>
                                            <label className={`required`}>Label</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        'label'
                                                    )}`}
                                                    name='label'
                                                    placeholder='Anchor label'
                                                    {...getFieldProps('label')}
                                                />
                                                <ErrorMessage name="label" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className='col-xl-2 col-lg-2'>
                                            <label>Description</label>
                                            <div>
                                                <Field
                                                    as="input"
                                                    className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                        { errors, touched },
                                                        'description'
                                                    )}`}
                                                    name='description'
                                                    placeholder=''
                                                    {...getFieldProps('description')}
                                                />
                                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className='col-xl-2 col-lg-2'>
                                            <label className={`required`}>X</label>
                                            <NumberFormat
                                                name='x'
                                                className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                    { errors, touched }, 'x')}`}
                                                thousandSeparator={false}
                                                inputMode="numeric"
                                                allowLeadingZeros={true}
                                                placeholder={'ddd.mmm'}
                                                decimalScale={3}
                                                {...getFieldProps('x')}
                                            />
                                            <ErrorMessage name="x" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-2 col-lg-2'>
                                            <label className={`required`}>Y</label>
                                            <NumberFormat
                                                name="y"
                                                className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                    { errors, touched }, 'y')}`}
                                                thousandSeparator={false}
                                                inputMode="numeric"
                                                allowLeadingZeros={true}
                                                decimalScale={3}
                                                placeholder={'ddd.mmm'}
                                                {...getFieldProps('y')}
                                            />
                                            <ErrorMessage name="y" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-2 col-lg-2'>
                                            <label className={`required`}>Z</label>
                                            <NumberFormat
                                                name="z"
                                                className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                    { errors, touched }, 'z')}`}
                                                thousandSeparator={false}
                                                inputMode="numeric"
                                                placeholder={'ddd.mmm'}
                                                allowLeadingZeros={true}
                                                decimalScale={3}
                                                {...getFieldProps('z')}
                                            />
                                            <ErrorMessage name="z" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className='col-xl-2 col-lg-2'>
                                            <button
                                                type='submit'
                                                className='btn btn-sm btn-success mr-2 mt-8'
                                                disabled={touched && !isValid}>
                                                {values.index === undefined && <span><AddIcon /> Add</span>}
                                                {values.index !== undefined && <span><DoneIcon /> Save</span>}
                                            </button>
                                            {values.index !== undefined && <button
                                                type='button'
                                                className='btn btn-sm btn-warning mr-2 mt-8'
                                                onClick={() => resetForm(initialValues)}
                                            >
                                                <DeleteIcon /> Cancel
                                            </button>}
                                        </div>
                                        <div className="col-xs-12 col-lg-12">
                                            {listAnchors.length > 0 &&
                                                <Table responsive>
                                                    <thead>
                                                        <tr>
                                                            <th />
                                                            <th>Anchor Label</th>
                                                            <th>Description</th>
                                                            <th>X</th>
                                                            <th>Y</th>
                                                            <th>Z</th>
                                                            <th>Coordinates</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listAnchors.map((value, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <button
                                                                        type='button'
                                                                        className='btn btn-sm btn-success'
                                                                        onClick={() => fillAnchor(index, { setFieldValue })}
                                                                    >
                                                                        <EditIcon /> Edit
                                                                    </button>
                                                                    <button
                                                                        type='button'
                                                                        className='btn btn-sm btn-danger ml-1'
                                                                        onClick={() => deleteAnchor(index)}
                                                                    >
                                                                        <DeleteIcon /> Delete
                                                                    </button>
                                                                </td>
                                                                <td>{value.label}</td>
                                                                <td>{value.description}</td>
                                                                <td>{value.x}</td>
                                                                <td>{value.y}</td>
                                                                <td>{value.z}</td>
                                                                <td>
                                                                    Lat: {value.lat}<br />
                                                                    Lon: {value.lon}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* end::Form */}
                        </form>
                    );
                }}
            </Formik>
        </BlockUi>)
}


export default injectIntl(FloorMapAnchorsFormComponent);