// project importsla
import React, { useRef, useState, useEffect, useContext } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import { styled } from '@mui/material/styles';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    LinearProgress,
    Grid,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import HistoryIcon from '@mui/icons-material/History';
import { Article } from '@mui/icons-material';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import EditIcon from '@mui/icons-material/Edit';
import { JitsiMeeting } from '@jitsi/react-sdk';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
import VitalSign from 'views/components/vitalSign';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
// ==============================|| SAMPLE PAGE ||============================== //
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LabTest from 'views/components/labtest';
import Prescription from 'views/components/prescription';
import Diagnosis from 'views/components/diagnosis';
import PreviousVisits from 'views/components/previousVisits';
import ModalCustom from 'ui-component/modals/ModalCustom';
import Autocomplete from '@mui/material/Autocomplete';
import { COLORS } from 'constants/colors';
const MeetingRoom1 = (props) => {
    const { user } = useSelector((state) => state?.user);
    const [roomName, setroomName] = useState('');
    const [vr, setvr] = useState(null);
    const [loading, setLoading] = useState();
    const [openLabTest, setOpenLabTest] = useState(false);
    const [openDiagnosis, setOpenDiagnosis] = useState(false);
    const [openPrescription, setOpenPrescription] = useState(false);
    const [openIntakeHistory, setOpenIntakeHistory] = useState(false);
    const [openPreviousVisits, setOpenPreviousVisits] = useState(false);
    const [openUploadReports, setOpenUploadReports] = useState(false);
    const [openViewReports, setOpenViewReports] = useState(false);
    const [openFollowUp, setOpenFollowUp] = useState(false);
    const [openConsultationNeeded, setOpenConsultationNeeded] = useState(false);
    const [openNotes, setOpenNotes] = useState(false);
    const [followUpDate, setFollowUpDate] = useState(new Date());
    const [speciality, setSpeciality] = useState();
    async function startConference() {
        const domain = 'meet.cloudclinic.ai';
        const visitresponse = await axios({
            method: 'get',
            url: `${BASE_URL}api/visit/getVisit/586`,
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        });
        setvr(visitresponse);
        setroomName(visitresponse.data[0].meetinglink);

        setLoading(false);
    }
    const handleFollowUpDate = (e) => {
        setFollowUpDate(e.target.value);
    };
    useEffect(() => {
        setLoading(true);
        if (window.JitsiMeetExternalAPI) {
            startConference();
        } else {
            alert('Jitsi Meet API script not loaded');
        }
    }, []);

    // const {
    //     data: visitData,
    //     loading: loadingvisitData,
    //     error: errorvisitData,
    //     refetch: refetchvisitData
    // } = useFetch(`${BASE_URL}api/visit/getVisit/586`);

    async function getSpeciality() {
        const visitresponse = await axios({
            method: 'get',
            url: `${BASE_URL}api/colorcode`,
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        });

        setSpeciality([...new Set(visitresponse.data.map((item) => item.speciality))]);
        console.log(speciality);
        setOpenConsultationNeeded(true);
    }
    return (
        <div>
            <ModalCustom open={openFollowUp} title={'Follow Up Timing'}>
                <Box>
                    <IconButton color="inherit" onClick={() => setOpenFollowUp(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        variant="outlined"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={followUpDate}
                        onChange={handleFollowUpDate}
                    />
                    <>
                        <Button onClick={() => setOpenFollowUp(false)} variant="text" sx={{ color: 'red' }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                            Save
                        </Button>
                    </>
                </Box>
            </ModalCustom>
            <ModalCustom open={openConsultationNeeded} title={'Consultation Needed'}>
                <Box>
                    <IconButton
                        color="inherit"
                        onClick={() => setOpenConsultationNeeded(false)}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={speciality}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => `${option}`}
                        renderInput={(params) => <TextField {...params} label="Select Speciality" />}
                    />
                    <Button onClick={() => setOpenConsultationNeeded(false)} variant="text" sx={{ color: 'red' }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                        Save
                    </Button>
                </Box>
            </ModalCustom>
            <ModalCustom open={openLabTest} title={'Lab Test'}>
                <Box sx={{ width: '50vw' }}>
                    <IconButton color="inherit" onClick={() => setOpenLabTest(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    <LabTest />
                </Box>
            </ModalCustom>
            <ModalCustom open={openPreviousVisits} title={'Previous Visits'}>
                <Box sx={{ width: '70vw' }}>
                    <IconButton
                        color="inherit"
                        onClick={() => setOpenPreviousVisits(false)}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <PreviousVisits />
                </Box>
            </ModalCustom>
            <ModalCustom open={openPrescription} title={'Previous Visits'}>
                <Box sx={{ width: '70vw' }}>
                    <IconButton
                        color="inherit"
                        onClick={() => setOpenPrescription(false)}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Prescription cname={'Usman'} visitID={586} />
                </Box>
            </ModalCustom>
            {/* <Dialog open={openPreviousVisits} onClose={() => setOpenPreviousVisits(false)}>
                <div style={{ width: ' 90vw' }}>
                    <DialogContent>
                        <PreviousVisits />
                    </DialogContent>
                </div>

                <DialogActions>
                    <Button onClick={() => setOpenPreviousVisits(false)}>Close</Button>
                </DialogActions>
            </Dialog> */}
            <Dialog open={openIntakeHistory} onClose={() => setOpenIntakeHistory(false)}>
                <DialogContent style={{ width: '500px' }}>ih</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenIntakeHistory(false)}>Cancel</Button>
                    <Button onClick={() => setOpenIntakeHistory(true)}>Update</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openUploadReports} onClose={() => setOpenUploadReports(false)}>
                <DialogContent style={{ width: '500px' }}>lr</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadReports(false)}>Cancel</Button>
                    <Button onClick={() => setOpenUploadReports(true)}>Update</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openViewReports} onClose={() => setOpenViewReports(false)}>
                <DialogContent style={{ width: '500px' }}>vr</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenViewReports(false)}>Cancel</Button>
                    <Button onClick={() => setOpenViewReports(true)}>Update</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDiagnosis} onClose={() => setOpenDiagnosis(false)}>
                <DialogContent style={{ width: '500px' }}>diagnosis</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDiagnosis(false)}>Cancel</Button>
                    <Button onClick={() => setOpenDiagnosis(true)}>Update</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openNotes} onClose={() => setOpenNotes(false)}>
                <DialogContent style={{ width: '500px' }}>notes</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNotes(false)}>Cancel</Button>
                    <Button onClick={() => setOpenNotes(true)}>Update</Button>
                </DialogActions>
            </Dialog>
            {/* <Grid item lg={12} xs={12}>
                <Typography variant="h4" component="h3" sx={{ color: 'black', p: 1 }}>
                    ◉ Visit ID: <span style={{ color: '#0096FF' }}>586</span> ◉ Patient Name:{' '}
                    <span style={{ color: '#0096FF' }}>Ahmad Ali bhatti</span> ◉ Doctor Name:{' '}
                    <span style={{ color: '#0096FF' }}>Zahid Lateef</span>
                </Typography>
            </Grid> */}
            <MainCard>
                <Grid container spacing={1}>
                    <Grid item lg={2} xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}
                        >
                            <LocalPrintshopIcon sx={{ fontSize: 25, color: 'white', marginRight: '5px' }} />
                            Summary
                        </Button>
                    </Grid>
                    <Grid item lg={2} xs={12}>
                        <Button fullWidth variant="contained">
                            <EditIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                            Vital Signs
                        </Button>
                    </Grid>{' '}
                    <Grid item lg={2} xs={12}>
                        <Button fullWidth variant="contained" onClick={() => setOpenPreviousVisits(true)}>
                            <HistoryIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                            Previous Visits
                        </Button>
                    </Grid>
                    <Grid item lg={2} xs={12}>
                        <Button fullWidth variant="contained" onClick={() => setOpenIntakeHistory(true)}>
                            <EditIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                            Intake History
                        </Button>
                    </Grid>{' '}
                    <Grid item lg={2} xs={12}>
                        <Button fullWidth variant="contained" onClick={() => setOpenUploadReports(true)}>
                            <UploadFileIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                            Upload Reports
                        </Button>
                    </Grid>{' '}
                    <Grid item lg={2} xs={12}>
                        <Button fullWidth variant="contained" onClick={() => setOpenViewReports(true)}>
                            <ArticleIcon sx={{ fontSize: 18, color: 'white', marginRight: '5px' }} />
                            View Reports
                        </Button>
                    </Grid>
                    {!loading && (
                        <>
                            <Grid item lg={5} xs={12}>
                                <VitalSign visitID={586} show={true} />
                            </Grid>
                            <Grid item lg={7}>
                                <Grid sx={{ height: '50vh', borderRadius: 3 }}>
                                    <JitsiMeeting
                                        domain={'meet.cloudclinic.ai'}
                                        roomName={roomName}
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
                                            iframeRef.style.height = '50vh';
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </>
                    )}
                    {loading && (
                        <Grid item lg={12} xs={12}>
                            <Grid sx={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress size={35} color="inherit" />
                            </Grid>
                        </Grid>
                    )}
                    <Grid item lg={2} xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}
                            onClick={() => setOpenFollowUp(true)}
                        >
                            Follow Up
                        </Button>
                    </Grid>
                    <Grid item lg={2} xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: '#7ac74f', '&: hover': { backgroundColor: '#265427' } }}
                            onClick={() => getSpeciality()}
                        >
                            Consultation
                        </Button>
                    </Grid>
                    <Grid item lg={2} xs={6}>
                        <Button fullWidth variant="contained" onClick={() => setOpenPrescription(true)}>
                            Prescription
                        </Button>
                    </Grid>
                    <Grid item lg={2} xs={6}>
                        <Button fullWidth variant="contained" onClick={() => setOpenDiagnosis(true)}>
                            Diagnosis & Plan
                        </Button>
                    </Grid>
                    <Grid item lg={2} xs={6}>
                        <Button fullWidth variant="contained" onClick={() => setOpenLabTest(true)}>
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
        </div>
    );
};

export default MeetingRoom1;
