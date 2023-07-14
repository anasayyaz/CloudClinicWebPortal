import React, { useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';
import PhMeetingCard from './PhMeetingCard';
import IntakeHistoryComp from 'components/IntakeHistoryComp';
import VitalSignComp from 'components/VitalSignComp';
import ViewReportsComp from 'components/ViewReportsComp';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from 'constants/baseUrl';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';

export default function UpcomingAppointments({ data, loading, error, refetchApt, refetchStats }) {
    const { user } = useSelector((state) => state?.user);

    const navigate = useNavigate();

    const [selectedVisit, setSelectedVisit] = useState(null);
    const [loadingReq, setLoadingReq] = useState(false);

    const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
    const [openCancelModal, setOpenCancelModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [openVitalSignModal, setOpenVitalSignModal] = useState(false);
    const [openViewReportModal, setOpenViewReportModal] = useState(false);

    // --------------  Reschedule Appointment of specific Patient with his/her UserID and Visit ID

    const handleRescheduleVisit = async () => {
        setLoadingReq(true);

        try {
            const resReschedule = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/sendRescheduleAppointmentEmail`,
                data: {
                    VisitId: selectedVisit?.id,
                    IsRescheduled: true,
                    RescheduleDatetime: new Date(),
                    UserId: user?.userId
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (resReschedule?.data) {
                refetchApt();
                refetchStats();
                setSelectedVisit(null);
                setOpenRescheduleModal(false);
                return toast.success('Request sent for reschedule appointment');
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingReq(false);
        }
    };

    // --------------  Cancel Appointment of specific Patient with his/her UserID and Visit ID

    const handleCancelVisit = async () => {
        setLoadingReq(true);

        try {
            const resCancel = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/sendCancelAppointmentEmail`,
                data: {
                    VisitId: selectedVisit?.id,
                    UserId: user?.userId
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (resCancel?.data) {
                refetchApt();
                refetchStats();
                setSelectedVisit(null);
                setOpenCancelModal(false);
                return toast.success('Request sent for cancel appointment');
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingReq(false);
        }
    };

    return (
        <>
            {data &&
                data?.map((visit) => (
                    <PhMeetingCard
                        key={visit?.id}
                        visit={visit}
                        onClickStart={() => navigate(`/meeting/${visit?.id}`, { state: visit })}
                        onClickReschedule={() => {
                            setOpenRescheduleModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickCancel={() => {
                            setOpenCancelModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickVital={() => {
                            setOpenVitalSignModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickHistory={() => {
                            setOpenHistoryModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickLabReport={() => {
                            setOpenViewReportModal(true);
                            setSelectedVisit(visit);
                        }}
                        showButtons={true}
                    />
                ))}

            {loading && (
                <Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        height: 200,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CircularProgress size={35} color="inherit" />
                </Box>
            )}

            {error && <Typography>{error?.response?.data?.message ?? error?.response?.data ?? error?.message}</Typography>}

            <ModalConfirmation
                open={openRescheduleModal}
                header={'Reschedule Confirmation'}
                description={'Are you sure, you want to reschedule this appointment?'}
                loading={loadingReq}
                onClickNo={() => {
                    setOpenRescheduleModal(false);
                    setSelectedVisit(null);
                }}
                onClickYes={() => handleRescheduleVisit()}
            />

            <ModalConfirmation
                open={openCancelModal}
                header={'Cancel Confirmation'}
                description={'Are you sure, you want to cancel this appointment?'}
                loading={loadingReq}
                onClickNo={() => {
                    setOpenCancelModal(false);
                    setSelectedVisit(null);
                }}
                onClickYes={() => handleCancelVisit()}
            />

            {/* -----------------------  History Modal  -------------------------------------- */}
            {openHistoryModal && (
                <IntakeHistoryComp
                    open={openHistoryModal}
                    onClose={() => {
                        setOpenHistoryModal(false);
                    }}
                    isHistoryUpdated={() => refetchApt()}
                    visit={selectedVisit}
                />
            )}

            {/* -----------------------  Vital Sign Modal  -------------------------------------- */}
            {openVitalSignModal && (
                <VitalSignComp
                    open={openVitalSignModal}
                    onClose={() => {
                        setOpenVitalSignModal(false);
                    }}
                    isVitalSignUpdated={() => refetchApt()}
                    visit={selectedVisit}
                />
            )}

            {/* -----------------------  View Reports Modal  -------------------------------------- */}
            {openViewReportModal && (
                <ViewReportsComp
                    open={openViewReportModal}
                    onClose={() => {
                        setOpenViewReportModal(false);
                    }}
                    visit={selectedVisit}
                />
            )}
        </>
    );
}
