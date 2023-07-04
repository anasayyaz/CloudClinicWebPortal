import React, { useState, useEffect, useRef } from 'react';

import { Box, Button, CircularProgress, Typography } from '@mui/material';

import { BASE_URL } from 'constants/baseUrl';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HistoryForm from 'ui-component/HistoryForm';
import ModalCustom from 'ui-component/modals/ModalCustom';
import { COLORS } from 'constants/colors';
import axios from 'axios';

export default function IntakeHistoryComp({ visit, open, onClose, isHistoryUpdated }) {
    const { user } = useSelector((state) => state?.user);

    const [loading, setLoading] = useState(true);
    const patientHistory = useRef({});

    const [historyLoading, setHistoryLoading] = useState(false);

    // ------------------------  Get Patient Last History  ---------------------------
    const getPatientHistory = async () => {
        try {
            //-----------  if history status is filled then call the visit history api, else call the last history api
            let url =
                visit?.historystatus == 'Intake History filled'
                    ? `${BASE_URL}api/History/getPatientHistorybyVisit/${visit?.id}`
                    : `${BASE_URL}api/History/patientLastHistory/${visit?.patient_NationalID}`;

            const res = await axios({
                method: 'get',
                url,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            patientHistory.current = res?.data;
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPatientHistory();

        return () => {
            setLoading(true);
        };
    }, [open]);

    //------------------------  Send Request for Post and Put for History using history status from visit
    const handleHistoryRequest = async () => {
        setHistoryLoading(true);
        try {
            let url =
                visit?.historystatus == 'Intake History filled'
                    ? `${BASE_URL}api/History/${patientHistory?.current?.historyID}`
                    : `${BASE_URL}api/History`;
            let method = visit?.historystatus == 'Intake History filled' ? 'put' : 'post';

            const res = await axios({
                method,
                url,
                data: { ...patientHistory?.current },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                isHistoryUpdated(true); // isHistoryUpdated will set to true and if it is true we will change the history status value to filled in appointment list
                return toast.success(
                    visit?.historystatus == 'Intake History filled' ? 'History updated successfully' : 'History added successfully'
                );
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <ModalCustom open={open} title={visit?.historystatus == 'Intake History filled' ? 'Edit Intake History' : 'Add Intake History'}>
            <Box sx={{ width: '70vw' }}>
                {loading ? (
                    <Box sx={{ ...styles.loadingContainer }}>
                        <CircularProgress size={35} color="inherit" />
                    </Box>
                ) : (
                    <>
                        <HistoryForm
                            data={patientHistory?.current || {}} //----------- sending last history of patient to initialize value
                            onChange={(val) => {
                                //----------- on Change will give us updated values of history form and we will set that value to our patientHistory(useRef)
                                patientHistory.current = val;
                            }}
                            visit={visit} //-------------- send visit detail for checking gender and visit id
                        />

                        <Box sx={styles.btnContainer}>
                            {historyLoading ? (
                                <CircularProgress size={25} color="inherit" />
                            ) : (
                                <>
                                    {/* -------------- onClick will call the onClose function that closes the History Modal */}
                                    <Button onClick={onClose} variant="text" sx={{ color: 'red' }}>
                                        Cancel
                                    </Button>

                                    {/* -----------  change button title on the basis of history status */}
                                    <Button onClick={handleHistoryRequest} variant="text" sx={{ color: COLORS.secondory }}>
                                        {visit?.historystatus == 'Intake History filled' ? 'Update' : 'Save'}
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
        height: 400,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    }
};
