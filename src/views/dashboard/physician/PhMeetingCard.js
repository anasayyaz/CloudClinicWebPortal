import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import CancelIcon from '@mui/icons-material/Cancel';

import { profileImage } from 'utils/fetchImage';
import { COLORS } from 'constants/colors';
import moment from 'moment';

export default function PhMeetingCard({
    visit,
    onClickReschedule,
    onClickStart,
    onClickCancel,
    onClickHistory,
    onClickVital,
    onClickLabReport,
    showButtons
}) {
    return (
        <Grid sx={styles.container}>
            <Grid container spacing={1}>
                {/* ----------------------------  Patient Info */}
                <Grid item lg={3} sm={6} xs={12} sx={styles.patientInfo}>
                    <img alt={'Profile'} src={profileImage(visit?.patientProfilImage)} style={styles.patientImage} />

                    <Box sx={{ ml: 1 }}>
                        <Typography sx={styles.patientName}>
                            {visit?.patientTitle} {visit?.patientFirstName} {visit?.patientLastName}
                        </Typography>
                        <Typography sx={{ fontSize: 13 }}>Gender: {visit?.patientGender}</Typography>
                        <Typography sx={{ fontSize: 13 }}>Age: {visit?.patientAge}</Typography>
                    </Box>
                </Grid>

                {/* ----------------------------  Visit Info */}

                <Grid item lg={2.5} sm={6} xs={12} sx={styles.secondContainer}>
                    <Typography sx={styles.heading}>Visit ID: {visit?.id}</Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <VideoCameraFrontIcon sx={styles.icon} />
                        <Typography sx={{ fontSize: 13 }}>{visit?.meetingtype} Meeting</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ScheduleIcon sx={styles.icon} />
                        <Typography sx={{ fontSize: 13 }}>{moment(visit?.startDateTime).format('MMM DD, YYYY  -  hh:mm A')}</Typography>
                    </Box>
                </Grid>

                {/* ----------------------------  Visit Summary */}

                <Grid item lg={showButtons ? 2.5 : 6} sm={6} xs={12} sx={styles.secondContainer}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <ContentPasteIcon sx={styles.icon} />
                        <Typography sx={styles.heading}>{visit?.title}</Typography>
                    </Box>

                    <Typography sx={{ fontSize: 13, height: 35 }}>{visit?.summaryNotes}</Typography>
                </Grid>

                {/* ----------------------------  Buttons */}

                {showButtons && (
                    <Grid item lg={4} sm={6} xs={12}>
                        <Grid container spacing={1}>
                            {visit?.status == '12' ? (
                                <Grid item lg={12} sx={12} xs={6}>
                                    <Button fullWidth size="small" disabled variant={'contained'} sx={{ backgroundColor: '#FF2E2E' }}>
                                        Cancelled Request Sent
                                    </Button>
                                </Grid>
                            ) : (
                                <>
                                    <Grid item lg={4} sx={4} xs={6}>
                                        <Button
                                            onClick={onClickStart}
                                            fullWidth
                                            size="small"
                                            variant={'contained'}
                                            startIcon={<VideoCameraFrontIcon />}
                                            sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}
                                        >
                                            Start
                                        </Button>
                                    </Grid>

                                    <Grid item lg={4} sx={4} xs={6}>
                                        <Button
                                            onClick={onClickReschedule}
                                            fullWidth
                                            size="small"
                                            variant={'contained'}
                                            startIcon={<MoreTimeIcon />}
                                            sx={{ backgroundColor: COLORS.secondory }}
                                        >
                                            Reschedule
                                        </Button>
                                    </Grid>

                                    <Grid item lg={4} sx={4} xs={6}>
                                        <Button
                                            onClick={onClickCancel}
                                            fullWidth
                                            size="small"
                                            variant={'contained'}
                                            startIcon={<CancelIcon />}
                                            sx={{ backgroundColor: '#FF2E2E', '&: hover': { background: '#c7020c' } }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                </>
                            )}

                            <Grid item lg={4} sx={4} xs={6}>
                                <Button
                                    onClick={onClickVital}
                                    fullWidth
                                    size="small"
                                    variant={'contained'}
                                    sx={{ backgroundColor: COLORS.secondory }}
                                >
                                    Vital Sign
                                </Button>
                            </Grid>

                            <Grid item lg={4} sx={4} xs={6}>
                                <Button
                                    onClick={onClickHistory}
                                    fullWidth
                                    size="small"
                                    variant={'contained'}
                                    sx={{ backgroundColor: COLORS.secondory }}
                                >
                                    History
                                </Button>
                            </Grid>

                            <Grid item lg={4} sx={4} xs={6}>
                                <Button
                                    onClick={onClickLabReport}
                                    fullWidth
                                    size="small"
                                    variant={'contained'}
                                    sx={{ backgroundColor: COLORS.secondory }}
                                >
                                    Lab Reports
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
}

const styles = {
    container: {
        backgroundColor: '#fff',
        p: 1,
        borderRadius: 3,
        boxShadow: '0px 5px 10px #c2c0c0',
        overflow: 'hidden',
        mb: 2
    },
    patientInfo: {
        display: 'flex',
        alignItems: 'center'
    },
    patientImage: {
        width: 70,
        height: 70,
        borderRadius: 10
    },
    patientName: {
        fontSize: 17,
        fontWeight: '600',
        mb: 0.2
    },
    secondContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    heading: {
        fontSize: 16,
        fontWeight: '600'
    },
    icon: {
        fontSize: 18,
        color: COLORS.primary
    }
};
