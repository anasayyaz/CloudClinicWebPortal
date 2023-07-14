import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';

import { COLORS } from 'constants/colors';
import PrintIcon from '@mui/icons-material/Print';
import { useState } from 'react';
import { BASE_URL } from 'constants/baseUrl';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ModalCustom from 'ui-component/modals/ModalCustom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';
import MeetingCard from 'ui-component/cards/MeetingCard';
import SearchField from 'ui-component/FormUI/SearchField.js';

import IntakeHistoryComp from '../../components/IntakeHistoryComp';
import VitalSignComp from 'components/VitalSignComp';
import UploadReportComp from 'components/UploadReportComp';
import ViewReportsComp from 'components/ViewReportsComp';
import PatientInfoComp from 'components/PatientInfoComp';
import moment from 'moment';

export default function AppointmentList() {
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
        getVisitList(0, rowsPerPage, e.target.value, searchQuery);
        setIsConfirmed(e.target.value);
        setPage(0);
    };

    const [visitList, setVisitList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmed, setIsConfirmed] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [cancel, setCancel] = useState({ loading: false, error: null, data: null, modalOpen: false });

    const [selectedVisit, setSelectedVisit] = useState(null);

    const [openPatientInfoModal, setOpenPatientInfoModal] = useState(false);
    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
    const [openVitalSignModal, setOpenVitalSignModal] = useState(false);
    const [openUploadReportModal, setOpenUploadReportModal] = useState(false);
    const [openViewReportModal, setOpenViewReportModal] = useState(false);

    const [rescheduleDateTime, setRescheduleDateTime] = useState(moment(new Date()).format('YYYY-MM-DDTHH:mm'));
    const [loadingResch, setLoadingResch] = useState(false);

    const handleRescheduleDateTime = async () => {
        setLoadingResch(true);
        try {
            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/sendRescheduleAppointmentEmail`,
                data: {
                    visitId: selectedVisit?.id,
                    IsRescheduled: true,
                    RescheduleDatetime: moment(rescheduleDateTime).format(),
                    UserId: user?.userId
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                setRescheduleDateTime(moment(new Date()).format('YYYY-MM-DDTHH:mm'));
                setOpenRescheduleModal(false);

                return toast.success('Email send successfully to reschedule appointment');
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingResch(false);
        }
    };

    const getVisitList = async (pageNumber, pageSize, isConfirm, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/patient/patientsUpcomingVisits/${user?.userId}?pageNumber=${
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

    //--------------------  Confirm Visit  ------------------------------
    const handleConfirmVisit = async (visitConfirm, visit) => {
        try {
            const updatedVisitList = visitList.items.map((obj) => {
                if (obj.id === visit?.id) {
                    obj.isConfirm = !obj.isConfirm; // change isConfirm Status of visitID that matched
                }
                return obj;
            });
            let newVisitList = { items: updatedVisitList };
            setVisitList(newVisitList);

            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/confirmVisit/${visit?.id}`,
                data: { isConfirm: visitConfirm },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
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
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
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
                        onClickPatientProfile={() => {
                            setOpenPatientInfoModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickReschedule={() => {
                            setOpenRescheduleModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickCancel={() => {
                            setCancel({ ...cancel, modalOpen: true, data: visit });
                        }}
                        onClickVitalSign={() => {
                            setOpenVitalSignModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickHistory={() => {
                            setOpenHistoryModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickViewReports={() => {
                            setOpenViewReportModal(true);
                            setSelectedVisit(visit);
                        }}
                        onClickUploadReports={() => {
                            setOpenUploadReportModal(true);
                            setSelectedVisit(visit);
                        }}
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
                    <Typography>{error?.response?.data?.message ?? error?.response?.data ?? error?.message}</Typography>
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
            {openPatientInfoModal && (
                <PatientInfoComp
                    open={openPatientInfoModal}
                    onClose={() => {
                        setOpenPatientInfoModal(false);
                    }}
                    visit={selectedVisit}
                />
            )}

            {/* ------------------------  Modal Reschedule Visit  -------------------------- */}
            <ModalCustom open={openRescheduleModal} title={'Reschedule Appointment'}>
                <Box sx={{ width: '20vw' }}>
                    <TextField
                        fullWidth
                        type="datetime-local"
                        variant="outlined"
                        label="Appointment Reschedule Date Time"
                        InputLabelProps={{ shrink: true }}
                        sx={{ my: 2 }}
                        InputProps={{
                            inputProps: {
                                min: moment(new Date()).format('YYYY-MM-DDTHH:mm')
                            }
                        }}
                        value={rescheduleDateTime}
                        onChange={(e) => setRescheduleDateTime(e?.target?.value)}
                    />

                    <Box sx={styles.btnContainer}>
                        {loadingResch ? (
                            <CircularProgress size={25} color="inherit" />
                        ) : (
                            <>
                                {/* -------------- onClick will call the onClose function that closes the History Modal */}
                                <Button onClick={() => setOpenRescheduleModal(false)} variant="text" sx={{ color: 'red' }}>
                                    Cancel
                                </Button>

                                {/* -----------  change button title on the basis of history status */}
                                <Button onClick={handleRescheduleDateTime} variant="text" sx={{ color: COLORS.secondory }}>
                                    Update
                                </Button>
                            </>
                        )}
                    </Box>
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

            {/* -----------------------  History Modal  -------------------------------------- */}
            {openHistoryModal && (
                <IntakeHistoryComp
                    open={openHistoryModal}
                    onClose={() => {
                        setOpenHistoryModal(false);
                    }}
                    isHistoryUpdated={(val) => {
                        // isHistoryUpdated will return us true from IntakeHistoryComp.js and if it is true we will change the historyStatus of selected visit to filled
                        if (val == true) {
                            const updatedVisitList = visitList.items.map((obj) => {
                                if (obj.id === selectedVisit?.id) {
                                    obj.historystatus = 'Intake History filled'; // change historyStatus to filled
                                }
                                return obj;
                            });
                            let newVisitList = { items: updatedVisitList };
                            setVisitList(newVisitList);
                        }
                    }}
                    visit={selectedVisit}
                />
            )}

            {/* -----------------------  Vital Sign Modal  -------------------------------------- */}
            {openVitalSignModal && (
                <VitalSignComp
                    open={openVitalSignModal}
                    onClose={() => {
                        setOpenVitalSignModal(false);
                    }}
                    isVitalSignUpdated={(val) => {
                        // Same Working Done on Intake History
                        if (val == true) {
                            const updatedVisitList = visitList.items.map((obj) => {
                                if (obj.id === selectedVisit?.id) {
                                    obj.vitalsignStatus = 'VitalSigns filled'; // change vitalSignStatus to filled
                                }
                                return obj;
                            });
                            let newVisitList = { items: updatedVisitList };
                            setVisitList(newVisitList);
                        }
                    }}
                    visit={selectedVisit}
                />
            )}

            {/* -----------------------  Upload Reports Modal  -------------------------------------- */}
            {openUploadReportModal && (
                <UploadReportComp
                    open={openUploadReportModal}
                    onClose={() => {
                        setOpenUploadReportModal(false);
                    }}
                    visit={selectedVisit}
                />
            )}

            {/* -----------------------  View Reports Modal  -------------------------------------- */}
            {openViewReportModal && (
                <ViewReportsComp
                    open={openViewReportModal}
                    onClose={() => {
                        setOpenViewReportModal(false);
                    }}
                    visit={selectedVisit}
                />
            )}
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
