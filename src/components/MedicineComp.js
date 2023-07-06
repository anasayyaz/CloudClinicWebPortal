// project imports
import React, { useRef, useState, useEffect, useContext, memo, useCallback } from 'react';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from '@mui/material';
import { BASE_URL } from 'constants/baseUrl';
import useFetch from 'hooks/useFetch';

const MedicineComp = () => {
    // const {
    //     data: medicine,
    //     loading: loadingMedicine,
    //     error: errorMedicine,
    //     refetch: refetchMedicine
    // } = useFetch(`${BASE_URL}api/medicine`);

    const medicine = JSON.parse(localStorage.getItem('medicine'));

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
        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#66aeff', borderRadius: 3, p: 1 }}>
            {medicine && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', flex: 1, gap: 1 }}>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <AutoCompleteCom
                                listName={'medicine'}
                                data={medicine}
                                onChange={(e) => setSelectedMedicine(e.target.value)}
                                value={selectedMedicine}
                                placeholder={'Select Medicine'}
                                showKey={['medicineID', 'name', 'genericName']}
                            />
                        </Box>
                        {console.log('Med Inner')}

                        <Box sx={{ display: 'flex', flex: 1, mb: -0.5 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{
                                            color: '#fff',
                                            '&.Mui-checked': {
                                                color: '#fff'
                                            }
                                        }}
                                        checked={selectedFrequency?.morning}
                                        onChange={(e) => setSelectedFrequency({ ...selectedFrequency, morning: e.target.checked })}
                                    />
                                }
                                label={selectedFrequency?.morning ? '1' : '0'}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{
                                            color: '#fff',
                                            '&.Mui-checked': {
                                                color: '#fff'
                                            }
                                        }}
                                        checked={selectedFrequency?.evening}
                                        onChange={(e) => setSelectedFrequency({ ...selectedFrequency, evening: e.target.checked })}
                                    />
                                }
                                label={selectedFrequency?.evening ? '1' : '0'}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        sx={{
                                            color: '#fff',
                                            '&.Mui-checked': {
                                                color: '#fff'
                                            }
                                        }}
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

            {medicine && (
                <Box sx={{ height: '34.5vh', overflowY: 'scroll' }}>
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
            )}

            {loadingRoute && (
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

export default MedicineComp;

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
