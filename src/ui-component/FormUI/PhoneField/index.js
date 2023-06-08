import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { ErrorMessage, Field, useField, useFormikContext } from 'formik';
import MuiPhoneNumber from 'material-ui-phone-number';

const PhoneFieldWrapper = ({ name, options, ...otherProps }) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (value) => {
        setFieldValue(value);
        console.log(value, ' value');
    };

    const configTextfield = {
        ...field,
        ...otherProps,
        variant: 'standard',
        onlyCountrie: ['us', 'pk'],
        defaultCountry: 'pk',
        fullWidth: true,
        autoFormat: true,
        disableAreaCodes: true,
        onChange: handleChange
    };

    if (meta && meta.touched && meta.error) {
        configTextfield.error = true;
        configTextfield.helperText = meta.error;
    }

    return (
        <MuiPhoneNumber
            {...configTextfield}
            // fullWidth
            // onlyCountries={['us', 'pk']}
            // defaultCountry={'pk'}
            // autoFormat={true}
            // disableAreaCodes={true}
            // name="mobileNo"
            // label="Mobile Number"
            // onChange={(value) => {
            //     console.log('value ', value);
            // }}
        />
    );
};

export default PhoneFieldWrapper;
