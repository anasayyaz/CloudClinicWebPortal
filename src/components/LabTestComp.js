// project imports
import React, { useRef, useState, useEffect, useContext, memo, useCallback } from 'react';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material';
import { BASE_URL } from 'constants/baseUrl';
import useFetch from 'hooks/useFetch';
import { getData } from 'utils/indexedDB';

const LabTestComp = () => {
    const [labTestType, setLabTestType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData('labTestType').then((res) => {
            setLabTestType(res);
            setLoading(false);
        });
    }, []);

    const [selectedLabTest, setSelectedLabTest] = useState('');

    const [labTestList, setLabTestList] = useState([]);

    const handleAdd = () => {
        const lab = {
            name: selectedLabTest
        };

        setLabTestList([...labTestList, lab]);
        setSelectedLabTest('');
    };

    const handleDelete = (labTest) => {
        const newList = labTestList?.filter((item) => item.name !== labTest);
        setLabTestList(newList);
    };

    return (
        <Box sx={{ width: '100%', height: '25vh', backgroundColor: '#66aeff', borderRadius: 3, p: 1 }}>
            {labTestType && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <AutoCompleteCom
                        listName={'labTestType'}
                        data={labTestType}
                        onChange={(e) => setSelectedLabTest(e.target.value)}
                        value={selectedLabTest}
                        placeholder={'Select Lab Test'}
                        showKey={['code', 'test']}
                        onClick={() => console.log('hello kjk ')}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleAdd}
                        sx={{ backgroundColor: '#fff', '&:hover': { backgroundColor: '#d1e7ff' } }}
                    >
                        Add
                    </Button>
                </Box>
            )}

            {labTestType && (
                <Box sx={{ height: '18vh', overflowY: 'scroll' }}>
                    {labTestList &&
                        labTestList?.map((item) => (
                            <Box sx={{ p: 1, m: 1, borderRadius: 2, backgroundColor: '#eef2f6' }}>
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
                            </Box>
                        ))}
                </Box>
            )}

            {loading && (
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

export default LabTestComp;

const AutoCompleteCom = memo(({ data, onChange, value, placeholder, showKey, listName, onClick }) => {
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
                {data && data.map((item, index) => <option key={index} value={`${item[showKey[0]]} : ${item[showKey[1]]}`} />)}
            </datalist>
        </div>
    );
});
