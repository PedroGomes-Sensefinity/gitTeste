import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import { ErrorMessage, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import BlockUi from "react-block-ui";
import { injectIntl } from 'react-intl';
import * as Yup from 'yup';
import apiService from '../../services/apiService';
import floorMapService from '../../services/floorMapService';
import { getInputClasses } from '../../utils/formik';
import toaster from '../../utils/toaster';
import '../../utils/yup-validations';
import IndoorMap from "../indoor-map/indoorMap";
import NumberFormat from "react-number-format";

const useStyles = makeStyles((theme) => ({
    headerMarginTop: {
        marginTop: theme.spacing(5),
    }
}));

const FILE_SIZE = 2; // MB
const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/svg",
    "image/png"
];

function FloorMapMapFormComponent(props) {
    const intl = props.intl
    const floorMapId = props.id
    const isAddMode = !props.id
    const [floorMapInfo, setFloorMap] = useState({})
    const attachment = floorMapInfo.attachment || {}
    const metadata = JSON.parse(floorMapInfo.metadata || '{}')
    const plant = metadata.plant || {}
    const anchors = metadata.anchors || []


    const [blocking, setBlocking] = useState(false)
    const classes = useStyles()

    useEffect(() => {
        if (!isAddMode && floorMapId !== 'new') {
            setBlocking(true);
            apiService
                .getById('floormaps', floorMapId)
                .then((response) => {
                    const respFloorMap = response.floormaps || []
                    if (respFloorMap.length > 0) {
                        const res = respFloorMap[0];
                        setFloorMap(res)
                        setBlocking(false);
                    }
                });
        }
    }, []);

    const initialValues = {
        topleft_lat: plant.topleft_lat || '',
        topleft_lon: plant.topleft_lon || '',
        topright_lat: plant.topright_lat || '',
        topright_lon: plant.topright_lon || '',
        bottomleft_lat: plant.bottomleft_lat || '',
        bottomleft_lon: plant.bottomleft_lon || '',
        attachment_id: attachment.id || '',
    };

    const validationSchema = Yup.object().shape({
        topleft_lat: Yup.number().required('TopLeft Latitude is required'),
        topleft_lon: Yup.number().required('TopLeft Longitude is required'),
        topright_lat: Yup.number().required('TopRight Latitude is required'),
        topright_lon: Yup.number().required('TopRight Longitude is required'),
        bottomleft_lat: Yup.number().required('BottomLeft Latitude is required'),
        bottomleft_lon: Yup.number().required('BottomLeft Longitude is required'),
    });

    const save = (values, { setSubmitting }) => {
        let localMetadata = metadata
        localMetadata.plant = {
            bottomleft_lat: values.bottomleft_lat,
            bottomleft_lon: values.bottomleft_lon,
            topleft_lat: values.topleft_lat,
            topleft_lon: values.topleft_lon,
            topright_lat: values.topright_lat,
            topright_lon: values.topright_lon,
        };
        let locFloorMap = floorMapInfo
        locFloorMap.metadata = JSON.stringify(localMetadata);

        if (values.attachment_id !== '') {
            locFloorMap.attachment = attachment
            locFloorMap.attachment.id = values.attachment_id;
        }

        floorMapService.update(locFloorMap)
            .then((_r) => {
                toaster.notify('success', intl.formatMessage({ id: 'FLOORMAP.UPDATED' }));
                setBlocking(false)
                setSubmitting(false);
            });
    };

    const upload = (file, { setFieldValue }) => {
        if (file.size / 1024 / 1024 > FILE_SIZE) {
            toaster.notify('error', intl.formatMessage({ id: 'FLOORMAP.FILE_TOO_LARGE' }));
            return false;
        }

        if (!SUPPORTED_FORMATS.includes(file.type)) {
            toaster.notify('error', intl.formatMessage({ id: 'FLOORMAP.FILE_INVALID_FORMAT' }));
            return false;
        }
        setBlocking(true)
        let data = new FormData();
        data.append('file', file);

        floorMapService.upload(data)
            .then((r) => {
                setBlocking(false)
                setFieldValue('attachment_id', r.id, false);
            });
    }

    return (
        <BlockUi tag='div' blocking={blocking}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    save(values, { setSubmitting });
                }}
            >
                {({
                    getFieldProps,
                    errors,
                    touched,
                    handleSubmit,
                    setFieldValue,
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
                                        Map
                                    </h3>
                                    <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                        Parameterization of floor map
                                    </span>
                                </div>
                                <div className='card-toolbar'>
                                    <button
                                        type='submit'
                                        className='btn btn-success mr-2'
                                    >
                                        <DoneIcon /> Save
                                    </button>
                                </div>
                            </div>
                            {/* end::Header */}

                            {/* begin::Form */}
                            <div className='form'>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-xl-4 col-lg-4'>
                                            <div className='form-group row'>
                                                <div className='col-xl-12 col-lg-12'>
                                                    <label>Floor map</label>
                                                    <input
                                                        id="plant"
                                                        name="plant"
                                                        type="file"
                                                        accept={SUPPORTED_FORMATS.join(',')}
                                                        className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                            { errors, touched }, 'plant')}`}
                                                        onChange={(event) => upload(event.currentTarget.files[0], { setFieldValue })} />
                                                    <span>Max file size: {FILE_SIZE}MB</span>
                                                    <ErrorMessage name="plant" component="div"
                                                        className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className='form-group row'>
                                                <div className='col-xl-3 col-lg-3'>
                                                    <label className={`mt-8`}>Top Left</label>
                                                </div>
                                                <div className='col-xl-4 col-lg-4'>
                                                    <label className={`required`}>Latitude</label>
                                                    <div>
                                                        <NumberFormat
                                                            name='topleft_lat'
                                                            className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                                { errors, touched }, 'topleft_lat')}`}
                                                            thousandSeparator={false}
                                                            inputMode="numeric"
                                                            allowLeadingZeros={true}
                                                            decimalScale={15}
                                                            {...getFieldProps('topleft_lat')}
                                                        />
                                                        <ErrorMessage name="topleft_lat" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                                <div className='col-xl-4 col-lg-4'>
                                                    <label className={`required`}>Longitude</label>
                                                    <NumberFormat
                                                        name='topleft_lon'
                                                        className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                            { errors, touched }, 'topleft_lon')}`}
                                                        thousandSeparator={false}
                                                        inputMode="numeric"
                                                        allowLeadingZeros={true}
                                                        decimalScale={15}
                                                        {...getFieldProps('topleft_lon')}
                                                    />
                                                    <ErrorMessage name="topleft_lon" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className='form-group row'>
                                                <div className='col-xl-3 col-lg-3'>
                                                    <label className={`mt-8`}>Top Right</label>
                                                </div>
                                                <div className='col-xl-4 col-lg-4'>
                                                    <label className={`required`}>Latitude</label>
                                                    <div>
                                                        <NumberFormat
                                                            name='topright_lat'
                                                            className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                                { errors, touched }, 'topright_lat')}`}
                                                            thousandSeparator={false}
                                                            inputMode="numeric"
                                                            allowLeadingZeros={true}
                                                            decimalScale={15}
                                                            {...getFieldProps('topright_lat')}
                                                        />
                                                        <ErrorMessage name="topright_lat" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                                <div className='col-xl-4 col-lg-4'>
                                                    <label className={`required`}>Longitude</label>
                                                    <NumberFormat
                                                        name='topright_lon'
                                                        className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                            { errors, touched }, 'topright_lon')}`}
                                                        thousandSeparator={false}
                                                        inputMode="numeric"
                                                        allowLeadingZeros={true}
                                                        decimalScale={15}
                                                        {...getFieldProps('topright_lon')}
                                                    />
                                                    <ErrorMessage name="topright_lon" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className='form-group row'>
                                                <div className='col-xl-3 col-lg-3'>
                                                    <label className={`mt-8`}>Bottom Left</label>
                                                </div>
                                                <div className='col-xl-4 col-lg-4'>
                                                    <label className={`required`}>Latitude</label>
                                                    <div>
                                                        <NumberFormat
                                                            name='bottomleft_lat'
                                                            className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                                { errors, touched }, 'bottomleft_lat')}`}
                                                            thousandSeparator={false}
                                                            inputMode="numeric"
                                                            allowLeadingZeros={true}
                                                            decimalScale={15}
                                                            {...getFieldProps('bottomleft_lat')}
                                                        />
                                                        <ErrorMessage name="bottomleft_lat" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                                <div className='col-xl-4 col-lg-4'>
                                                    <label className={`required`}>Longitude</label>
                                                    <NumberFormat
                                                        name='bottomleft_lon'
                                                        className={`form-control form-control-lg form-control-solid required ${getInputClasses(
                                                            { errors, touched }, 'bottomleft_lon')}`}
                                                        thousandSeparator={false}
                                                        inputMode="numeric"
                                                        allowLeadingZeros={true}
                                                        decimalScale={15}
                                                        {...getFieldProps('bottomleft_lon')}
                                                    />
                                                    <ErrorMessage name="bottomleft_lon" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-8 col-lg-8'>
                                            <IndoorMap
                                                plant={attachment.url}
                                                plantPositions={plant}
                                                anchors={anchors}
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

export default injectIntl(FloorMapMapFormComponent);