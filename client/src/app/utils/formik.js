export const getInputClasses = (formik, fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
        return 'is-invalid';
    }
    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
        return 'is-valid';
    }
    return '';
};