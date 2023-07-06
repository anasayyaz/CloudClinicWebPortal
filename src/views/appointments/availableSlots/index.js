// material-ui
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { BASE_URL } from 'constants/baseUrl';
import useFetch from 'hooks/useFetch';
import { useState } from 'react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ModalCustom from 'ui-component/modals/ModalCustom';

// ==============================|| SAMPLE PAGE ||============================== //

const AvailableSlots = () => {
    const {
        data: medicine,
        loading: loadingMedicine,
        error: errorMedicine,
        refetch: refetchMedicine
    } = useFetch(`${BASE_URL}api/medicine`);

    const handleAdd = async () => {
        try {
            localStorage.setItem('medicine', JSON.stringify(medicine));

            console.log('Added');
        } catch (error) {
            console.log('Error 1 ', error);
        }
    };

    const handleGet = async () => {
        try {
            const medLocal = JSON.parse(localStorage.getItem('medicine'));

            console.log('Med Local ', medLocal.slice(0, 10));
        } catch (error) {
            console.log('Error 2 ', error);
        }
    };

    return (
        <Box>
            {loadingMedicine && <Typography>loading...</Typography>}
            <Button variant="standard" onClick={handleAdd}>
                Add Medicine to Local Storage
            </Button>

            <Button variant="standard" onClick={handleGet}>
                Get Medicine
            </Button>
        </Box>
    );
};

export default AvailableSlots;
