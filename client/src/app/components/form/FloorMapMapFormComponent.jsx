import React, {useEffect} from 'react';
import {ErrorMessage, Field, Formik} from 'formik';
import * as Yup from 'yup';
import {makeStyles} from '@material-ui/styles';
import {UploadComponent} from "./UploadComponent";
import floorMapService from '../../services/floorMapService';
import apiService from '../../services/apiService';
import DoneIcon from '@material-ui/icons/Done';
import {getInputClasses} from '../../utils/formik';
import '../../utils/yup-validations';
import BlockUi from "react-block-ui";
import toaster from '../../utils/toaster';
import {injectIntl} from 'react-intl';
import NumberFormat from 'react-number-format';
import Dropzone from 'react-dropzone'
import IndoorMap from "../indoor-map/indoorMap";

class FloorMapMapFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intl: props.intl,
            id: props.id,
            floormap: {},
            attachment: {},
            plant: {},
            anchors: [],
            update: false,
            loading: false,
            blocking: false,
        };
    }

    FILE_SIZE = 2; // MB
    SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/svg",
        "image/png"
    ];

    useStyles = makeStyles((theme) => ({
        headerMarginTop: {
            marginTop: theme.spacing(5),
        }
    }));

    initialValues = {
        topleft_lat: '',
        topleft_lon: '',
        topright_lat: '',
        topright_lon: '',
        bottomleft_lat: '',
        bottomleft_lon: '',
        attachment_id: '',
    };

    validationSchema = Yup.object().shape({
        topleft_lat: Yup.number().required('TopLeft Latitude is required'),
        topleft_lon: Yup.number().required('TopLeft Longitude is required'),
        topright_lat: Yup.number().required('TopRight Latitude is required'),
        topright_lon: Yup.number().required('TopRight Longitude is required'),
        bottomleft_lat: Yup.number().required('BottomLeft Latitude is required'),
        bottomleft_lon: Yup.number().required('BottomLeft Longitude is required'),
    });

    componentDidMount() {

    }

    init = ({setFieldValue}) => {
        const metadata = JSON.parse(this.state.floormap.metadata);

        if ('plant' in metadata) {
            setFieldValue('bottomleft_lat', metadata.plant.bottomleft_lat, false);
            setFieldValue('bottomleft_lon', metadata.plant.bottomleft_lon, false);
            setFieldValue('topleft_lat', metadata.plant.topleft_lat, false);
            setFieldValue('topleft_lon', metadata.plant.topleft_lon, false);
            setFieldValue('topright_lat', metadata.plant.topright_lat, false);
            setFieldValue('topright_lon', metadata.plant.topright_lon, false);
            this.setState({plant: metadata.plant});
        }

        if ('anchors' in metadata) {
            this.setState({anchors: metadata.anchors});
        }
    }

    save = (values, { setSubmitting }) => {
        let metadata = JSON.parse(this.state.floormap.metadata);
        metadata.plant = {
            bottomleft_lat: values.bottomleft_lat,
            bottomleft_lon: values.bottomleft_lon,
            topleft_lat: values.topleft_lat,
            topleft_lon: values.topleft_lon,
            topright_lat: values.topright_lat,
            topright_lon: values.topright_lon,
        };

        this.state.floormap.metadata = JSON.stringify(metadata);

        if (values.attachment_id != '') {
            this.state.floormap.attachment.id = values.attachment_id;
        }

        floorMapService.update(this.state.floormap)
            .then((r) => {
                toaster.notify('success', this.state.intl.formatMessage({id: 'FLOORMAP.UPDATED'}));
                this.setState({blocking: false});
                setSubmitting(false);
            });
    };

    upload = (file, { setFieldValue }) => {
        if (file.size/1024/1024 > this.FILE_SIZE) {
            toaster.notify('error', this.state.intl.formatMessage({id: 'FLOORMAP.FILE_TOO_LARGE'}));
            return false;
        }

        if (!this.SUPPORTED_FORMATS.includes(file.type)) {
            toaster.notify('error', this.state.intl.formatMessage({id: 'FLOORMAP.FILE_INVALID_FORMAT'}));
            return false;
        }

        this.setState({blocking: true});
        let data = new FormData();
        data.append('file', file);

        floorMapService.upload(data)
            .then((r) => {
                console.log(r);
                this.setState({blocking: false});
                setFieldValue('attachment_id', r.id, false);
            });
    }

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
            <Formik
                enableReinitialize
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={(values, { setStatus, setSubmitting, resetForm, setFieldValue }) => {
                    this.save(values, { setSubmitting });
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
                    const classes = this.useStyles();

                    useEffect(() => {
                        if (!this.state.isAddMode && this.state.id !== 'new') {
                            this.setState({blocking: true});
                            apiService
                            .getById('floormaps', this.state.id)
                            .then((response) => {
                                const res = response.floormaps[0];
                                this.setState({floormap: res});

                                if (('attachment' in this.state.floormap) && this.state.floormap.attachment.id !== 0) {
                                    this.setState({attachment: this.state.floormap.attachment});
                                }

                                this.init({setFieldValue});
                                this.setState({blocking: false});
                            });
                        }
                    }, []);

                    return (
                        <form
                            className='card card-custom'
                            onSubmit={handleSubmit}>
                            {/* begin::Header */}
                            <div
                                className={`card-header py-3 `+ classes.headerMarginTop}>
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
                                                        accept={this.SUPPORTED_FORMATS.join(',')}
                                                        className={`form-control form-control-lg form-control-solid ${getInputClasses(
                                                                    {errors, touched}, 'plant')}`}
                                                        onChange={(event) => this.upload(event.currentTarget.files[0], {setFieldValue})} />
                                                    <span>Max file size: {this.FILE_SIZE}MB</span>
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
                                                                {errors, touched}, 'topleft_lat')}`}
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
                                                            {errors, touched}, 'topleft_lon')}`}
                                                        thousandSeparator={false}
                                                        inputMode="numeric"
                                                        allowLeadingZeros={true}
                                                        decimalScale={15}
                                                        {...getFieldProps('topleft_lon')}
                                                    />
                                                    <ErrorMessage name="topleft_lon" component="div" className="invalid-feedback"/>
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
                                                                {errors, touched}, 'topright_lat')}`}
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
                                                            {errors, touched}, 'topright_lon')}`}
                                                        thousandSeparator={false}
                                                        inputMode="numeric"
                                                        allowLeadingZeros={true}
                                                        decimalScale={15}
                                                        {...getFieldProps('topright_lon')}
                                                    />
                                                    <ErrorMessage name="topright_lon" component="div" className="invalid-feedback"/>
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
                                                                {errors, touched}, 'bottomleft_lat')}`}
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
                                                            {errors, touched}, 'bottomleft_lon')}`}
                                                        thousandSeparator={false}
                                                        inputMode="numeric"
                                                        allowLeadingZeros={true}
                                                        decimalScale={15}
                                                        {...getFieldProps('bottomleft_lon')}
                                                    />
                                                    <ErrorMessage name="bottomleft_lon" component="div" className="invalid-feedback"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-xl-8 col-lg-8'>
                                            <IndoorMap
                                                plant={this.state.attachment.url}
                                                plantPositions={this.state.plant}
                                                anchors={this.state.anchors}
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

export default injectIntl(FloorMapMapFormComponent);