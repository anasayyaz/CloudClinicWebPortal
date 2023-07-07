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

            <MedicineComp
                visitID={props.visitID}
                patient_NationalID={props.patient_NationalID}
                consultant_NationalID={props.consultant_NationalID}
            />
        </Grid>
    );
};
export default Diagnosis;

const MedicineComp = (props) => {
    const { user } = useSelector((state) => state.user);

    const {
        data: diagnosis,
        loading: loadingDiagnosis,
        error: errorDiagnosis,
        refetch: refetchDiagnosis
    } = useFetch(`${BASE_URL}api/diagnostic`);

    const {
        data: patientDiagnosis,
        loading: loadingPatientDiagnosis,
        error: errorPatientPrescription,
        refetch: refetchPatientDiagnosis
    } = useFetch(`${BASE_URL}api/patientdiagnostic/diagnosticsByPatient/${props.patient_NationalID}`);

    const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
    const [loadingContinue, setLoadingcontinue] = useState(false);
    const [loadingDiscontinue, setLoadingDiscontinue] = useState(false);

    const [diagnosisList, setDiagnosisList] = useState([]);

    const submitAllDiagnosisHandler = async () => {
        console.log(diagnosisList);
        for (let i = 0; i < diagnosisList.length; i++) {
            await createDiagnosis(diagnosisList[i]?.diagnosis?.split(': ')[0]);
        }
        refetchPatientDiagnosis();
    };
    const discontinueDiagnosis = async (diagnosisCode) => {
        setLoadingDiscontinue(true);
        try {
            const del = await fetch(`${BASE_URL}api/patientdiagnostic/${diagnosisCode}`, {
                method: 'DELETE',
                data: {
                    deletedBy: user?.userId,
                    deletedOn: new Date()
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (err) {
            console.error(err.message);
            setLoadingDiscontinue(false);
        }
        setLoadingDiscontinue(false);
        refetchPatientDiagnosis();
    };

    const continueDiagnosis = async (item) => {
        setLoadingcontinue(true);
        try {
            const body = {
                lastModifiedOn: new Date(),
                lastModifiedBy: user?.userId,

                VisitID: props.visitID,
                Patient_NationalID: props.patient_NationalID,
                Consultant_NationalID: props.consultant_NationalID,
                status: 'Continued',
                isDeleted: false
            };
            console.log(body);
            const responseSubmitDiagnosis = await axios({
                method: 'put',
                url: `${BASE_URL}api/patientdiagnostic/${item.id}`,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (err) {
            console.error(err.message);
            setLoadingcontinue(false);
        }
        refetchPatientDiagnosis();
        setLoadingcontinue(false);
    };
    const createDiagnosis = async (code) => {
        console.log(code);
        try {
            const body = {
                createdOn: new Date(),
                createdBy: user?.userId,
                isDeleted: false,
                VisitID: props.visitID,
                Patient_NationalID: props.patient_NationalID,
                Consultant_NationalID: props.consultant_NationalID,
                status: 'Continued',
                code: code
            };
            console.log(body);
            const responseSubmitDiagnosis = await axios({
                method: 'post',
                url: `${BASE_URL}api/patientdiagnostic`,
                data: body,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (err) {
            console.error(err.message);
        }
        setDiagnosisList([]);
    };
    const handleAdd = () => {
        const diagnosis = {
            diagnosis: selectedDiagnosis
        };

        setDiagnosisList([...diagnosisList, diagnosis]);
    };

    const handleDelete = (diagnosis) => {
        const newList = diagnosisList?.filter((item) => item.diagnosis !== diagnosis);
        setDiagnosisList(newList);
    };

    return (
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 3, p: 1 }}>
            {!loadingDiagnosis && (
                <>
                    {' '}
                    <Accordion>
                        <AccordionSummary
                            sx={{ backgroundColor: '#0E86D4', borderRadius: 3 }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography sx={{ color: 'white', fontWeight: '600' }}>Current Diagnosis</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {patientDiagnosis &&
                                patientDiagnosis?.map((item) => (
                                    <>
                                        {' '}
                                        {item?.status == 'Continued' && (
                                            <>
                                                <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography sx={{ fontWeight: '600', flex: 1 }}>
                                                            {item?.name} {item?.diseaseDiscription}
                                                        </Typography>
                                                        {!loadingDiscontinue && (
                                                            <Button
                                                                size="small"
                                                                sx={{ p: 0, color: 'red' }}
                                                                variant="standard"
                                                                onClick={() => discontinueDiagnosis(item?.id)}
                                                            >
                                                                Discontinue
                                                            </Button>
                                                        )}
                                                        {loadingDiscontinue && <CircularProgress size={25} color="primary" />}
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </>
                                ))}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            sx={{ backgroundColor: '#0E86D4', borderRadius: 3 }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography sx={{ color: 'white', fontWeight: '600' }}>Discontinued Diagnosis</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {patientDiagnosis &&
                                patientDiagnosis?.map((item) => (
                                    <>
                                        {' '}
                                        {item?.status == 'Discontinued' && (
                                            <>
                                                <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography sx={{ fontWeight: '600', flex: 1 }}>
                                                            {item?.name} {item?.diseaseDiscription}
                                                        </Typography>{' '}
                                                        {!loadingContinue && (
                                                            <Button
                                                                size="small"
                                                                sx={{ p: 0, color: 'green' }}
                                                                variant="standard"
                                                                onClick={() => continueDiagnosis(item)}
                                                            >
                                                                Continue
                                                            </Button>
                                                        )}
                                                        {loadingContinue && <CircularProgress size={25} color="primary" />}
                                                    </Box>
                                                </Box>
                                            </>
                                        )}
                                    </>
                                ))}
                        </AccordionDetails>
                    </Accordion>{' '}
                    {diagnosis && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
                            <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                                <Box sx={{ display: 'flex', flex: 1 }}>
                                    <AutoCompleteCom
                                        listName={'diagnosis'}
                                        data={diagnosis}
                                        onChange={(e) => setSelectedDiagnosis(e.target.value)}
                                        value={selectedDiagnosis}
                                        placeholder={'Diagnosis List'}
                                        showKey={['code', 'name', 'diseaseDiscription']}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                                <Button variant="outlined" onClick={handleAdd}>
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    )}
                    <Box>
                        {diagnosisList &&
                            diagnosisList?.map((item) => (
                                <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <Typography sx={{ fontWeight: '600', flex: 1 }}>{item?.diagnosis}</Typography>
                                        <Button
                                            size="small"
                                            sx={{ p: 0, color: 'red' }}
                                            variant="standard"
                                            onClick={() => handleDelete(item?.diagnosis)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            ))}
                        {diagnosisList.length > 0 && (
                            <Button sx={{ marginTop: 1 }} variant="outlined" onClick={submitAllDiagnosisHandler}>
                                Submit All
                            </Button>
                        )}
                    </Box>
                </>
            )}
            {loadingDiagnosis && (
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
                            value={`${item[showKey[0]]} ${listName == 'diagnosis' ? `: ${item[showKey[1]]} ( ${item[showKey[2]]} )` : ''}`}
                        />
                    ))}
            </datalist>
        </div>
    );
});
