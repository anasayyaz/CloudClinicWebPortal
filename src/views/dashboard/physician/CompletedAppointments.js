import React, { useState } from 'react';

import { Box, CircularProgress, Typography } from '@mui/material';
import PhMeetingCard from './PhMeetingCard';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompletedAppointments({ data, loading, error }) {
    const { user } = useSelector((state) => state?.user);

    const navigate = useNavigate();

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
                        showButtons={false}
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
        </>
    );
}
