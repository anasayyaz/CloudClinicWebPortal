import { useSelector } from 'react-redux';
import { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    LinearProgress,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
import CloseIcon from '@mui/icons-material/Close';
// ==============================|| VitalSign ||============================== //
import ModalCustom from 'ui-component/modals/ModalCustom';
import BloodPressureGraph from 'views/graph/BloodPressureGraph';
import SPO2Graph from 'views/graph/SPO2Graph';
import HRGraph from 'views/graph/HRGraph';
import MapGraph from 'views/graph/MeanArterialPressureGraph';
import PRGraph from 'views/graph/PRGraph';
import PIGraph from 'views/graph/PIGraph';
import QTCGraph from 'views/graph/QTCGraph';
import QRSGraph from 'views/graph/QTCGraph';
import QTGraph from 'views/graph/QTGraph';
import TempGraph from 'views/graph/TempGraph';
import Canvas from 'views/graph/Canvas';
const VitalSign = (props) => {
    const [modalIsOpenBPModal, setIsOpenBPModal] = useState(false);
    const [modalIsOpenMAPModal, setIsOpenMAPModal] = useState(false);
    const [modalIsOpenPRModal, setIsOpenPRModal] = useState(false);
    const [modalIsOpenQTModal, setIsOpenQTModal] = useState(false);
    const [modalIsOpenQRSModal, setIsOpenQRSModal] = useState(false);
    const [modalIsOpenQTCModal, setIsOpenQTCModal] = useState(false);
    const [modalIsOpenHRModal, setIsOpenHRModal] = useState(false);
    const [modalIsOpenPIModal, setIsOpenPIModal] = useState(false);
    const [modalIsOpenSPO2Modal, setIsOpenSPO2Modal] = useState(false);
    const [modalIsOpenTempModal, setIsOpenTempModal] = useState(false);
    const [modalIsOpenEcgGraph, setIsOpenEcgGraph] = useState(false);
    const {
        data: vitalSignData,
        loading: loadingvitalSignData,
        error: errorvitalSignData,
        refetch: refetchvitalSignData
    } = useFetch(`${BASE_URL}api/vitalsign/getPatientVitalSignbyVisit/${props.visitID}`);
    return (
        <div>
            {!!vitalSignData && (
                <>
                    <ModalCustom open={modalIsOpenBPModal} title={'Blood Pressure Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenBPModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <BloodPressureGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenMAPModal} title={'Mean Arteiral Pressure Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenMAPModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <MapGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenPRModal} title={'Pulse Rate Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenPRModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <PRGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenPIModal} title={'Perfusion Index Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenPIModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <PIGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenQTModal} title={'QT Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenQTModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <QTGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenQTCModal} title={'QTc Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenQTCModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <QTCGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenQRSModal} title={'QRS Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenQRSModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <QRSGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenHRModal} title={'Heart Rate Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenHRModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <HRGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenSPO2Modal} title={'SPO2 Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenSPO2Modal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <SPO2Graph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenTempModal} title={'Temperature Graph'}>
                        <Box sx={{ width: '50vw' }}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenTempModal(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <TempGraph patient_id={vitalSignData.patient_NationalID} />
                        </Box>
                    </ModalCustom>
                    <ModalCustom open={modalIsOpenEcgGraph} title={'ECG Graph'}>
                        <Box>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsOpenEcgGraph(false)}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <Canvas modal={setIsOpenEcgGraph} cw={'50vw'} ch={'50vh'} />
                        </Box>
                    </ModalCustom>
                </>
            )}
            {!!vitalSignData && (
                <Grid
                    lg={12}
                    xs={12}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        justifyContent: 'space-between',
                        backgroundColor: '#636f83',
                        border: 5,
                        borderColor: '#DDE6ED',
                        borderRadius: 3,
                        p: 1
                    }}
                >
                    <Grid container lg={12} sx={{ backgroundColor: '#636f83', borderRadius: 1 }}>
                        {props.show && (
                            <>
                                <Grid item lg={6} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                                    {' '}
                                    <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                        Gender: <span style={{ color: '#E7FFC2', p: 1 }}>Male</span>
                                    </Typography>
                                </Grid>
                                <Grid item lg={6} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                                    {' '}
                                    <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                        Age: <span style={{ color: '#E7FFC2', p: 1 }}>28 </span>
                                        <small>(years)</small>
                                    </Typography>
                                </Grid>
                            </>
                        )}

                        <Grid item lg={6}>
                            {' '}
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Weight: <span style={{ color: '#E7FFC2', p: 1 }}>{vitalSignData.weight} </span>
                                <small>(lbs)</small>
                            </Typography>
                        </Grid>
                        <Grid item lg={6}>
                            <Typography variant="h6" component="h2" sx={{ color: 'white', p: 1 }}>
                                Height: <span style={{ color: '#E7FFC2', p: 1 }}>{vitalSignData.height} </span>
                                <small>(standard)</small>
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container lg={12} sx={{ backgroundColor: '#424949', borderRadius: 1 }}>
                        <Grid item lg={12} sx={{ borderBottom: 2, borderColor: '#636f83' }}>
                            {' '}
                            <Typography variant="h4" component="h2" sx={{ color: 'white', p: 1 }}>
                                NIBP <small>Oscillometric mmHg</small>
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenBPModal((modalIsOpenBPModal) => !modalIsOpenBPModal)}
                            >
                                SYS:&nbsp; <span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.sys} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenBPModal((modalIsOpenBPModal) => !modalIsOpenBPModal)}
                            >
                                DIA:&nbsp; <span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.dia} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={3}>
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1, ml: -1 }}
                                onClick={() => setIsOpenMAPModal((modalIsOpenMAPModal) => !modalIsOpenMAPModal)}
                            >
                                MAP: &nbsp;<span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.map} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={3}>
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenPRModal((modalIsOpenPRModal) => !modalIsOpenPRModal)}
                            >
                                PR: &nbsp;<span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.pr} </span>
                                &nbsp;<small> /min</small>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container lg={12} sx={{ backgroundColor: '#424949', mt: 1, borderRadius: 1 }}>
                        <Grid item lg={12} sx={{ borderBottom: 2, borderColor: '#636f83' }}>
                            {' '}
                            <Button
                                variant="h5"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenTempModal((modalIsOpenTempModal) => !modalIsOpenPRModal)}
                            >
                                TEMP: &nbsp;<span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.temp} </span>&nbsp;
                                <small>°F</small>
                            </Button>
                        </Grid>
                        <Grid item lg={4}>
                            {' '}
                            <Button
                                variant="h5"
                                component="h2"
                                sx={{ color: 'white', p: 1, '&: hover': { backgroundColor: '#265427' } }}
                                onClick={() => setIsOpenSPO2Modal((modalIsOpenSPO2Modal) => !modalIsOpenSPO2Modal)}
                            >
                                SPO2:&nbsp; <span style={{ color: '#AFE6FF', p: 1 }}> {vitalSignData.spO2} </span> &nbsp;<small>%</small>
                            </Button>
                        </Grid>
                        <Grid item lg={4}>
                            {' '}
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenPIModal((modalIsOpenPIModal) => !modalIsOpenPIModal)}
                            >
                                PI: &nbsp;<span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.pi} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={4}>
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenPRModal((modalIsOpenPRModal) => !modalIsOpenPRModal)}
                            >
                                PR: &nbsp;<span style={{ color: '#AFE6FF', p: 1 }}>{vitalSignData.pr} </span>&nbsp;
                                <small> /min</small>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container lg={12} sx={{ backgroundColor: '#636f83', borderRadius: 1 }}>
                        <Grid item lg={10} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography variant="h4" component="h2" sx={{ color: '#E7FFC2', p: 1 }}>
                                ECG{' '}
                                <span style={{ color: 'white', fontSize: '12px' }}>
                                    {' '}
                                    {vitalSignData.ma == 0 ? '( Regular ECG Rhythm )' : 'Irreglar ECG Rhythm'}{' '}
                                </span>
                            </Typography>
                        </Grid>
                        <Grid item lg={1} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            <Typography variant="h6" component="h2" sx={{ color: '#E7FFC2', p: 1 }}>
                                {' '}
                                {vitalSignData.ma == 0 ? <MoodIcon sx={{ fontSize: 20 }} /> : <MoodBadIcon sx={{ fontSize: 20 }} />}
                            </Typography>
                        </Grid>
                        <Grid item lg={1} sx={{ borderBottom: 2, borderColor: '#424949' }}>
                            {' '}
                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{ color: '#E7FFC2', p: 1, '&:hover': { cursor: 'pointer' } }}
                                onClick={() => setIsOpenEcgGraph((modalIsOpenEcgGraph) => !modalIsOpenEcgGraph)}
                            >
                                <PlayCircleOutlineIcon sx={{ fontSize: 20 }} />
                            </Typography>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenQTModal((modalIsOpenQTModal) => !modalIsOpenQTModal)}
                            >
                                QT:&nbsp; <span style={{ color: '#E7FFC2', p: 1 }}>{vitalSignData.qt} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={3}>
                            {' '}
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenQRSModal((modalIsOpenQRSModal) => !modalIsOpenQRSModal)}
                            >
                                QRs: &nbsp;<span style={{ color: '#E7FFC2', p: 1 }}>{vitalSignData.qrs} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={3}>
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenQTCModal((modalIsOpenQTCModal) => !modalIsOpenQTCModal)}
                            >
                                Qtc: &nbsp;<span style={{ color: '#E7FFC2', p: 1 }}>{vitalSignData.qtc} </span>
                            </Button>
                        </Grid>
                        <Grid item lg={3}>
                            <Button
                                variant="h6"
                                component="h2"
                                sx={{ color: 'white', p: 1 }}
                                onClick={() => setIsOpenHRModal((modalIsOpenHRModal) => !modalIsOpenHRModal)}
                            >
                                HR:&nbsp; <span style={{ color: '#E7FFC2', p: 1 }}>{vitalSignData.hr} </span>
                                &nbsp;<small>/Min</small>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {/* {loadingvitalSignData && (
                <LinearProgress
                    color="primary"
                    style={{ display: 'flex', justifyContent: 'end', alignItems: 'end', height: '1vh' }}
                    size={5}
                />
            )} */}
        </div>
    );
};

export default VitalSign;
