// project imports
import React, { useRef, useState, useEffect, useContext } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, FormControlLabel, Grid, IconButton, Paper, Switch, Typography } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import { Article } from '@mui/icons-material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import EditIcon from '@mui/icons-material/Edit';
import { JitsiMeeting } from '@jitsi/react-sdk';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
// ==============================|| SAMPLE PAGE ||============================== //
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));

const Meeting = () => (
    <MainCard title="Virtual Clinic">
        <Grid container spacing={1}>
            <Grid item lg={2} xs={12}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}>
                    <LocalPrintshopIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                    Print Summary
                </Button>
            </Grid>
            <Grid item lg={2} xs={12}>
                <Button fullWidth variant="contained">
                    <HistoryIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                    Previous Visits
                </Button>
            </Grid>
            <Grid item lg={2} xs={12}>
                <Button fullWidth variant="contained">
                    <EditIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                    Intake History
                </Button>
            </Grid>{' '}
            <Grid item lg={2} xs={12}>
                <Button fullWidth variant="contained">
                    <UploadFileIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                    Upload Reports
                </Button>
            </Grid>{' '}
            <Grid item lg={2} xs={12}>
                <Button fullWidth variant="contained">
                    <ArticleIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                    View Reports
                </Button>
            </Grid>
            <Grid item lg={5} xs={12}>
                <Grid
                    lg={12}
                    xs={12}
                    sx={{ height: '50vh', backgroundColor: '#636f83', border: 5, borderColor: '#DDE6ED', borderRadius: 3, p: 1 }}
                >
                    <Grid container lg={12} sx={{ height: '10vh', backgroundColor: '#636f83', borderRadius: 1 }}>
                        <Grid item lg={6} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Gender:
                            </Typography>
                        </Grid>
                        <Grid item lg={6} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Age:
                            </Typography>
                        </Grid>
                        <Grid item lg={6}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Weight:
                            </Typography>
                        </Grid>
                        <Grid item lg={6}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Height:
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container lg={12} sx={{ height: '12vh', backgroundColor: '#424949', borderRadius: 1 }}>
                        <Grid item lg={12} sx={{ borderBottom: 2, borderColor: '#636f83' }}>
                            {' '}
                            <Typography variant="h4" component="h2" sx={{ color: 'white', p: 1 }}>
                                NIBP:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                SYS:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                DIA:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                MAP:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                PR:
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container lg={12} sx={{ height: '12vh', backgroundColor: '#424949', mt: 1, borderRadius: 1 }}>
                        <Grid item lg={12} sx={{ borderBottom: 2, borderColor: '#636f83' }}>
                            {' '}
                            <Typography variant="h5" component="h2" sx={{ color: 'white', p: 1 }}>
                                TEMP:
                            </Typography>
                        </Grid>
                        <Grid item lg={4}>
                            {' '}
                            <Typography variant="h5" component="h2" sx={{ color: 'white', p: 1 }}>
                                SPO2:
                            </Typography>
                        </Grid>
                        <Grid item lg={4}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                PI:
                            </Typography>
                        </Grid>
                        <Grid item lg={4}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                PR:
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container lg={12} sx={{ height: '10vh', backgroundColor: '#636f83', borderRadius: 1 }}>
                        <Grid item lg={5} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography variant="h4" component="h2" sx={{ color: '#E7FFC2', p: 1 }}>
                                ECG:
                            </Typography>
                        </Grid>
                        <Grid item lg={6} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Regular ECG Rhythm
                            </Typography>
                        </Grid>
                        <Grid item lg={1} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: '#E7FFC2', p: 1 }}>
                                <PlayCircleOutlineIcon sx={{ fontSize: 20 }} />
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                QT:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                QRs:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Qtc:
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                HR:
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={7}>
                <Grid sx={{ height: '50vh', backgroundColor: 'grey', borderRadius: 3 }}>
                    <JitsiMeeting roomName={'meet.cloudclinic.ai'} getIFrameRef={(node) => (node.style.height = '50vh')} />
                </Grid>
            </Grid>
            <Grid item lg={2} xs={6}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}>
                    Follow Up
                </Button>
            </Grid>
            <Grid item lg={2} xs={6}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}>
                    Consultation
                </Button>
            </Grid>
            <Grid item lg={2} xs={6}>
                <Button fullWidth variant="contained">
                    Prescription
                </Button>
            </Grid>
            <Grid item lg={2} xs={6}>
                <Button fullWidth variant="contained">
                    Diagnosis & Plan
                </Button>
            </Grid>
            <Grid item lg={2} xs={6}>
                <Button fullWidth variant="contained">
                    Lab Test
                </Button>
            </Grid>
            <Grid item lg={1}>
                <Button fullWidth variant="contained">
                    Notes
                </Button>
            </Grid>
            <Grid item lg={1}>
                <Button fullWidth variant="contained" sx={{ backgroundColor: '#FF2E2E', '&: hover': { background: '#c7020c' } }}>
                    End
                </Button>
            </Grid>
        </Grid>
    </MainCard>
);

export default Meeting;
