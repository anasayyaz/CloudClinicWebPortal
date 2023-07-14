import React, { useState, useEffect } from 'react';

import { Form, Formik } from 'formik';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// -----------------  Importing Icons

// -----------------  Importing Constants
import { COLORS } from 'constants/colors';
import { BASE_URL } from 'constants/baseUrl';

// -----------------  Utilis
import Autocomplete from '@mui/material/Autocomplete';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from '@mui/material';
import Textfield from 'ui-component/FormUI/Textfield';
import DateTimePicker from 'ui-component/FormUI/DateTimePicker';
import SearchField from 'ui-component/FormUI/SearchField.js';
const localizer = momentLocalizer(moment);

import * as Yup from 'yup';

export default function Scheduler() {
    const { user } = useSelector((state) => state?.user);

    const [visitList, setVisitList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState();

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPhysician, setSelectedPhysician] = useState(null);
    const [meetingType, setMeetingType] = useState('Virtual');

    const [modal, setModal] = useState({ open: false, type: 'add', data: null });
    const [loadingRequest, setLoadingRequest] = useState(false);

    const getVisitList = async (searchValue) => {
        try {
            setError(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/primaryCareVisitsList/${user?.userId}?pageNumber=1&pageSize=1000&QuerySearch=${
                    searchValue ?? ''
                }&IsConfirm=`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            let newArr = [];
            res?.data?.items?.map((item) => {
                let visitObj = {};
                visitObj.id = item.id;
                visitObj.start = new Date(item.startDateTime);
                visitObj.end = new Date(item.endDateTime);
                visitObj.title = item.title;
                visitObj.summaryNotes = item.summaryNotes;
                visitObj.amount = item.amount;
                visitObj.hexColor = item.colorCode;
                visitObj.consultant_NationalID = item.consultant_NationalID;
                visitObj.patient_NationalID = item.patient_NationalID;
                visitObj.meetingtype = item?.meetingtype;
                if (item.isDeleted === false) {
                    newArr.push(visitObj);
                }
            });

            setVisitList(newArr);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVisitList();
    }, []);

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

    const handleRequest = async (values, resetForm) => {
        setLoadingRequest(true);
        try {
            const data = {
                ...values,
                Patient_NationalID: selectedPatient,
                Consultant_NationalID: selectedPhysician,
                StartDateTime: moment(values.startDate).format(),
                EndDateTime: moment(values.endDate).format(),
                meetingType,
                meetinglink: new Date().getTime(),
                VitalSignID: null,
                HistoryID: null,
                status: 1,
                isConfirm: false,
                IsPaid: true,
                PaymentDate: new Date(),
                DiscountPerc: '0',
                NetAmount: values.amount,
                lastModifiedBy: modal.type == 'add' ? null : user?.userId,
                lastModifiedOn: modal.type == 'add' ? null : new Date(),
                ...(modal.type == 'add' && { createdOn: new Date(), createdBy: user?.userId })
            };

            let method = modal.type == 'add' ? 'post' : 'put';
            let url = modal.type == 'add' ? `${BASE_URL}api/visit` : `${BASE_URL}api/visit/updateEvent/${modal?.data?.id}`;

            const responseCreateAppointment = await axios({
                method,
                url,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
            getVisitList();
            if (responseCreateAppointment.status == 200);
            {
                setModal({ open: false, type: null, data: null });
                toast.success(`Apppointment ${modal.type == 'add' ? 'added' : 'updated'} successfully`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingRequest(false);
        }
    };

    const handleDeleteVisit = async () => {
        setLoadingRequest(true);
        try {
            const resDeleteVisit = await axios({
                method: 'delete',
                url: `${BASE_URL}api/visit/${modal?.data?.id}`,
                data: { deletedOn: new Date(), deletedBy: user?.userId },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });
            getVisitList();
            if (resDeleteVisit.status == 200);
            {
                setModal({ open: false, type: null, data: null });
                toast.success(`Apppointment deleted successfully`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingRequest(false);
        }
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        var backgroundColor = event.hexColor;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    //------------------------------  Initial Values for our appointment form
    const INITIAL_VALUES =
        modal?.type == 'add'
            ? {
                  title: '',
                  summaryNotes: '',
                  startDate: !!modal?.data ? moment(modal?.data?.start).format('YYYY-MM-DDTHH:mm') : new Date().toISOString().slice(0, 16),
                  endDate: !!modal?.data ? moment(modal?.data?.end).format('YYYY-MM-DDTHH:mm') : new Date().toISOString().slice(0, 16),
                  amount: ''
              }
            : {
                  title: modal?.data?.title,
                  summaryNotes: modal?.data?.summaryNotes,
                  startDate: !!modal?.data ? moment(modal?.data?.start).format('YYYY-MM-DDTHH:mm') : new Date().toISOString().slice(0, 16),
                  endDate: !!modal?.data ? moment(modal?.data?.end).format('YYYY-MM-DDTHH:mm') : new Date().toISOString().slice(0, 16),
                  amount: modal?.data?.amount
              };

    //------------------------------  Validation Schema for our appointment form
    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        summaryNotes: Yup.string().required('Required'),
        startDate: Yup.date()
            .min(Yup.ref('endDate'), 'Start date time must be less than end date time')
            .min(new Date(), 'Start date time must be after current date time')
            .required('Start date is required'),
        endDate: Yup.date().min(Yup.ref('startDate'), 'End date time must be greater than start date time').required('End date is required')
    });

    return (
        <div>
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1} sx={{ py: 1 }}>
                    Add / Edit an appointment
                </Typography>

                <Grid item>
                    <SearchField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClickSearch={() => {
                            getVisitList(searchQuery);
                        }}
                        onClickClear={() => {
                            setSearchQuery('');
                            getVisitList('');
                        }}
                        titleSearchBtn={'Search Physician'}
                        titleClearBtn={'Clear search list'}
                        size={'small'}
                    />
                </Grid>
            </Grid>

            {!!visitList && (
                <Paper sx={{ width: '100%', p: 1, mb: -1 }}>
                    <Calendar
                        selectable
                        toolbar
                        defaultView="day"
                        views={['month', 'week', 'day']}
                        events={visitList}
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        onSelectSlot={(e) => {
                            if (new Date(e.start) > new Date()) {
                                setModal({ open: true, type: 'add', data: e, show: true });
                                setSelectedPatient(null);
                                setSelectedPhysician(null);
                                setMeetingType('Virtual');
                            }
                        }}
                        onSelectEvent={(e) => {
                            if (new Date(e.start) > new Date()) {
                                setModal({ open: true, type: 'update', data: e, show: true });
                                setSelectedPatient(e?.patient_NationalID);
                                setSelectedPhysician(e?.consultant_NationalID);
                                setMeetingType(e?.meetingtype);
                            } else {
                                setModal({ open: true, type: 'update', data: e, show: false });
                                setSelectedPatient(e?.patient_NationalID);
                                setSelectedPhysician(e?.consultant_NationalID);
                                setMeetingType(e?.meetingtype);
                            }
                        }}
                        style={{ backgroundColor: '#ffffff', height: '73.5vh' }}
                        eventPropGetter={eventStyleGetter}
                    />
                </Paper>
            )}

            {loading && (
                <Grid sx={styles.loadingContainer}>
                    <CircularProgress size={35} color="inherit" />
                </Grid>
            )}

            {!!error && (
                <Grid sx={styles.loadingContainer}>
                    <Typography>{error?.response?.data?.message ?? error?.response?.data ?? error?.message}</Typography>
                </Grid>
            )}

            {/* ========================  Modal to Add Slot and Edit Slot  */}
            <ModalCustom open={modal.open} title={modal.type == 'add' ? 'Add Appointment' : 'Update Appointment'}>
                <Formik
                    initialValues={INITIAL_VALUES}
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values, { resetForm }) => handleRequest(values, resetForm)}
                >
                    <Form>
                        <Box sx={{ maxWidth: 400 }}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Textfield name="title" label="Title" variant="standard" size="small" />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Textfield name="summaryNotes" label="Summary" variant="standard" size="small" />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Autocomplete
                                        options={patientDataList ?? []}
                                        size="small"
                                        getOptionLabel={(patient) => `${patient?.name}  ${patient?.lastName} - ${patient?.phone}`}
                                        value={patientDataList?.find((i) => i?.nationalID == selectedPatient)}
                                        onChange={(event, selected) => {
                                            setSelectedPatient(selected?.nationalID || null);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Patient" variant="standard" />}
                                    />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Autocomplete
                                        size="small"
                                        options={physicianDataList ?? []}
                                        getOptionLabel={(physician) => `${physician?.name}  ${physician?.phone} - ${physician?.speciality}`}
                                        value={physicianDataList?.find((i) => i?.nationalID == selectedPhysician)}
                                        onChange={(event, selected) => {
                                            setSelectedPhysician(selected?.nationalID || null);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Physician" variant="standard" />}
                                    />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <DateTimePicker
                                        size="small"
                                        name="startDate"
                                        label="Start Date Time"
                                        type="datetime-local"
                                        variant="standard"
                                    />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <DateTimePicker
                                        size="small"
                                        name="endDate"
                                        label="End Date Time"
                                        type="datetime-local"
                                        variant="standard"
                                    />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Textfield name="amount" label="Amount" variant="standard" size="small" type="number" />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <FormControl>
                                        <RadioGroup row value={meetingType} onChange={(e) => setMeetingType(e.target.value)}>
                                            <FormControlLabel value="Inperson" control={<Radio />} label="In-Person" />
                                            <FormControlLabel value="Virtual" control={<Radio />} label="Virtual" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                                    <Box sx={styles.btnContainer}>
                                        {loadingRequest ? (
                                            <CircularProgress size={25} color="inherit" />
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={() => setModal({ open: false, type: null, data: null })}
                                                    variant="text"
                                                    sx={{ color: 'red' }}
                                                >
                                                    {modal?.show ? 'Cancel' : 'Close'}
                                                </Button>
                                                {modal?.show == true && (
                                                    <>
                                                        {modal.type !== 'add' && (
                                                            <Button
                                                                type="submit"
                                                                variant="text"
                                                                sx={{ color: 'red' }}
                                                                onClick={handleDeleteVisit}
                                                            >
                                                                Delete
                                                            </Button>
                                                        )}
                                                        <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                            {modal.type == 'add' ? 'Save' : 'Update'}
                                                        </Button>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Form>
                </Formik>
            </ModalCustom>
        </div>
    );
}

const styles = {
    loadingContainer: {
        height: '70vh',
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
