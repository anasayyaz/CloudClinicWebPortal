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
import { Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import Textfield from 'ui-component/FormUI/Textfield';
import DateTimePicker from 'ui-component/FormUI/DateTimePicker';
const localizer = momentLocalizer(moment);

export default function Scheduler() {
    const { user } = useSelector((state) => state?.user);

    const [visitList, setVisitList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPhysician, setSelectedPhysician] = useState(null);

    const [modal, setModal] = useState({ open: false, type: 'add', data: null });
    const [loadingRequest, setLoadingRequest] = useState(false);

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
                Patient_NationalID: selectedPatient,
                Consultant_NationalID: selectedPhysician,
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
                setModal({ open: false, type: null, data: null });
                toast.success('Apppointment added successfully');
            }
        } catch (error) {
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
                    onSelectSlot={(e) => {
                        setModal({ open: true, type: 'add', data: e });
                        setSelectedPatient(null);
                        setSelectedPhysician(null);
                    }}
                    onSelectEvent={(e) => {
                        setModal({ open: true, type: 'update', data: e });
                        setSelectedPatient(e?.patient_NationalID);
                        setSelectedPhysician(e?.consultant_NationalID);
                    }}
                    style={{ backgroundColor: '#ffffff', height: '100vh' }}
                    eventPropGetter={eventStyleGetter}
                />
            )}

            {/* ========================  Modal to Add Slot and Edit Slot  */}
            <ModalCustom open={modal.open} title={modal.type == 'add' ? 'Add Appointment' : 'Update Appointment'}>
                <Formik
                    initialValues={
                        modal?.type == 'add'
                            ? {
                                  title: '',
                                  summaryNotes: '',
                                  startDate: !!modal?.data
                                      ? moment(modal?.data?.start).format('YYYY-MM-DDTHH:mm')
                                      : new Date().toISOString().slice(0, 16),
                                  endDate: !!modal?.data
                                      ? moment(modal?.data?.end).format('YYYY-MM-DDTHH:mm')
                                      : new Date().toISOString().slice(0, 16),
                                  amount: ''
                              }
                            : {
                                  title: modal?.data?.title,
                                  summaryNotes: '',
                                  startDate: !!modal?.data
                                      ? moment(modal?.data?.start).format('YYYY-MM-DDTHH:mm')
                                      : new Date().toISOString().slice(0, 16),
                                  endDate: !!modal?.data
                                      ? moment(modal?.data?.end).format('YYYY-MM-DDTHH:mm')
                                      : new Date().toISOString().slice(0, 16),
                                  amount: ''
                              }
                    }
                    onSubmit={(values, { resetForm }) => handleRequest(values, resetForm)}
                >
                    <Form>
                        <Box sx={{ maxWidth: 400 }}>
                            <Grid container direction="row" spacing={2}>
                                <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
                                    <Textfield name="title" label="Reason" variant="outlined" />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Autocomplete
                                        options={patientDataList}
                                        getOptionLabel={(patient) => `${patient?.name}  ${patient?.lastName} - ${patient?.phone}`}
                                        value={patientDataList?.find((i) => i?.nationalID == selectedPatient)}
                                        onChange={(event, selected) => {
                                            setSelectedPatient(selected?.nationalID || null);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Patient" variant="outlined" />}
                                    />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Autocomplete
                                        options={physicianDataList}
                                        getOptionLabel={(physician) => `${physician?.name}  ${physician?.phone} - ${physician?.speciality}`}
                                        value={physicianDataList?.find((i) => i?.nationalID == selectedPhysician)}
                                        onChange={(event, selected) => {
                                            setSelectedPhysician(selected?.nationalID || null);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Physician" variant="outlined" />}
                                    />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <DateTimePicker name="startDate" label="Start Date Time" type="datetime-local" variant="outlined" />
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <DateTimePicker name="endDate" label="End Date Time" type="datetime-local" variant="outlined" />
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
                                                    Cancel
                                                </Button>
                                                <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                    {modal.type == 'add' ? 'Save' : 'Update'}
                                                </Button>
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
