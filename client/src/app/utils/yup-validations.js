import * as Yup from 'yup';

Yup.addMethod(Yup.string, "isJson", function (msg) {
    return this.test(`test-is-json`, msg, function (value) {
        const {path, createError} = this;

        try {
            return (JSON.parse(value) && !!value);
        } catch (e) {
            return createError({path, message: msg})
        }
    });
});
