import { Box, Button, Divider, FormControlLabel, Grid, IconButton, Paper, Switch, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingTitle from 'assets/images/icons/meeting-title.svg';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React from 'react';
import { COLORS } from 'constants/colors';
import { textTransform } from '@mui/system';
import { profileImage } from 'utils/fetchImage';
import moment from 'moment';
import QRCode from 'react-qr-code';
import ModalCustom from 'ui-component/modals/ModalCustom';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
export default function MeetingCard({
    visit,
    onClickStart,
    onClickSwitch,
    onClickPatientProfile,
    onClickReschedule,
    onClickCancel,
    onClickVitalSign,
    onClickHistory,
    onClickViewReports,
    onClickUploadReports,
    onChangeConfirm
}) {
    const [openQR, setOpenQR] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state?.user);
    const { state } = useLocation();
    let physicianName = `${visit?.consultantTitle} ${visit?.consultantFirstName} ${visit?.consultantLastName}`;
    let patientName = `${visit?.patientTitle} ${visit?.patientFirstName} ${visit?.patientLastName}`;

    return (
        <Paper sx={styles.container}>
            <Grid container direction={'row'}>
                {/* ---------------------  Grid 1 of Switch, QR and Date  ---------------------- */}
                <Grid item lg={2} sm={6} xs={12} sx={styles.innerContainer}>
                    <FormControlLabel
                        control={<Switch checked={visit?.isConfirm} onChange={onChangeConfirm} />}
                        label={visit?.isConfirm ? 'Confirmed' : 'Unconfirmed'}
                    />

                    <Box sx={styles.textIconCont}>
                        <QrCode2Icon sx={{ width: 40, height: 40, '&: hover': { cursor: 'pointer' } }} onClick={() => setOpenQR(true)} />

                        <Box>
                            <Typography sx={{ fontSize: 14 }}>Visit ID - {visit?.id}</Typography>
                            <Typography sx={styles.day}>{moment(visit.startDateTime).format('dddd')}</Typography>
                        </Box>
                    </Box>

                    <Box sx={styles.textIconCont}>
                        <CalendarMonthIcon sx={{ fontSize: 18, color: COLORS.primary }} />
                        <Typography sx={{ fontSize: 16, color: COLORS.secondory }}>
                            {moment(visit.startDateTime).format('MMM DD, YYYY')}
                        </Typography>
                    </Box>
                </Grid>

                {/* -----------------------  Grid 2 of Meeting Title and Meeting Type and Time  --------------------- */}
                <Grid item lg={2.5} sm={6} xs={12} sx={styles.innerContainer}>
                    <Box sx={styles.textIconCont}>
                        <img src={MeetingTitle} alt="meeting-title" width={18} height={18} />
                        <Typography sx={styles.meetingTitle}>{visit?.title}</Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={styles.textIconCont}>
                        {visit?.meetingtype?.toLowerCase() == 'virtual' ? (
                            <>
                                <VideoCameraFrontIcon sx={{ fontSize: 18, color: COLORS.primary }} />
                                <Typography sx={styles.meetingType}>Virtual Meeting</Typography>
                            </>
                        ) : (
                            <>
                                <VideoCameraFrontIcon sx={{ fontSize: 18, color: COLORS.primary }} />
                                <Typography sx={styles.meetingType}>In-Person Meeting</Typography>
                            </>
                        )}
                    </Box>

                    <Box sx={styles.textIconCont}>
                        <AccessTimeIcon sx={{ fontSize: 18, color: COLORS.primary }} />
                        <Typography sx={{ fontSize: 17 }}>{moment(visit.startDateTime).format('hh:mm A')}</Typography>
                    </Box>
                </Grid>

                {/* --------------------------  Grid 3 of Physician and Patient  ----------------------- */}
                <Grid item lg={3} sm={6} xs={12} sx={styles.innerContainer}>
                    <Box sx={styles.profileContainer}>
                        <img alt={'Profile'} src={profileImage(visit?.physicinProfilImage)} style={styles.profilePicture} />

                        <Box>
                            <Typography sx={styles.name}>{physicianName}</Typography>
                            <Typography sx={{ textTransform: 'capitalize' }}>{visit?.doctorSpeciality?.toLowerCase()}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ ...styles.profileContainer, '&:hover': { cursor: 'pointer' } }} onClick={onClickPatientProfile}>
                        <img alt={'Profile'} src={profileImage(visit?.patientProfilImage)} style={styles.profilePicture} />

                        <Box>
                            <Typography sx={styles.name}>{patientName}</Typography>
                            <Typography>Patient (+923001234567)</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* ------------------------  Grid 4 of Buttons  ----------------------------- */}

                <Grid item lg={4.5} sm={6} xs={12} sx={{ backgroundColor: '#fff', p: 1 }}>
                    <Grid container direction={'row'} spacing={1}>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}
                                onClick={() => navigate(`/meeting`)}
                            >
                                <VideoCameraFrontIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} /> Start
                            </Button>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <Button fullWidth variant="contained">
                                <MoreTimeIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                                Reschedule
                            </Button>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ backgroundColor: '#FF2E2E', '&: hover': { background: '#c7020c' } }}
                                onClick={onClickCancel}
                            >
                                <CancelIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                                Cancel
                            </Button>
                        </Grid>

                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Button fullWidth variant="contained">
                                Vital Sign
                            </Button>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Button fullWidth variant="contained" onClick={onClickHistory}>
                                Intake History
                            </Button>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Button fullWidth variant="contained" onClick={onClickViewReports}>
                                View Reports
                            </Button>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Button fullWidth variant="contained" onClick={onClickUploadReports}>
                                Upload Reports
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <ModalCustom open={openQR} title={'QR Code'}>
                <IconButton color="inherit" onClick={() => setOpenQR(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>
                <QRCode
                    size={200}
                    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                    value={JSON.stringify({
                        visitId: visit?.id,
                        patientNationalID: visit?.patient_NationalID,
                        patientName: visit?.patientFirstName
                    })}
                    viewBox={`0 0 200 200`}
                />
            </ModalCustom>
        </Paper>
    );
}

const styles = {
    container: {
        width: '100%',
        overflow: 'hidden',
        mt: 2.5,
        boxShadow: '0px 5px 10px #c2c0c0'
    },
    innerContainer: {
        backgroundColor: '#fff',
        p: 1,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    textIconCont: {
        display: 'flex',
        alignItems: 'center',
        gap: 1
    },
    meetingTitle: {
        fontSize: 17,
        color: '#636f83',
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2
    },
    day: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary
    },
    meetingType: {
        fontSize: 17,
        fontWeight: '600',
        color: '#636f83'
    },
    profileContainer: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 1,
        alignItems: 'center'
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#636f83',
        textTransform: 'capitalize'
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 20,
        backgroundColor: '#d5d5d5'
    }
};
