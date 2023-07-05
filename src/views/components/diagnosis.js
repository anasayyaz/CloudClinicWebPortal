import React, { useEffect, useState, useRef, memo, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
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
import axios from 'axios';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import LoadingSpinner from './LoadingSpinner';
const Diagnosis = (props) => {
    return (
        <Grid container columnSpacing={2} sx={{ width: '100%', height: '100%' }}>
            {/* -----------------------------  Button Grid */}

            <MedicineComp />
        </Grid>
    );
};
export default Diagnosis;

const MedicineComp = () => {
    const { user } = useSelector((state) => state.user);

    const {
        data: medicine,
        loading: loadingMedicine,
        error: errorMedicine,
        refetch: refetchMedicine
    } = useFetch(`${BASE_URL}api/diagnostic`);

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

    const {
        data: patientPrescription,
        loading: loadingPatientPrescription,
        error: errorPatientPrescription,
        refetch: refetchPatientPrescription
    } = useFetch(`${BASE_URL}api/patientdiagnostic/diagnosticsByPatient/87da3946-30ad-4d8a-995c-8db003b6233c`);

    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedDirection, setSelectedDirection] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [qty, setQty] = useState('');
    const [selectedDoseUnit, setSelectedDoseUnit] = useState('');
    const [instruction, setInstruction] = useState('');

    const [prescriptionList, setPrescriptionList] = useState([]);

    const submitAllPrescriptionHandler = async () => {
        console.log(prescriptionList);
        for (let i = 0; i < prescriptionList.length; i++) {
            await createPrescription(
                prescriptionList[i]?.medicine?.split(': ')[0],
                prescriptionList[i].duration,
                prescriptionList[i].durationUnit,
                prescriptionList[i].route,
                prescriptionList[i].direction,
                prescriptionList[i].frequency,
                prescriptionList[i].dosage,
                prescriptionList[i].doseNum
            );
        }
    };

    const createPrescription = async (medicine, duration, durationUnit, route, direction, frequency, dosage, doseNum) => {
        try {
            const body = {
                MedicineID: medicine,
                DosageInstruction: 'ddd',
                RefilDetails: 'refil',
                medicineName: 'Zostat 50Mg Tab 20 s',
                medicineGenericName: 'Losartan',
                physicianName: 'Dr Usman Bhatti',
                dose: doseNum,
                doseUnit: durationUnit,
                route: route,
                direction: direction,
                frequency: frequency,
                duration: duration,
                durationUnit: durationUnit,
                dosageInstruction: dosage,
                refilDetails: ' refil',
                createdOn: new Date(),
                createdBy: user?.userId,
                // "prescriptionId": 46,
                isDeleted: false,
                medicineID: medicine,
                VisitID: 586,
                Patient_NationalID: '87da3946-30ad-4d8a-995c-8db003b6233c',
                Consultant_NationalID: 'd0616ce6-97f7-4dd0-86b0-857900f1b7af',
                status: 'Continued'
            };
            console.log(body);
            const responseSubmitPrescription = await axios({
                method: 'post',
                url: `${BASE_URL}api/prescription`,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (err) {
            console.error(err.message);
        }
    };
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
        setSelectedFrequency('');
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
            {!loadingMedicine && (
                <>
                    {' '}
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                            <Typography sx={{ color: '#1565c0' }}>Current Diagnosis</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {patientPrescription &&
                                patientPrescription?.map((item) => (
                                    <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography sx={{ fontWeight: '600', flex: 1 }}>{item?.medicineName}</Typography>
                                            <Button
                                                size="small"
                                                sx={{ p: 0, color: 'red' }}
                                                variant="standard"
                                                // onClick={() => handleDelete(item?.medicine)}
                                            >
                                                Discontinue
                                            </Button>
                                        </Box>
                                        <Typography>
                                            {item?.frequency} {item?.duration}
                                        </Typography>

                                        {item?.instruction && <Typography>{item?.instruction}</Typography>}
                                    </Box>
                                ))}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                            <Typography sx={{ color: '#1565c0' }}>Discontinued Diagnosis</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {patientPrescription &&
                                patientPrescription?.map((item) => (
                                    <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography sx={{ fontWeight: '600', flex: 1 }}>{item?.medicineName}</Typography>
                                            <Button
                                                size="small"
                                                sx={{ p: 0, color: 'green' }}
                                                variant="standard"
                                                // onClick={() => handleDelete(item?.medicine)}
                                            >
                                                Continue
                                            </Button>
                                        </Box>
                                        <Typography>
                                            {item?.frequency}
                                            {item?.duration}
                                        </Typography>

                                        {item?.instruction && <Typography>{item?.instruction}</Typography>}
                                    </Box>
                                ))}
                        </AccordionDetails>
                    </Accordion>{' '}
                    {medicine && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
                            <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                                <Box sx={{ display: 'flex', flex: 1 }}>
                                    <AutoCompleteCom
                                        listName={'medicine'}
                                        data={medicine}
                                        onChange={(e) => setSelectedMedicine(e.target.value)}
                                        value={selectedMedicine}
                                        placeholder={'Diagnosis List'}
                                        showKey={['name', 'code', 'diseaseDiscription']}
                                    />
                                </Box>
                                {console.log('Med Inner')}
                            </Box>

                            <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                                <Button variant="outlined" onClick={handleAdd}>
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    )}
                    <Box>
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
                                        {item?.frequency}
                                        {item?.duration}
                                    </Typography>

                                    {item?.instruction && <Typography>{item?.instruction}</Typography>}
                                </Box>
                            ))}

                        <Button sx={{ marginTop: 1 }} variant="outlined" onClick={submitAllPrescriptionHandler}>
                            Submit All
                        </Button>
                    </Box>
                </>
            )}
            {loadingMedicine && (
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                    <CircularProgress size={35} color="primary" />
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
