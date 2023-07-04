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
// ==============================|| SAMPLE PAGE ||============================== //
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
}));

const MeetingRoom2 = () => {
    const {
        data: locationList1,
        loading: loadingLocationList1,
        error: errorLocationList1,
        refetch: refetchLocationList1
    } = useFetch(`${BASE_URL}api/patient?pageNumber=1&pageSize=20&QuerySearch=`);

    const {
        data: locationList2,
        loading: loadingLocationList2,
        error: errorLocationList2,
        refetch: refetchLocationList2
    } = useFetch(`${BASE_URL}api/physician?pageNumber=1&pageSize=20&QuerySearch=`);

    const {
        data: locationList3,
        loading: loadingLocationList3,
        error: errorLocationList3,
        refetch: refetchLocationList3
    } = useFetch(`${BASE_URL}api/location?pageNumber=1&pageSize=20&QuerySearch=`);

    const {
        data: locationList5,
        loading: loadingLocationList5,
        error: errorLocationList5,
        refetch: refetchLocationList5
    } = useFetch(`${BASE_URL}api/labtestType?pageNumber=1&pageSize=20&QuerySearch=`);

    const {
        data: locationList6,
        loading: loadingLocationList6,
        error: errorLocationList6,
        refetch: refetchLocationList6
    } = useFetch(`${BASE_URL}api/ward?pageNumber=1&pageSize=20&QuerySearch=`);

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
                            <Grid item lg={3} md={4} sm={4} sx={{ display: 'flex' }}>
                                <Box sx={{ width: 55, height: 55, borderRadius: 55 / 2, backgroundColor: 'gray' }}></Box>

                                <Box sx={{ ml: 2 }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: '600' }}>Waseem Javed</Typography>
                                    <Typography sx={{ fontSize: 12 }}>Gender: Male</Typography>
                                    <Typography sx={{ fontSize: 12 }}>Age: 27</Typography>
                                </Box>
                            </Grid>

                            <Grid item lg={5} md={8} sm={8}>
                                <Typography sx={{ fontSize: 16 }}>Cough and Fever</Typography>
                                <Typography sx={{ fontSize: 13 }}>
                                    Patient have cough and fever from last 4 days and also headache
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item lg={12} md={12} sm={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={12} sm={12}>
                                <Grid container spacing={2} sx={{ height: 517 }}>
                                    <Grid item lg={12} md={6} sm={6}>
                                        <LabTestComp />
                                    </Grid>

                                    <Grid item lg={12} md={6} sm={6}>
                                        <DiagnosisComp />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={6} md={12} sm={12} sx={{ height: 517 }}>
                                <MedicineComp />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={4}>
                <Grid container spacing={2} sx={{ mr: -2 }}>
                    <Grid item lg={12} sx={{ height: 240 }}>
                        <Box sx={{ backgroundColor: 'green', width: '105%', height: '100%' }} />
                    </Grid>

                    <Grid item lg={12} sx={{ height: 330 }}>
                        <Box sx={{ backgroundColor: 'blue', width: '105%', height: '100%' }} />
                    </Grid>

                    <Grid item lg={12}>
                        <Box sx={{ backgroundColor: 'red', display: 'flex', direction: 'row', flex: 1, gap: 2 }}>
                            <CustomButton title="Save" />

                            <CustomButton title="End Meeting" />
                        </Box>
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

const LabTestComp = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 3, p: 1 }}>
            <Box sx={{ display: 'flex', direction: 'row', gap: 1 }}>
                <TextField fullWidth variant="outlined" placeholder="Select Lab Test" size="small" />
                <Button variant="outlined">Add</Button>
            </Box>
        </Box>
    );
};

const DiagnosisComp = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 3, p: 1 }}>
            <Box sx={{ display: 'flex', direction: 'row', gap: 1 }}>
                <TextField fullWidth variant="outlined" placeholder="Select Diagnosis" size="small" />
                <Button variant="outlined">Add</Button>
            </Box>
        </Box>
    );
};

const MedicineComp = () => {
    const {
        data: medicine,
        loading: loadingMedicine,
        error: errorMedicine,
        refetch: refetchMedicine
    } = useFetch(`${BASE_URL}api/medicine`);

    // let medicine = [{ medicineID: 1, name: '123123', genericName: '123123' }];

    const {
        data: route,
        loading: loadingRoute,
        error: errorRoute,
        refetch: refetchRoute
    } = useFetch(`${BASE_URL}api/SetupItem/GetByType/route`);

    const {
        data: direction,
        loading: loadingDirection,
        error: errorDirection,
        refetch: refetchDirection
    } = useFetch(`${BASE_URL}api/SetupItem/GetByType/direction`);

    const {
        data: frequency,
        loading: loadingFrequency,
        error: errorFrequency,
        refetch: refetchFrequency
    } = useFetch(`${BASE_URL}api/SetupItem/GetByType/frequency`);

    const {
        data: duration,
        loading: loadingDuration,
        error: errorDuration,
        refetch: refetchDuration
    } = useFetch(`${BASE_URL}api/SetupItem/GetByType/duration`);

    const {
        data: doseUnit,
        loading: loadingDoseUnit,
        error: errorDoseUnit,
        refetch: refetchDoseUnit
    } = useFetch(`${BASE_URL}api/SetupItem/GetByType/doseunit`);

    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState({ morning: true, evening: true, night: true });
    const [selectedDuration, setSelectedDuration] = useState('');
    const [qty, setQty] = useState('');
    const [selectedDoseUnit, setSelectedDoseUnit] = useState('');
    const [instruction, setInstruction] = useState('');

    const [prescriptionList, setPrescriptionList] = useState([]);

    const handleAdd = () => {
        const prescription = {
            medicine: selectedMedicine,
            route: selectedRoute,
            direction: selectedDirection,
            duration: selectedDuration,
            frequency: selectedFrequency,
            doseUnit: `${qty} ${selectedDoseUnit}`,
            instruction: instruction
        };

        setPrescriptionList([...prescriptionList, prescription]);
        setSelectedMedicine('');
        setSelectedDirection('');
        setSelectedDoseUnit('');
        setSelectedFrequency({ morning: true, evening: true, night: true });
        setSelectedDuration('');
        setInstruction('');
        setSelectedRoute('');
        setQty('');
    };

    const handleDelete = (medicine) => {
        const newList = prescriptionList?.filter((item) => item.medicine !== medicine);
        setPrescriptionList(newList);
    };

    const handleSelectedRoute = useCallback((e) => setSelectedRoute(e.target.value), []);

    return (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 3, p: 1 }}>
            {medicine && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <AutoCompleteCom
                                listName={'medicine'}
                                data={medicine}
                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                value={selectedMedicine}
                                placeholder={'Medicine List'}
                                showKey={['medicineID', 'name', 'genericName']}
                            />
                        </Box>
                        {console.log('Med Inner')}

                        <Box sx={{ display: 'flex', flex: 1, mb: -0.5 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedFrequency?.morning}
                                        onChange={(e) => setSelectedFrequency({ ...selectedFrequency, morning: e.target.checked })}
                                    />
                                }
                                label={selectedFrequency?.morning ? '1' : '0'}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedFrequency?.evening}
                                        onChange={(e) => setSelectedFrequency({ ...selectedFrequency, evening: e.target.checked })}
                                    />
                                }
                                label={selectedFrequency?.evening ? '1' : '0'}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedFrequency?.night}
                                        onChange={(e) => setSelectedFrequency({ ...selectedFrequency, night: e.target.checked })}
                                    />
                                }
                                label={selectedFrequency?.night ? '1' : '0'}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <AutoCompleteCom
                                listName={'route'}
                                data={route}
                                value={selectedRoute}
                                onChange={handleSelectedRoute}
                                placeholder={'Route'}
                                showKey={['title']}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <AutoCompleteCom
                                listName={'direction'}
                                data={direction}
                                value={selectedDirection}
                                onChange={(e) => setSelectedDirection(e.target.value)}
                                placeholder={'Direction'}
                                showKey={['title']}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <AutoCompleteCom
                                listName={'duration'}
                                data={duration}
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                                placeholder={'Duration'}
                                showKey={['title']}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                            <input
                                type="number"
                                placeholder={'Quantity'}
                                onChange={(e) => setQty(e.target.value)}
                                value={qty}
                                style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    border: '1px solid #bfc0c2',
                                    fontSize: 14,
                                    width: '100%',
                                    backgroundColor: '#f8fafc'
                                }}
                            />
                            <AutoCompleteCom
                                listName={'doseUnit'}
                                data={doseUnit}
                                value={selectedDoseUnit}
                                onChange={(e) => setSelectedDoseUnit(e.target.value)}
                                placeholder={'Dose Unit'}
                                showKey={['title']}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                        <input
                            placeholder={'Instruction'}
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                border: '1px solid #bfc0c2',
                                fontSize: 14,
                                width: '100%',
                                backgroundColor: '#f8fafc'
                            }}
                        />
                        <Button variant="outlined" onClick={handleAdd}>
                            Add
                        </Button>
                    </Box>
                </Box>
            )}

            <Box sx={{ height: 300, overflowY: 'scroll' }}>
                {prescriptionList &&
                    prescriptionList?.map((item) => (
                        <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                            <Box sx={{ display: 'flex' }}>
                                <Typography sx={{ fontWeight: '600', flex: 1 }}>{item?.medicine}</Typography>
                                <Button
                                    size="small"
                                    sx={{ p: 0, color: 'red' }}
                                    variant="standard"
                                    onClick={() => handleDelete(item?.medicine)}
                                >
                                    Delete
                                </Button>
                            </Box>
                            <Typography>
                                {item?.frequency?.morning == true ? '1' : '0'}-{item?.frequency?.evening == true ? '1' : '0'}-{''}
                                {item?.frequency?.night == true ? '1' : '0'} | {item?.route} - {item?.doseUnit} {item?.direction}{' '}
                                {item?.duration}
                            </Typography>

                            {item?.instruction && <Typography>{item?.instruction}</Typography>}
                        </Box>
                    ))}
            </Box>

            {loadingMedicine && (
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <CircularProgress size={35} color="inherit" />
                </Box>
            )}
        </Box>
    );
};

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
            <datalist id={listName}>
                {data &&
                    data.map((item, index) => (
                        <option
                            key={index}
                            value={`${item[showKey[0]]} ${listName == 'medicine' ? `: ${item[showKey[1]]} ( ${item[showKey[2]]} )` : ''}`}
                        />
                    ))}
            </datalist>
        </div>
    );
});
