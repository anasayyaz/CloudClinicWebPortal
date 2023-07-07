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
const LabTest = (props) => {
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
export default LabTest;

const MedicineComp = (props) => {
    const { user } = useSelector((state) => state.user);

    const {
        data: diagnosis,
        loading: loadingDiagnosis,
        error: errorDiagnosis,
        refetch: refetchDiagnosis
    } = useFetch(`${BASE_URL}api/LabTestType`);

    const {
        data: patientDiagnosis,
        loading: loadingPatientDiagnosis,
        error: errorPatientPrescription,
        refetch: refetchPatientDiagnosis
    } = useFetch(`${BASE_URL}api/VisitLabTest/GetByVisit/${props.visitID}`);

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
                LabTestTypeID: code
            };
            console.log(body);
            const responseSubmitDiagnosis = await axios({
                method: 'post',
                url: `${BASE_URL}api/VisitLabTest`,
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
                            <Typography sx={{ color: 'white', fontWeight: '600' }}>Recommended Lab Tests</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {patientDiagnosis &&
                                patientDiagnosis?.map((item) => (
                                    <>
                                        {' '}
                                        <>
                                            <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                                <Box sx={{ display: 'flex' }}>
                                                    <Typography sx={{ fontWeight: '600', flex: 1 }}>
                                                        {item?.type}
                                                        {': '} {item?.test}
                                                    </Typography>
                                                    {/* {!loadingDiscontinue && (
                                                        <Button
                                                            size="small"
                                                            sx={{ p: 0, color: 'red' }}
                                                            variant="standard"
                                                            onClick={() => discontinueDiagnosis(item?.id)}
                                                        >
                                                            Discontinue
                                                        </Button>
                                                    )}
                                                    {loadingDiscontinue && <CircularProgress size={25} color="primary" />} */}
                                                </Box>
                                            </Box>
                                        </>
                                    </>
                                ))}
                        </AccordionDetails>
                    </Accordion>
                    {diagnosis && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
                            <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                                <Box sx={{ display: 'flex', flex: 1 }}>
                                    <AutoCompleteCom
                                        listName={'diagnosis'}
                                        data={diagnosis}
                                        onChange={(e) => setSelectedDiagnosis(e.target.value)}
                                        value={selectedDiagnosis}
                                        placeholder={'Lab Test List'}
                                        showKey={['labTestTypeID', 'type', 'test']}
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
