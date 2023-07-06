// project imports
import React, { useRef, useState, useEffect, useContext, memo, useCallback } from 'react';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material';
import { BASE_URL } from 'constants/baseUrl';
import useFetch from 'hooks/useFetch';

const DiagnosisComp = () => {
    const {
        data: diagnosis,
        loading: loadingDiagnosis,
        error: errorDiagnosis,
        refetch: refetchDiagnosis
    } = useFetch(`${BASE_URL}api/diagnostic`);

    const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
    const [instruction, setInstruction] = useState('');

    const [diagnosisList, setDiagnosisList] = useState([]);

    const handleAdd = () => {
        const diag = {
            name: selectedDiagnosis,
            instruction: instruction
        };

        setDiagnosisList([...diagnosisList, diag]);
        setSelectedDiagnosis('');
        setInstruction('');
    };

    const handleDelete = (diagnosis) => {
        const newList = diagnosisList?.filter((item) => item.name !== diagnosis);
        setDiagnosisList(newList);
    };

    return (
        <Box sx={{ width: '100%', height: '33vh', backgroundColor: '#66aeff', borderRadius: 3, p: 1 }}>
            {diagnosis && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', flex: 1 }}>
                        <AutoCompleteCom
                            listName={'diagnosis'}
                            data={diagnosis}
                            onChange={(e) => setSelectedDiagnosis(e.target.value)}
                            value={selectedDiagnosis}
                            placeholder={'Select Diagnosis'}
                            showKey={['code', 'name', 'diseaseDiscription']}
                        />
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
                        <Button
                            variant="outlined"
                            onClick={handleAdd}
                            sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#d1e7ff' } }}
                        >
                            Add
                        </Button>
                    </Box>
                </Box>
            )}

            {diagnosis && (
                <Box sx={{ height: '20vh', overflowY: 'scroll' }}>
                    {diagnosisList &&
                        diagnosisList?.map((item) => (
                            <Box sx={{ p: 1, m: 1, borderRadius: 3, backgroundColor: '#eef2f6' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography sx={{ fontWeight: '600', flex: 1 }}>{item?.name}</Typography>
                                    <Button
                                        size="small"
                                        sx={{ p: 0, color: 'red' }}
                                        variant="standard"
                                        onClick={() => handleDelete(item?.name)}
                                    >
                                        Delete
                                    </Button>
                                </Box>

                                {item?.instruction && <Typography>{item?.instruction}</Typography>}
                            </Box>
                        ))}
                </Box>
            )}

            {loadingDiagnosis && (
                <Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <CircularProgress size={35} color="inherit" />
                </Box>
            )}
        </Box>
    );
};

export default DiagnosisComp;

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
                        <option key={index} value={`${item[showKey[0]]} : ${item[showKey[1]]} ( ${item[showKey[2]]} )`} />
                    ))}
            </datalist>
        </div>
    );
});
