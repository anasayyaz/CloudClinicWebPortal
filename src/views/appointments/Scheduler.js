import React, { useState, useEffect } from 'react';

import { Form, Formik } from 'formik';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// -----------------  Importing Icons
import { IconPlus } from '@tabler/icons';
import PrintIcon from '@mui/icons-material/Print';

// -----------------  Importing Constants
import { COLORS } from 'constants/colors';
import { BASE_URL } from 'constants/baseUrl';

// -----------------  Utilis
import { profileImage } from 'utils/fetchImage';
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchField from 'ui-component/FormUI/SearchField.js';
import useFetch from 'hooks/useFetch';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import ModalCustom from 'ui-component/modals/ModalCustom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import Textfield from 'ui-component/FormUI/Textfield';
import DateTimePicker from 'ui-component/FormUI/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { current } from '@reduxjs/toolkit';
const localizer = momentLocalizer(moment);
export default function Scheduler() {
    const { user } = useSelector((state) => state?.user);

    const navigate = useNavigate();

    const [visitList, setVisitList] = useState(null);
    const [modalAdd, setModalAdd] = useState({ open: false, value: null });
    const [modalEdit, setModalEdit] = useState({ open: false, value: null, data: null });
    const [currentDate, setCurrentDate] = React.useState(new Date().toLocaleDateString('en-US'));
    const [newStartDatePicker, setNewStartDatePicker] = React.useState(new Date().toLocaleDateString('en-US'));
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [Patient, setPatient] = React.useState(null);
    const [Consultant, setConsultant] = React.useState(null);

    const [calendarEvent, setCalendarEvent] = useState({
        Id: '',
        Title: '',
        SummaryNotes: '',
        StartDate: '',
        EndDate: '',
        consultant_NationalID: '',
        patient_NationalID: '',
        calendarID: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    function handleStartDateChange(e) {
        if (e < currentDate) {
            setStartDatePast(true);
        } else {
            setNewStartDatePicker(e);
            // console.log(e);
        }
    }
    const addEvent = (event, start, end, allDay) => {
        setCalendarEvent({
            StartDate: start,
            EndDate: end
        });
        alert(Patient);
        setModalAdd({ open: true, value: 'add' });
    };
    const editEvent = (event, start, end, allDay) => {
        console.log(event);
        setCalendarEvent({
            StartDate: start,
            EndDate: end
        });
        alert(start);
        alert(end);
        setModalEdit({ open: true, value: 'add', data: event });
    };
    const getVisitList = async () => {
        try {
            setLoading(true);
            setError(null);
            setVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/primaryCareVisitsList/ada6189b-3222-4f0a-aae5-0409096dde03?pageNumber=1&pageSize=1000&QuerySearch=&IsConfirm=`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            let newArr = [];
            res.data.items.map((item) => {
                let visitObj = {};
                visitObj.id = item.id;
                visitObj.start = new Date(item.startDateTime);
                visitObj.end = new Date(item.endDateTime);
                visitObj.title = item.title;
                visitObj.nationalID = item.consultant_NationalID;
                visitObj.hexColor = item.colorCode;
                visitObj.physician = item.consultantFirstName;
                if (item.isDeleted === false) {
                    newArr.push(visitObj);
                }
            });

            setVisitList(newArr);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    const {
        data: patientDataList,
        loading: loadingpatientDataList,
        error: errorpatientDataList,
        refetch: refetchpatientDataList
    } = useFetch(`${BASE_URL}api/patient/patientSelectList?pageNumber=1&pageSize=100&QuerySearch=`);

    const {
        data: physicianDataList,
        loading: loadingphysicianDataList,
        error: errorphysicianDataList,
        refetch: refetchphysicianDataList
    } = useFetch(`${BASE_URL}api/physician/physicianSelectList?pageNumber=1&pageSize=100&QuerySearch=`);
    useEffect(() => {
        getVisitList();
    }, []);

    const handleRequest = async (values, resetForm) => {
        setLoadingRequest(true);
        try {
            const data = {
                Title: values.title,
                Patient_NationalID: Patient,
                Consultant_NationalID: Consultant,
                SummaryNotes: values.title,
                StartDateTime: moment(values.startDate).format(),
                EndDateTime: moment(values.endDate).format(),
                meetinglink: new Date().getTime(),
                VitalSignID: null,
                HistoryID: null,
                status: 1,
                meetingType: 'Virtual',
                isConfirm: false,
                IsPaid: true,
                PaymentDate: new Date(),
                Amount: '2500',
                DiscountPerc: '0',
                NetAmount: '2500'
            };

            const responseCreateAppointment = await axios({
                method: 'post',
                url: `${BASE_URL}api/visit`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
            getVisitList();
            if (responseCreateAppointment.status == 200);
            {
                setModalAdd({ open: false, value: 'add' });
                toast.success('Apppointment added successfully');
            }
        } catch (error) {
        } finally {
            setLoadingRequest(false);
        }
    };
    const eventStyleGetter = (event) => {
        var style = {
            backgroundColor: event.hexColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            borderRadius: '5px',
            display: 'block'
        };
        return {
            style: style
        };
    };
    return (
        <div style={{ margin: '5px' }}>
            {!!visitList && (
                <Calendar
                    selectable
                    toolbar
                    defaultView="day"
                    views={['month', 'week', 'day']}
                    events={visitList}
                    localizer={localizer}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectSlot={(e) => addEvent(e, e.start, e.end)}
                    // resizable
                    style={{ height: '100vh', backgroundColor: '#ffffff' }}
                    eventPropGetter={(e) => eventStyleGetter(e)}
                    onSelectEvent={(e) => editEvent(e, e.start, e.end)}
                />
            )}
            <ModalCustom open={modalAdd.open} title={'Appointment'}>
                <Formik
                    initialValues={{
                        title: '',
                        summaryNotes: '',
                        startDate: '',
                        endDate: '',
                        amount: ''
                    }}
                    onSubmit={(values, { resetForm }) => handleRequest(values, resetForm)}
                >
                    <Form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Textfield name="title" label="Reason" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <label htmlFor="Patient">{'Patient'}</label>
                                <Autocomplete
                                    options={patientDataList}
                                    getOptionLabel={(patient) => `${patient.name}  ${patient.lastName} - ${patient.phone}`}
                                    onChange={(event, selected) => {
                                        setPatient(selected?.nationalID || null);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <label htmlFor="Consultant">{'Doctor'}</label>
                                <Autocomplete
                                    options={physicianDataList}
                                    getOptionLabel={(physician) => `${physician.name} - ${physician.phone} - ${physician.speciality}`}
                                    onChange={(event, selected) => {
                                        setConsultant(selected?.nationalID || null);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <DateTimePicker name="startDate" label="Start Time" type="datetime-local" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <DateTimePicker name="endDate" label="Date of Birth" type="datetime-local" />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                                <Box sx={styles.btnContainer}>
                                    {loadingRequest ? (
                                        <CircularProgress size={25} color="inherit" />
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => setModalAdd({ open: false, value: null })}
                                                variant="text"
                                                sx={{ color: 'red' }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                {modalAdd.value == 'add' ? 'Save' : 'Update'}
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                </Formik>
            </ModalCustom>
            <ModalCustom open={modalEdit.open} title={'Edit Appointment'}>
                <Formik
                    initialValues={{
                        title: modalEdit?.data?.title,
                        summaryNotes: '',
                        startDate: moment.parseZone(modalEdit?.data?.start).format(),
                        endDate: '',
                        amount: ''
                    }}
                    onSubmit={(values, { resetForm }) => handleRequest(values, resetForm)}
                >
                    <Form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <Textfield name="title" label="Reason" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <label htmlFor="Patient">{'Patient'}</label>
                                <Autocomplete
                                    options={patientDataList}
                                    getOptionLabel={(patient) => `${patient.name}  ${patient.lastName} - ${patient.phone}`}
                                    onChange={(event, selected) => {
                                        setPatient(selected?.nationalID || null);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <label htmlFor="Consultant">{'Doctor'}</label>
                                <Autocomplete
                                    options={physicianDataList}
                                    getOptionLabel={(physician) => `${physician.name} - ${physician.phone} - ${physician.speciality}`}
                                    onChange={(event, selected) => {
                                        setConsultant(selected?.nationalID || null);
                                    }}
                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <DateTimePicker name="startDate" label="Start Time" type="datetime-local" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <DateTimePicker name="endDate" label="Date of Birth" type="datetime-local" />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                                <Box sx={styles.btnContainer}>
                                    {/* {loadingRequest ? (
                                        <CircularProgress size={25} color="inherit" />
                                    ) : ( */}
                                    <>
                                        <Button
                                            onClick={() => setModalEdit({ open: false, value: null, data: null })}
                                            variant="text"
                                            sx={{ color: 'red' }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                            {modalEdit.value == 'add' ? 'Save' : 'Update'}
                                        </Button>
                                    </>
                                    {/* )} */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                </Formik>
            </ModalCustom>
        </div>
    );
}

const styles = {
    loadingContainer: {
        height: 400,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    }
};
