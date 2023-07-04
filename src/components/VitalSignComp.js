import React, { useState, useEffect, useRef } from 'react';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { BASE_URL } from 'constants/baseUrl';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ModalCustom from 'ui-component/modals/ModalCustom';
import { COLORS } from 'constants/colors';
import axios from 'axios';
import VitalSignForm from 'ui-component/VitalSignForm';

export default function VitalSignComp({ visit, open, onClose, isVitalSignUpdated }) {
    const { user } = useSelector((state) => state?.user);

    const [loading, setLoading] = useState(true);
    const patientVitalSign = useRef({});

    const [vitalSignLoading, setVitalSignLoading] = useState(false);

    // ------------------------  Get Patient Vital Sign  ---------------------------
    const getPatientVitalSign = async () => {
        try {
            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/vitalsign/getPatientVitalSignbyVisit/${visit?.id}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            patientVitalSign.current = res?.data;
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPatientVitalSign();

        return () => {
            setLoading(true);
        };
    }, [open]);

    //------------------------  Send Request for Post and Put for Vital using vital status from visit
    const handleVitalSignRequest = async () => {
        setVitalSignLoading(true);

        if (
            patientVitalSign?.current?.weight == '' &&
            patientVitalSign?.current?.height == '' &&
            patientVitalSign?.current?.pr == '' &&
            patientVitalSign?.current?.temp == ''
        ) {
            setVitalSignLoading(false);
            return toast.error('Please enter Vital Signs');
        }

        try {
            let url =
                visit?.vitalsignStatus == 'VitalSigns filled'
                    ? `${BASE_URL}api/vitalsign/${patientVitalSign?.current?.vitalSignID}`
                    : `${BASE_URL}api/vitalsign`;
            let method = visit?.vitalsignStatus == 'VitalSigns filled' ? 'put' : 'post';

            const res = await axios({
                method,
                url,
                data: { ...patientVitalSign?.current },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                isVitalSignUpdated(true); // isVitalSignUpdated will set to true and if it is true we will change the vital sign status value to filled in appointment list
                return toast.success(
                    visit?.vitalsignStatus == 'VitalSigns filled' ? 'Vital sign updated successfully' : 'Vital sign added successfully'
                );
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setVitalSignLoading(false);
        }
    };

    return (
        <ModalCustom open={open} title={visit?.vitalsignStatus == 'VitalSigns filled' ? 'Edit Vital Sign' : 'Add Vital Sign'}>
            <Box sx={{ width: '50vw' }}>
                {loading ? (
                    <Box sx={{ ...styles.loadingContainer }}>
                        <CircularProgress size={35} color="inherit" />
                    </Box>
                ) : (
                    <>
                        <VitalSignForm
                            data={patientVitalSign?.current || {}} //----------- sending last vital of patient to initialize value
                            onChange={(val) => {
                                //----------- on Change will give us updated values of vital form and we will set that value to our patientVitalSign(useRef)
                                patientVitalSign.current = val;
                            }}
                            visit={visit} //-------------- send visit detail for checking gender and visit id
                        />

                        <Box sx={styles.btnContainer}>
                            {vitalSignLoading ? (
                                <CircularProgress size={25} color="inherit" />
                            ) : (
                                <>
                                    {/* -------------- onClick will call the onClose function that closes the Vital Sign Modal */}
                                    <Button onClick={onClose} variant="text" sx={{ color: 'red' }}>
                                        Cancel
                                    </Button>

                                    {/* -----------  change button title on the basis of vital sign status */}
                                    <Button onClick={handleVitalSignRequest} variant="text" sx={{ color: COLORS.secondory }}>
                                        {visit?.vitalsignStatus == 'VitalSigns filled' ? 'Update' : 'Save'}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </ModalCustom>
    );
}

const styles = {
    loadingContainer: {
        height: 155,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        mt: 2,
        justifyContent: 'flex-end'
    }
};
