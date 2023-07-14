import React, { useState, useEffect } from 'react';

import {
    TableRow,
    TablePagination,
    TableHead,
    TableContainer,
    TableBody,
    TableCell,
    Table,
    Paper,
    Button,
    TextField,
    CircularProgress,
    FormControl,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    IconButton,
    InputLabel,
    Typography,
    Select,
    Box,
    Autocomplete,
    MenuItem
} from '@mui/material';

import { Field, Form, Formik } from 'formik';

import ModalCustom from 'ui-component/modals/ModalCustom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// -----------------  Importing Icons
import PrintIcon from '@mui/icons-material/Print';

// -----------------  Importing Constants
import { COLORS } from 'constants/colors';
import { BASE_URL } from 'constants/baseUrl';

// -----------------  Utilis
import { profileImage } from 'utils/fetchImage';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchField from 'ui-component/FormUI/SearchField.js';
import Textfield from 'ui-component/FormUI/Textfield';
import DateTimePicker from 'ui-component/FormUI/DateTimePicker';

import useFetch from 'hooks/useFetch';
import moment from 'moment';
import * as Yup from 'yup';

export default function ToBeAdded() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const navigate = useNavigate();

    const [tobeAddedList, setToBeAddedList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [action, setAction] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChangePage = (event, newPage) => {
        getToBeAddedList(newPage, rowsPerPage, action, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getToBeAddedList(page, event.target.value, action, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const handleAction = (e) => {
        getToBeAddedList(0, rowsPerPage, e.target.value, searchQuery);
        setAction(e.target.value);
        setPage(0);
    };

    const getToBeAddedList = async (pageNumber, pageSize, actionVal, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setToBeAddedList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/patient/patientsAppointmentList?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&Action=${actionVal == 'all' ? '' : actionVal}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setToBeAddedList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getToBeAddedList(page, rowsPerPage, action, searchQuery);
    }, []);

    const {
        data: physicianDataList,
        loading: loadingphysicianDataList,
        error: errorphysicianDataList,
        refetch: refetchphysicianDataList
    } = useFetch(`${BASE_URL}api/physician/physicianSelectList?pageNumber=1&pageSize=100&QuerySearch=`);

    // ============================================================
    // Modal States
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [meetingType, setMeetingType] = useState('Virtual');

    const [selectedPhysician, setSelectedPhysician] = useState();
    const [loadingRequest, setLoadingRequest] = useState(false);

    //------------------------------  Initial Values for our appointment form
    const INITIAL_VALUES = {
        title: selectedRow?.title,
        summaryNotes: selectedRow?.summaryNotes,
        startDate: moment(new Date()).format('YYYY-MM-DDTHH:mm'),
        amount: ''
    };

    //------------------------------  Validation Schema for our appointment form
    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        summaryNotes: Yup.string().required('Required'),
        startDate: Yup.date().min(new Date(), 'Start date time must be after current date time').required('Start date is required')
    });

    const handleRequest = async (values, resetForm) => {
        setLoadingRequest(true);
        try {
            const data = {
                ...values,
                Patient_NationalID: selectedRow?.nationalID,
                Consultant_NationalID: selectedPhysician,
                StartDateTime: moment(values.startDate).format(),
                EndDateTime: moment(values.startDate).add(30, 'minutes').format(),
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
                createdOn: new Date(),
                createdBy: user?.userId
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

            getToBeAddedList(page, rowsPerPage, action, searchQuery);
            if (responseCreateAppointment.status == 200);
            {
                setModalOpen(false);
                resetForm();
                toast.success(`Apppointment created successfully`);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.response?.data || error?.message);
        } finally {
            setLoadingRequest(false);
        }
    };

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1} sx={{ py: 1 }}>
                    To Be Added
                </Typography>
            </Grid>

            {/* -------------------------------  Search Layout button */}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container alignItems="center" p={2} rowGap={2}>
                    <Grid item sx={{ display: 'flex', flex: 1 }}>
                        <Grid container gap={2}>
                            <Grid item lg={4} xs={12}>
                                <SearchField
                                    label="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onClickSearch={() => {
                                        setPage(0);
                                        getToBeAddedList(0, rowsPerPage, action, searchQuery);
                                    }}
                                    onClickClear={() => {
                                        setPage(0);
                                        setSearchQuery('');
                                        getToBeAddedList(0, rowsPerPage, action, '');
                                    }}
                                    titleSearchBtn={'Search Patient'}
                                    titleClearBtn={'Clear search list'}
                                />
                            </Grid>

                            <Grid lg={2.5} xs={12}>
                                <FormControl fullWidth>
                                    <Select value={action} onChange={handleAction}>
                                        <MenuItem value={'all'}>All</MenuItem>
                                        <MenuItem value={'consultation'}>Consultation</MenuItem>
                                        <MenuItem value={'followup'}>Follow Up</MenuItem>
                                        <MenuItem value={'reschedule'}>Reschedule</MenuItem>
                                        <MenuItem value={'new+appointment+request'}>New Appointment Request</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print Patient List">
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <TableContainer sx={{ maxHeight: 'auto' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow
                                sx={{
                                    '& th': {
                                        color: '#fff',
                                        backgroundColor: COLORS.secondory
                                    }
                                }}
                            >
                                <TableCell align={'left'}>ID</TableCell>

                                <TableCell align={'left'}>Patient Name</TableCell>

                                <TableCell align={'left'}>Patient Phone Number</TableCell>

                                <TableCell align={'left'}>Date Time</TableCell>

                                <TableCell align={'left'}>Physician Name</TableCell>

                                <TableCell align={'left'}>Referred To</TableCell>

                                <TableCell align={'left'}>Action</TableCell>

                                <TableCell align={'left'}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!tobeAddedList &&
                                tobeAddedList?.items?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                        >
                                            <TableCell align={'left'}>{row?.id}</TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.patientName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.patientPhone}</TableCell>

                                            <TableCell align={'left'}>
                                                {moment(row?.startDateTime).format('MMM DD, YYYY  -  hh:mm A')}
                                            </TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.doctorName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.refferedTo || '--'}</TableCell>

                                            <TableCell align={'left'}>{row?.action}</TableCell>

                                            <TableCell align={'left'}>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedRow(row);
                                                        setModalOpen(true);
                                                        setSelectedPhysician(row?.consultant_NationalID);
                                                    }}
                                                    sx={{ color: COLORS.secondory }}
                                                >
                                                    Make an Appt.
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            {loading && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <CircularProgress size={35} color="inherit" />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!!error && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <Typography>{error?.response?.data?.message ?? error?.response?.data ?? error?.message}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                {/* =========================================  Modal for Creating an Appointment */}

                <ModalCustom open={modalOpen} title={'Create Appointment'}>
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
                                        {/* <Autocomplete
                                            options={patientDataList ?? []}
                                            size="small"
                                            disabled
                                            getOptionLabel={(patient) => `${patient?.name}  ${patient?.lastName} - ${patient?.phone}`}
                                            value={patientDataList?.find((i) => i?.nationalID == selectedRow?.nationalID)}
                                            onChange={(event, selected) => {
                                                setSelectedPatient(selected?.nationalID || null);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Patient" variant="standard" />}
                                        /> */}

                                        <TextField
                                            disabled
                                            fullWidth
                                            label="Patient"
                                            variant="standard"
                                            value={`${selectedRow?.patientTitle} ${selectedRow?.patientFirstName} ${selectedRow?.patientLastName} - ${selectedRow?.patientPhone}`}
                                        />
                                    </Grid>

                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Autocomplete
                                            size="small"
                                            options={
                                                physicianDataList?.filter(
                                                    (i) => i?.speciality?.toLowerCase() == selectedRow?.refferedTo?.toLowerCase()
                                                ) ||
                                                physicianDataList ||
                                                []
                                            }
                                            disabled={selectedRow?.isConsultantRequired ? false : true}
                                            getOptionLabel={(physician) =>
                                                `${physician?.name}  ${physician?.phone} - ${physician?.speciality}`
                                            }
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
                                        <Field>
                                            {({ field, meta }) => (
                                                <TextField
                                                    fullWidth
                                                    variant="standard"
                                                    label="End Date Time"
                                                    type="datetime-local"
                                                    value={moment(field?.value?.startDate).add(30, 'minutes').format('YYYY-MM-DDTHH:mm')}
                                                />
                                            )}
                                        </Field>
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
                                                    <Button onClick={() => setModalOpen(false)} variant="text" sx={{ color: 'red' }}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                        Save
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
            </Paper>
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
