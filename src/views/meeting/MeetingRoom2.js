// project imports
import React, { useRef, useState, useEffect, useContext, memo, useCallback } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { styled } from '@mui/material/styles';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import { Article } from '@mui/icons-material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import EditIcon from '@mui/icons-material/Edit';
import { JitsiMeeting } from '@jitsi/react-sdk';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { BASE_URL } from 'constants/baseUrl';
import useFetch from 'hooks/useFetch';
import { COLORS } from 'constants/colors';
import VitalSign from 'views/components/vitalSign';
import axios from 'axios';
import { useSelector } from 'react-redux';
import MedicineComp from 'components/MedicineComp';
import DiagnosisComp from 'components/DiagnosisComp';
import LabTestComp from 'components/LabTestComp';
import { profileImage } from 'utils/fetchImage';

const MeetingRoom2 = ({ state }) => {
    const { user } = useSelector((state) => state?.user);
    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState();

    async function startConference() {
        const visitresponse = await axios({
            method: 'get',
            url: `${BASE_URL}api/visit/getVisit/${state?.id}`,
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        });
        setVisit(visitresponse?.data[0]);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        if (window.JitsiMeetExternalAPI) {
            startConference();
        } else {
            alert('Jitsi Meet API script not loaded');
        }
    }, []);

    console.log(visit);

    return (
        <Grid container columnSpacing={2} sx={{ width: '100%', height: '100%' }}>
            {/* -----------------------------  Button Grid */}

            <Grid item lg={8} md={12} sm={12}>
                <Grid container spacing={2}>
                    <CustomButton title="Follow Up" />

                    <CustomButton title="Consultation" />

                    <CustomButton title="Previous Visit" />

                    <CustomButton title="Intake History" />

                    <CustomButton title="View Report" />

                    <CustomButton title="Print Summary" />

                    <Grid item lg={12} md={12} sm={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={4} md={4} sm={4} sx={{ display: 'flex' }}>
                                <Box sx={{ width: 55, height: 55, borderRadius: 55 / 2, overflow: 'hidden', backgroundColor: '#adadad' }}>
                                    <img
                                        alt={'Profile'}
                                        src={profileImage(state?.patientProfilImage)}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </Box>

                                <Box sx={{ ml: 2 }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: '600' }}>
                                        {state?.patientFirstName} {state?.patientLastName}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12 }}>Gender: {state?.patientGender}</Typography>
                                    <Typography sx={{ fontSize: 12 }}>Age: {visit?.age}</Typography>
                                </Box>
                            </Grid>

                            <Grid item lg={5} md={8} sm={8}>
                                <Typography sx={{ fontSize: 16 }}>{state?.title}</Typography>
                                <Typography sx={{ fontSize: 13 }}>{state?.summaryNotes}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item lg={12} md={12} sm={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={12} sm={12}>
                                <Grid container spacing={2} sx={{ height: '60vh' }}>
                                    <Grid item lg={12} md={6} sm={6}>
                                        <LabTestComp />
                                    </Grid>

                                    <Grid item lg={12} md={6} sm={6}>
                                        <DiagnosisComp />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={6} md={12} sm={12} sx={{ height: '62vh' }}>
                                <MedicineComp />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item lg={12} sx={{ mb: -1 }}>
                        <TextField fullWidth size="small" placeholder="Add Notes here" />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={4}>
                <Grid container spacing={2} sx={{ mr: -2 }}>
                    <Grid item lg={12} sx={{ height: 240 }}>
                        <Box sx={{ backgroundColor: '#adadad', width: '105%', height: '100%', borderRadius: 3, overflow: 'hidden' }}>
                            <JitsiMeeting
                                domain={'meet.cloudclinic.ai'}
                                roomName={state?.meetinglink}
                                configOverwrite={{
                                    startWithAudioMuted: false,
                                    disableModeratorIndicator: true,
                                    enableEmailInStats: false,
                                    disableSimulcast: false
                                }}
                                interfaceConfigOverwrite={{
                                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                                    filmStripOnly: false,
                                    SHOW_JITSI_WATERMARK: false,
                                    SHOW_WATERMARK_FOR_GUEST: false
                                }}
                                userInfo={{
                                    displayName: 'Cloud Clinic'
                                }}
                                getIFrameRef={(iframeRef) => {
                                    iframeRef.style.height = '100%';
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item lg={12} sx={{ height: '46.5vh' }}>
                        <Box sx={{ width: '105%', height: '100%', backgroundColor: '#adadad', borderRadius: 3 }}>
                            <VitalSign visitID={586} show={false} />
                        </Box>
                    </Grid>

                    <Grid item lg={12}>
                        <Grid container spacing={2} sx={{ mb: -1 }}>
                            <CustomButton title="Save" />

                            <CustomButton title="End Meeting" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default MeetingRoom2;

const CustomButton = ({ title, onClick, sx }) => {
    return (
        <Grid item>
            <Button fullWidth variant="contained" sx={{ backgroundColor: COLORS.secondory, ...sx }}>
                {title}
            </Button>
        </Grid>
    );
};
