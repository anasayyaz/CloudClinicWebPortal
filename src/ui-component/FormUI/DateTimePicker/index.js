import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const DateTimePicker = ({ name, ...otherProps }) => {
    const [field, meta] = useField(name);

    const configDateTimePicker = {
        type: 'date',
        variant: 'standard',
        ...field,
        ...otherProps,
        fullWidth: true,
        InputLabelProps: {
            shrink: true
        }
    };

    if (meta && meta.touched && meta.error) {
        configDateTimePicker.error = true;
        configDateTimePicker.helperText = meta.error;
    }

    return <TextField {...configDateTimePicker} />;
};

export default DateTimePicker;
