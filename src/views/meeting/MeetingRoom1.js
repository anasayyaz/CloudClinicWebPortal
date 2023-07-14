// project importsla
import React, { useRef, useState, useEffect, useContext, memo } from 'react';
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
const MeetingRoom1 = ({ state }) => {
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
    const [notes, setNotes] = useState();
    const [intitialComplain, setInitialComplain] = useState();
    async function startConference() {
        const domain = 'meet.cloudclinic.ai';
        const visitresponse = await axios({
            method: 'get',
            url: `${BASE_URL}api/visit/getVisit/${state?.id}`,
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        });
        setvr(visitresponse);
        setNotes(visitresponse.data[0].notes);
        setroomName(visitresponse.data[0].meetinglink);

        setLoading(false);
    }
    const handleFollowUpDate = (e) => {
        setFollowUpDate(e.target.value);
    };
    useEffect(() => {
        console.log(state);
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
    // } = useFetch(`${BASE_URL}api/visit/getVisit/state?.id`);

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

    const handleEnd = async () => {
        try {
            const body = {
                isConsultantRequired: false,
                referredTo: 'aaa',
                followupdatetime: followUpDate,
                isfollowup: 1,
                isConsultantappointmentSchedule: true,
                prescription: '',
                notes: notes,
                initialComplain: '',
                isActive: false,
                status: 8
            };
            const responseVisit = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/${state?.id}`,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (err) {
            console.error(err.message);
        }
        try {
            const bodyUpdate = {
                IsAppointmentSchedule: false,
                followupdatetime: followUpDate,
                isfollowup: 1,
                isConsultantappointmentSchedule: true,
                IsAppointmentSchedule: false
            };
            const responseVisitUpdate = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/updatePatientTags/${state?.patient_NationalID}`,
                data: bodyUpdate,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (err) {
            console.error(err.message);
        }
    };
    return (
        <div>
            <ModalCustom open={openFollowUp} title={'Follow Up Timing'}>
                <Box sx={{ width: '30vw' }}>
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
                <Box sx={{ width: '30vw' }}>
                    <IconButton
                        color="inherit"
                        onClick={() => setOpenConsultationNeeded(false)}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {/* <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={speciality}
                        sx={{ width: 300, flex: 1, zIndex: 999 }}
                        getOptionLabel={(option) => `${option}`}
                        renderInput={(params) => <TextField {...params} label="Select Speciality" />}
                    /> */}
                    <AutoCompleteCom
                        listName={'speciality'}
                        data={speciality}
                        // onChange={(e) => setSelectedDiagnosis(e.target.value)}
                        // value={selectedDiagnosis}
                        placeholder={'Select Speciality'}
                        showKey={['index', 'speciality']}
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
                <Box sx={{ width: '40vw' }}>
                    <IconButton color="inherit" onClick={() => setOpenLabTest(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    <LabTest visitID={state?.id} patient_NationalID={state?.patient_NationalID} />
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
            <ModalCustom open={openPrescription} title={'Prescription'}>
                <Box sx={{ width: '40vw' }}>
                    <IconButton
                        color="inherit"
                        onClick={() => setOpenPrescription(false)}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Prescription
                        cname={'Usman'}
                        visitID={state?.id}
                        patient_NationalID={state?.patient_NationalID}
                        consultant_NationalID={state?.consultant_NationalID}
                    />
                </Box>
            </ModalCustom>
            <ModalCustom open={openNotes} title={'Notes'}>
                <Box sx={{ width: '30vw' }}>
                    <IconButton color="inherit" onClick={() => setOpenNotes(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                        <TextField
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            fullWidth
                            label=""
                            variant="outlined"
                            rows={4}
                            multiline
                        />
                        <Button onClick={() => setOpenNotes(false)} variant="text" sx={{ color: 'red' }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                            Save
                        </Button>
                    </Grid>
                </Box>
            </ModalCustom>
            <ModalCustom open={openDiagnosis} title={'Diagnosis'}>
                <Box sx={{ width: '40vw' }}>
                    <IconButton color="inherit" onClick={() => setOpenDiagnosis(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    <Diagnosis cname={'Usman'} visitID={state?.id} patient_NationalID={state?.patient_NationalID} />
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
                            {'Vital Sign'}
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
                                <VitalSign visitID={state?.id} show={true} />
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
                        <Button fullWidth variant="contained" onClick={() => setOpenNotes(true)}>
                            Notes
                        </Button>
                    </Grid>
                    <Grid item lg={1}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: '#FF2E2E', '&: hover': { background: '#c7020c' } }}
                            onClick={() => handleEnd()}
                        >
                            End
                        </Button>
                    </Grid>
                </Grid>
            </MainCard>
        </div>
    );
};

export default MeetingRoom1;
const AutoCompleteCom = memo(({ data, onChange, value, placeholder, showKey, listName }) => {
    return (
        <div style={{ width: '100%' }}>
            <input
                list={listName}
                placeholder={placeholder}
                style={{
                    padding: 10,
                    borderRadius: 10,
                    border: '1px solid #bfc0c2',
                    fontSize: 14,
                    width: '100%',
                    backgroundColor: '#f8fafc'
                }}
                onChange={onChange}
                value={value}
            />
            <datalist id={listName}>{data && data.map((item, index) => <option key={index} value={item} />)}</datalist>
        </div>
    );
});
