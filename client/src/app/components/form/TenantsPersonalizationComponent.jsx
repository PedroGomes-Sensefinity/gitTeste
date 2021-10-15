import React, {useEffect} from "react";
import apiService from "../../services/apiService";
import DoneIcon from "@material-ui/icons/Done";
import {Link} from "react-router-dom";
import {UploadComponent} from "./UploadComponent";
import {ColorPickerComponent} from "./ColorPickeComponentr";
import * as Yup from "yup";
import BlockUi from "react-block-ui";
import {ErrorMessage, Field, Formik} from 'formik';
import {injectIntl} from "react-intl";
import {makeStyles} from "@material-ui/styles";
import tenantsService from "../../services/tenantsService";
import toaster from "../../utils/toaster";
import {getInputClasses} from "../../utils/formik";
import {Image} from "@material-ui/icons";


class TenantsPersonalizationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            intl: props.intl,
            id: props.id,
            isAddMode: !props.id,
            loading: false,
            blocking: false,
            logoUrl: '',
        };
    }

    FILE_SIZE = 20 * 1024; // 2 MB
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
            centerimage: {}
        }
    }));

    initialValues = {
        id:    this.props.id,
        color: '#FFFFFF',
        files: [],
        file:  File
    };

    validationSchema = Yup.object().shape({
        color: Yup.string().required('A color is required'),
        file: Yup.mixed().required("A file is required")
            .test(
                "fileSize",
                "File too large",
                value => value && value.size <= this.FILE_SIZE
            )
            .test(
                "fileFormat",
                "Unsupported Format",
                value => value &&  this.SUPPORTED_FORMATS.includes(value.type)
            ),
    });

    upload = (fields, { setSubmitting }) => {
        this.setState({blocking: true});
        setSubmitting(true);

        let data = new FormData();
        data.append('file', fields.files[0])

        let msgSuccess = this.state.intl.formatMessage({id: 'TENANT.UPLOAD'})
        tenantsService.upload(data)
            .then((response) => {
                this.setState({logoUrl: `${response.detail}`})
                tenantsService.tenantAttachment({
                    id: parseInt(fields.id),
                    attachment: {
                        id: parseInt(response.id)
                    },
                    color: fields.color
                })
                    .then((res) => {
                        toaster.notify('success', msgSuccess);
                        this.setState({blocking: false});
                });
            });
        setSubmitting(false);
    }

    render() {
        return (
            <BlockUi tag='div' blocking={this.state.blocking}>
                <Formik
                    enableReinitialize
                    initialValues={this.initialValues}
                    onSubmit={(values, { setSubmitting}) => {
                        console.log(values)
                        this.upload(values, {
                            setSubmitting,
                        });
                    }}
                >
                    {({
                          isValid,
                          errors,
                          touched,
                          isSubmitting,
                          setFieldValue,
                          handleSubmit
                      }) => {
                        const classes = this.useStyles();
                        useEffect(() => {
                            if (!this.state.isAddMode && this.state.id !== 'new') {
                                apiService
                                    .getById('tenant_new', this.state.id)
                                    .then((response) => {
                                        if ('tenants_new' in response && response.tenants_new.length === 1) {

                                            setFieldValue('color', response.tenants_new[0].color)
                                            const attachment = response.tenants_new[0].attachment;
                                            if (attachment !== undefined) {
                                                this.setState({logoUrl: `${attachment.url}`});
                                            }
                                        }
                                    });
                            }
                        }, []);
                        return (
                            <form
                                className='card card-custom'
                                onSubmit={handleSubmit}>
                                {/* begin::Header */}
                                <div
                                    className={`card-header py-3 ` + classes.headerMarginTop}>
                                    <div className='card-title align-items-start flex-column'>
                                        <h3 className='card-label font-weight-bolder text-dark'>
                                            Tenant Personalization
                                        </h3>
                                        <span className='text-muted font-weight-bold font-size-sm mt-1'>
                                            Change the logo and primary color of your Sensefinity platform
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
                                            <DoneIcon/>
                                            Save Changes
                                            {isSubmitting}
                                        </button>
                                        <Link
                                            to='/tenants/list'
                                            className='btn btn-secondary'>
                                            Cancel
                                        </Link>
                                    </div>
                                </div>
                                {/* end::Header */}

                                {/* begin::Form */}
                                <div className='form'>
                                    <div className='card-body'>
                                        <div className='form-group row'>
                                            <div className='col-xl-4 col-lg-4'>
                                                <label>Select your logo</label>
                                                <UploadComponent className={`${getInputClasses(
                                                        {errors, touched},
                                                        'file'
                                                    )}`}
                                                    setFieldValue={setFieldValue}
                                                />
                                                <p>Upload an image of max 200x100px so that it displays correctly. The image will be showed after new login.</p>
                                                <ErrorMessage name="file" component="div"
                                                              className="invalid-feedback" />
                                            </div>
                                            <div className='col-xl-4 col-lg-4'>
                                                {this.state.logoUrl !== '' &&
                                                <div className={'text-center'}>
                                                    <img
                                                        src={this.state.logoUrl}
                                                        title={'Logo'}
                                                        alt={'Logo'}
                                                        width={'200px'}
                                                    />
                                                </div>
                                                } &nbsp;
                                            </div>
                                            <div className='col-xl-4 col-lg-4'>
                                                <div>
                                                    <label>Color picker</label>
                                                    <ColorPickerComponent
                                                        label={"#000"} className={`${getInputClasses(
                                                        {errors, touched},
                                                        'color'
                                                    )}`}
                                                        onChange={color => {
                                                            setFieldValue('color', color)
                                                        }}
                                                    />
                                                    <ErrorMessage name="color" component="div"
                                                                  className="invalid-feedback"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </BlockUi>
        );
    }
}
export default injectIntl(TenantsPersonalizationComponent);