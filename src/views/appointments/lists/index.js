import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from 'constants/colors';
import { IconPlus } from '@tabler/icons';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { profileImage } from 'utils/fetchImage';
import { useState } from 'react';
import { BASE_URL } from 'constants/baseUrl';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import ProfileCard from 'ui-component/cards/ProfileCard';
import { useSelector } from 'react-redux';
import ModalCustom from 'ui-component/modals/ModalCustom';
import { Form, Formik } from 'formik';
import Textfield from 'ui-component/FormUI/Textfield';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingTitle from 'assets/images/icons/meeting-title.svg';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingCard from 'ui-component/cards/MeetingCard';
import SearchField from 'ui-component/FormUI/SearchField.js';
import { getDetail } from 'services/getDetail';
import moment from 'moment/moment';
import HistoryForm from 'ui-component/HistoryForm';

export default function Lists() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getVisitList(newPage, rowsPerPage, isConfirmed, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getVisitList(page, event.target.value, isConfirm, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const handleIsConfirmed = (e) => {
        getVisitList(page, rowsPerPage, e.target.value, searchQuery);
        setIsConfirmed(e.target.value);
    };

    const [visitList, setVisitList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmed, setIsConfirmed] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [patient, setPatient] = useState({ loading: false, error: null, data: null, modalOpen: false });
    const [cancel, setCancel] = useState({ loading: false, error: null, data: null, modalOpen: false });

    const [historyModal, setHistoryModal] = useState(false);

    const getVisitList = async (pageNumber, pageSize, isConfirm, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/primaryCareVisitsList/${user?.userId}?pageNumber=${
                    pageNumber + 1
                }&pageSize=${pageSize}&QuerySearch=${searchValue ?? ''}&isConfirm=${isConfirm == 'all' ? '' : isConfirm}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setVisitList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVisitList(page, rowsPerPage, isConfirmed, searchQuery);
    }, []);

    //--------------------  Getting Patient Detail and handling other states using object
    const handlePatientProfile = async (nationalId) => {
        setPatient({ ...patient, modalOpen: true, loading: true });
        try {
            const patientDetail = await getDetail('patient', nationalId);

            setPatient({ ...patient, loading: false, modalOpen: true, data: patientDetail?.data });
        } catch (error) {
            setPatient({ ...patient, loading: false, modalOpen: true, error: error });
        }
    };

    //--------------------  Confirm Visit  ------------------------------
    const handleConfirmVisit = async (visitConfirm, visit) => {
        try {
            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/confirmVisit/${visit?.id}`,
                data: { isConfirm: visitConfirm },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                const updatedVisitList = visitList.items.map((obj) => {
                    if (obj.id === visit?.id) {
                        obj.isConfirm = !obj.isConfirm; // change isConfirm Status of visitID that matched
                    }
                    return obj;
                });
                let newVisitList = { items: updatedVisitList };
                setVisitList(newVisitList);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        }
    };

    // ----------------------  Cancel Appointment  ---------------------------
    const handleCancelAppointment = async () => {
        const { data: visit } = cancel;
        setCancel({ ...cancel, loading: true });
        try {
            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/updateCancelVisitStatus/${visit?.id}`,
                data: { id: visit.id, status: 10 },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                const updatedVisitList = visitList.items.filter((obj) => {
                    return obj.id !== visit?.id; //------------- Remove that object that match that id
                });
                let newVisitList = { items: updatedVisitList };
                setVisitList(newVisitList);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setCancel({ ...cancel, loading: false, modalOpen: false });
        }
    };

    return (
        <div>
            {/* -----------------  Main Header  -------------------------- */}
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Appointment List
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <FormControl sx={{ width: 130 }}>
                        <Select size="small" value={isConfirmed} onChange={handleIsConfirmed}>
                            <MenuItem value={'all'}>All</MenuItem>
                            <MenuItem value={true}>Confirmed</MenuItem>
                            <MenuItem value={false}>Unconfirmed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* ---------------------  Search Bar and Print Button ------------------- */}
            <Grid container justifyContent="space-between" alignItems="center" rowGap={2}>
                <Grid item lg={4} xs={12}>
                    <SearchField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClickSearch={() => {
                            setPage(0);
                            getVisitList(0, rowsPerPage, isConfirmed, searchQuery);
                        }}
                        onClickClear={() => {
                            setPage(0);
                            setSearchQuery('');
                            getVisitList(0, rowsPerPage, isConfirmed, '');
                        }}
                        titleSearchBtn={'Search Visit'}
                        titleClearBtn={'Clear search list'}
                    />
                </Grid>

                <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton title="Print Visit List">
                        <PrintIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {/* --------------------------  Meeting Card  ------------------------- */}
            {!!visitList &&
                visitList?.items?.map((visit) => (
                    <MeetingCard
                        key={visit?.meetinglink}
                        visit={visit}
                        onClickPatientProfile={() => handlePatientProfile(visit?.patient_NationalID)}
                        onClickStart={() => {}}
                        onClickReschedule={() => {}}
                        onClickCancel={() => {
                            setCancel({ ...cancel, modalOpen: true, data: visit });
                        }}
                        onClickVitalSign={() => {}}
                        onClickHistory={() => setHistoryModal(true)}
                        onClickLabReports={() => {}}
                        onClickUploadDoc={() => {}}
                        onChangeConfirm={(e) => handleConfirmVisit(e.target.checked, visit)}
                    />
                ))}

            {loading && (
                <Grid sx={styles.loadingContainer}>
                    <CircularProgress size={35} color="inherit" />
                </Grid>
            )}
            {!!error && (
                <Grid sx={styles.loadingContainer}>
                    <Typography>{error?.response?.data?.message ?? error?.message}</Typography>
                </Grid>
            )}
            {searchQuery?.length > 0 && visitList?.length == 0 && (
                <Grid sx={styles.loadingContainer}>
                    <Typography sx={{ fontSize: 16, fontWeight: '600' }}>Does not match any results!</Typography>
                </Grid>
            )}

            {/* ---------------------------- Pagination ----------------------- */}
            {!!visitList && visitList?.items?.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

            {/* --------------------------  Modal for Showing Patient Info  ------------------------- */}
            <ModalCustom open={patient.modalOpen} title={'Patient Info'}>
                <Box sx={{ width: 330 }}>
                    {patient?.loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress size={30} color="inherit" />
                        </Box>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => setPatient({ ...patient, modalOpen: false, data: null, error: null })}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {!!patient?.data && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <img alt={'Profile'} src={profileImage(patient?.data?.profileImage)} style={styles.profilePicture} />
                            </Box>

                            <TextBox
                                title={'Name'}
                                subTitle={`${patient?.data?.titles} ${patient?.data?.name} ${patient?.data?.lastName}`}
                            />
                            <TextBox title={'Gender'} subTitle={`${patient?.data?.gender}`} />
                            <TextBox title={'Phone No.'} subTitle={`${patient?.data?.phone}`} />
                            <TextBox title={'NIC'} subTitle={`${patient?.data?.identificationNo}`} />
                            <TextBox title={'Date of Birth'} subTitle={moment(patient?.data?.dob).format('MMM DD, YYYY')} />
                            <TextBox title={'Email'} subTitle={`${patient?.data?.email}`} />
                            <TextBox title={'Address'} subTitle={`${patient?.data?.address}`} />
                            <TextBox title={'Guardian Name'} subTitle={`${patient?.data?.guardianName}`} />
                            <TextBox title={'Guardian Phone'} subTitle={`${patient?.data?.guardianPhone}`} />
                            <TextBox title={'Active'} subTitle={`${patient?.data?.isActive == true ? 'Yes' : 'No'}`} />
                            <TextBox title={'In-Hospital'} subTitle={`${patient?.data?.inHospital == true ? 'Yes' : 'No'}`} />
                        </>
                    )}
                </Box>
            </ModalCustom>

            {/* ------------------------  Modal Cancel Confirmation  -------------------------- */}
            <ModalConfirmation
                open={cancel.modalOpen}
                header={'Cancel Confirmation'}
                description={'Are you sure, you want to cancel this appointment?'}
                loading={cancel.loading}
                onClickNo={() => setCancel({ ...cancel, modalOpen: false, data: null })}
                onClickYes={() => handleCancelAppointment()}
            />

            <ModalCustom open={historyModal} title={'Add History'}>
                <Box sx={{ width: 900 }}>
                    <HistoryForm />
                    <Box sx={styles.btnContainer}>
                        {false ? (
                            <CircularProgress size={25} color="inherit" />
                        ) : (
                            <>
                                <Button onClick={() => setHistoryModal(false)} variant="text" sx={{ color: 'red' }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                    Save
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
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
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#d5d5d5',
        alignSelf: 'center'
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    }
};

const TextBox = ({ title, subTitle }) => {
    return (
        <Box sx={{ display: 'flex', my: 1 }}>
            <Typography sx={{ width: '45%' }}>{title}</Typography>
            <Typography>{subTitle ?? '--'}</Typography>
        </Box>
    );
};
