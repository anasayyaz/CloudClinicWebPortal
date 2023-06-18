import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const TextfieldWrapper = ({ name, ...otherProps }) => {
    const [field, mata] = useField(name);

    const configTextfield = {
        variant: 'standard',
        ...field,
        ...otherProps,
        fullWidth: true
    };

    if (mata && mata.touched && mata.error) {
        configTextfield.error = true;
        configTextfield.helperText = mata.error;
    }

    return <TextField {...configTextfield} />;
};

export default TextfieldWrapper;
