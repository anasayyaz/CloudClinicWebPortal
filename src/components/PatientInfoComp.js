import React, { useState, useEffect, useRef } from 'react';

import { Box, CircularProgress, IconButton, Typography } from '@mui/material';

import ModalCustom from 'ui-component/modals/ModalCustom';
import CloseIcon from '@mui/icons-material/Close';
import { getDetail } from 'services/getDetail';
import moment from 'moment';
import { profileImage } from 'utils/fetchImage';

export default function PatientInfoComp({ visit, open, onClose }) {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getPatient = async () => {
        try {
            const res = await getDetail('patient', visit?.patient_NationalID);
            setPatient(res?.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPatient();

        return () => {
            setLoading(true);
            setError(null);
            setPatient(null);
        };
    }, [open]);

    return (
        <ModalCustom open={open} title={'Patient Info'}>
            <Box sx={{ width: 330 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress size={30} color="inherit" />
                    </Box>
                )}

                <IconButton color="inherit" onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>

                {!!patient && (
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <img alt={'Profile'} src={profileImage(patient?.profileImage)} style={styles.profilePicture} />
                        </Box>

                        <TextBox title={'Name'} subTitle={`${patient?.titles} ${patient?.name} ${patient?.lastName}`} />
                        <TextBox title={'Gender'} subTitle={`${patient?.gender}`} />
                        <TextBox title={'Phone No.'} subTitle={`${patient?.phone}`} />
                        <TextBox title={'NIC'} subTitle={`${patient?.identificationNo}`} />
                        <TextBox title={'Date of Birth'} subTitle={moment(patient?.dob).format('MMM DD, YYYY')} />
                        <TextBox title={'Email'} subTitle={`${patient?.email}`} />
                        <TextBox title={'Address'} subTitle={`${patient?.address}`} />
                        <TextBox title={'Guardian Name'} subTitle={`${patient?.guardianName}`} />
                        <TextBox title={'Guardian Phone'} subTitle={`${patient?.guardianPhone}`} />
                        <TextBox title={'Active'} subTitle={`${patient?.isActive == true ? 'Yes' : 'No'}`} />
                        <TextBox title={'In-Hospital'} subTitle={`${patient?.inHospital == true ? 'Yes' : 'No'}`} />
                    </>
                )}

                {!!error && (
                    <Typography sx={{ ...styles.loadingContainer, py: 1 }}>
                        {error?.response?.data?.message || error?.response?.data || error?.message}
                    </Typography>
                )}
            </Box>
        </ModalCustom>
    );
}

const styles = {
    loadingContainer: {
        height: 'auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#d5d5d5',
        alignSelf: 'center'
    }
};

const TextBox = ({ title, subTitle }) => {
    return (
        <Box sx={{ display: 'flex', my: 1 }}>
            <Typography sx={{ width: '45%' }}>{title}</Typography>
            <Typography>{subTitle ?? '--'}</Typography>
        </Box>
    );
};
