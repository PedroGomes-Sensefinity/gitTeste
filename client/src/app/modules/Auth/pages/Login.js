import { useFormik } from 'formik';
import React, { useState } from 'react';
import ReactGA from 'react-ga';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { toAbsoluteUrl } from '../../../../_metronic/_helpers';
import history from '../../../history';
import { login, setTenantLogo, setToken, setUser } from '../../../services/authService';
import toaster from '../../../utils/toaster';

/*
  INTL (i18n) docs:
  https://github.com/formatjs/react-intl/blob/master/docs/Components.md#formattedmessage
*/

/*
  Formik+YUP:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
*/

const initialValues = {
    email: '',
    password: '',
};

function Login(props) {
    const { intl } = props;
    const [loading, setLoading] = useState(false);
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .min(3, 'Minimum 3 symbols')
            .max(50, 'Maximum 50 symbols')
            .required(
                intl.formatMessage({
                    id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                })
            ),
        password: Yup.string()
            .min(3, 'Minimum 3 symbols')
            .max(50, 'Maximum 50 symbols')
            .required(
                intl.formatMessage({
                    id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                })
            ),
    });

    const enableLoading = () => {
        setLoading(true);
    };

    const disableLoading = () => {
        setLoading(false);
    };

    const getInputClasses = (fieldname) => {
        if (formik.touched[fieldname] && formik.errors[fieldname]) {
            return 'is-invalid';
        }

        if (formik.touched[fieldname] && !formik.errors[fieldname]) {
            return 'is-valid';
        }

        return '';
    };

    const formik = useFormik({
        initialValues,
        validationSchema: LoginSchema,
        onSubmit: (values, { setStatus, setSubmitting }) => {
            enableLoading();
            ReactGA.event({ category: "Button", action: "Login " + values.email.replace("@", "_") })

            setTimeout(() => {
                login(values.email, values.password)
                    .then((response) => response.data)
                    .then((r) => {
                        let tenant = r.data.token[0];
                        let user = {
                            username: tenant.username,
                            password: '',
                            email: tenant.email,
                            authToken: tenant.hash,
                            refreshToken: tenant.hash,
                            tenantLogo: ("logo" in tenant) ? tenant.logo : '',
                            tenant: ("tenant" in tenant) ? tenant.tenant : '',
                            roles: [1], // Administrator
                            pic: toAbsoluteUrl('/media/users/300_21.jpg'),
                            fullname: "",
                            firstname: "",
                            lastname: '',
                        };

                        setToken(tenant.hash);
                        setUser(user);
                        setTenantLogo(user.tenantLogo);

                        let url = String(props.redirectURL)
                        let reducedUrl = ""
                        if (url.includes("localhost")) {
                            reducedUrl = url.replace("http://localhost:8080/", "/")
                        } else {
                            reducedUrl = url.replace("https://uiadmin.sensefinity.com/", "/")
                        }

                        if (reducedUrl.includes("#")) {
                            reducedUrl = reducedUrl.split("#")[0]

                        }
                        history.push(reducedUrl);

                        disableLoading();
                    })
                    .catch((error) => {
                        setStatus(
                            intl.formatMessage({
                                id: 'AUTH.VALIDATION.INVALID_LOGIN',
                            })
                        );

                        toaster.notify(
                            'error',
                            intl.formatMessage({
                                id: 'AUTH.VALIDATION.INVALID_LOGIN',
                            })
                        );
                    })
                    .finally(() => {
                        disableLoading();
                        setSubmitting(false);
                    });
            }, 1000);
        },
    });

    return (
        <div className='login-form login-signin' id='kt_login_signin_form'>
            <div className='text-center mb-20'>
                <img
                    src={toAbsoluteUrl('/media/logos/sensefinity_iot.png')}
                    width='50%'
                    alt={'Login'}
                />
            </div>
            {/* begin::Head */}
            <div className='text-center mb-10 mb-lg-20'>
                <h3 className='font-size-h1'>
                    <FormattedMessage id='AUTH.LOGIN.TITLE' />
                </h3>
                <p className='text-muted font-weight-bold'>
                    Enter your username and password
                </p>
            </div>
            {/* end::Head */}

            {/*begin::Form*/}
            <form
                onSubmit={formik.handleSubmit}
                className='form fv-plugins-bootstrap fv-plugins-framework'>
                {/* {formik.status ? (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        ) : (
          <div className="mb-10 alert alert-custom alert-light-info alert-dismissible">
            <div className="alert-text ">
              Use account <strong>admin@demo.com</strong> and password{" "}
              <strong>demo</strong> to continue.
            </div>
          </div>
        )} */}

                <div className='form-group fv-plugins-icon-container'>
                    <input
                        placeholder='Email'
                        type='text'
                        className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                            'email'
                        )}`}
                        name='email'
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                                {formik.errors.email}
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className='form-group fv-plugins-icon-container'>
                    <input
                        placeholder='Password'
                        type='password'
                        className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                            'password'
                        )}`}
                        name='password'
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className='fv-plugins-message-container'>
                            <div className='fv-help-block'>
                                {formik.errors.password}
                            </div>
                        </div>
                    ) : null}
                </div>
                <div className='form-group d-flex flex-wrap justify-content-between align-items-center'>
                    {/* <Link
                        to='/auth/forgot-password'
                        className='text-dark-50 text-hover-primary my-3 mr-2'
                        id='kt_login_forgot'>Forgot my password
                        <FormattedMessage id="Forgot my password" />
                    </Link>*/}
                    <button
                        id='kt_login_signin_submit'
                        type='submit'
                        disabled={formik.isSubmitting}
                        className={`btn btn-primary font-weight-bold px-9 py-4 my-3`}>
                        <span>Sign In</span>
                        {loading && (
                            <span className='ml-3 spinner spinner-white'></span>
                        )}
                    </button>
                </div>
            </form>
            {/*end::Form*/}
        </div>
    );
}

export default injectIntl(connect(null, null)(Login));
//export default injectIntl(connect(null, auth.actions)(Login));
