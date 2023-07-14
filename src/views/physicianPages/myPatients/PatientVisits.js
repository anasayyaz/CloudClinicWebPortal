import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    IconButton
} from '@mui/material';
import { COLORS } from 'constants/colors';
import { profileImage } from 'utils/fetchImage';
import { BASE_URL } from 'constants/baseUrl';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SearchField from 'ui-component/FormUI/SearchField.js';
import CallIcon from '@mui/icons-material/Call';
import moment from 'moment';
import IntakeHistoryComp from 'components/IntakeHistoryComp';
import VitalSignComp from 'components/VitalSignComp';
import ViewReportsComp from 'components/ViewReportsComp';
import ModalCustom from 'ui-component/modals/ModalCustom';
import CloseIcon from '@mui/icons-material/Close';

export default function PatientVisits() {
    const { user } = useSelector((state) => state?.user);
    const { state } = useLocation();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getPatientVisitList(newPage, rowsPerPage, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getPatientVisitList(page, event.target.value, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const [patientVisitList, setPatientVisitList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const getPatientVisitList = async (pageNumber, pageSize, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setPatientVisitList(null);

            const res = await axios({
                method: 'post',
                url: `${BASE_URL}api/physician/physicianPatientVisits?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&isConfirm=false`,
                data: {
                    Physician_UserID: user?.userId,
                    Patient_NationalID: state?.patient_NationalID
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setPatientVisitList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPatientVisitList(page, rowsPerPage, searchQuery);
    }, []);

    const [selectedVisit, setSelectedVisit] = useState(null);

    const [openHistoryModal, setOpenHistoryModal] = useState(false);
    const [openVitalSignModal, setOpenVitalSignModal] = useState(false);
    const [openViewReportModal, setOpenViewReportModal] = useState(false);
    const [openNotesModal, setOpenNotesModal] = useState(false);

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center" py={1}>
                <Typography variant="h3" color={COLORS.color1}>
                    Patients Visits List
                </Typography>
            </Grid>

            {/* -------------------------------  Search Layout button */}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container justifyContent="space-between" alignItems="center" p={2} rowGap={2}>
                    <Grid item lg={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img
                                alt={'Profile'}
                                src={profileImage(state?.patientProfilImage)}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    marginTop: -20,
                                    marginBottom: -15,
                                    position: 'relative'
                                }}
                            />
                            <Box>
                                <Typography sx={{ textTransform: 'capitalize', fontSize: 18, fontWeight: '600' }}>
                                    {state?.patientTitle?.toLowerCase()} {state?.patientFirstName?.toLowerCase()}{' '}
                                    {state?.patientLastName?.toLowerCase()}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CallIcon sx={{ fontSize: 15 }} />
                                    <Typography>{state?.patientPhone}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item lg={4} xs={12}>
                        <SearchField
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClickSearch={() => {
                                setPage(0);
                                getPatientVisitList(0, rowsPerPage, searchQuery);
                            }}
                            onClickClear={() => {
                                setPage(0);
                                setSearchQuery('');
                                getPatientVisitList(0, rowsPerPage, '');
                            }}
                            titleSearchBtn={'Search Visit'}
                            titleClearBtn={'Clear search list'}
                        />
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
                                <TableCell align={'left'}>Visit Id</TableCell>

                                <TableCell align={'left'}>Reason</TableCell>

                                <TableCell align={'left'}>Start Date Time</TableCell>

                                <TableCell />

                                <TableCell />

                                <TableCell />

                                <TableCell />

                                <TableCell />

                                <TableCell />

                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!patientVisitList &&
                                patientVisitList.items.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                        >
                                            <TableCell align={'left'}>{row?.id}</TableCell>

                                            <TableCell align={'left'}>{row?.title}</TableCell>

                                            <TableCell align={'left'}>
                                                {moment(row?.startDateTime).format('MMM DD, YYYY  -  hh:mm A')}
                                            </TableCell>

                                            <TableCell>
                                                <Button sx={{ color: COLORS.secondory }} size={'small'} variant="standard">
                                                    Diagnosis
                                                </Button>
                                            </TableCell>

                                            <TableCell>
                                                <Button sx={{ color: COLORS.secondory }} size={'small'} variant="standard">
                                                    Prescription
                                                </Button>
                                            </TableCell>

                                            <TableCell>
                                                <Button sx={{ color: COLORS.secondory }} size={'small'} variant="standard">
                                                    Lab Test
                                                </Button>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    sx={{ color: COLORS.secondory }}
                                                    size={'small'}
                                                    onClick={() => {
                                                        setOpenHistoryModal(true);
                                                        setSelectedVisit(row);
                                                    }}
                                                    variant="standard"
                                                >
                                                    History
                                                </Button>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    sx={{ color: COLORS.secondory }}
                                                    size={'small'}
                                                    onClick={() => {
                                                        setOpenVitalSignModal(true);
                                                        setSelectedVisit(row);
                                                    }}
                                                    variant="standard"
                                                >
                                                    Vital Sign
                                                </Button>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    sx={{ color: COLORS.secondory }}
                                                    size={'small'}
                                                    onClick={() => {
                                                        setOpenViewReportModal(true);
                                                        setSelectedVisit(row);
                                                    }}
                                                    variant="standard"
                                                >
                                                    Lab Reports
                                                </Button>
                                            </TableCell>

                                            {row?.notes && (
                                                <TableCell>
                                                    <Button
                                                        sx={{ color: COLORS.secondory }}
                                                        size={'small'}
                                                        onClick={() => {
                                                            setOpenNotesModal(true);
                                                            setSelectedVisit(row);
                                                        }}
                                                        variant="standard"
                                                    >
                                                        Notes
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}

                            {loading && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={10}>
                                        <CircularProgress size={35} color="inherit" />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!!error && (
                                <TableRow sx={{ height: 400 }}>
                                    <TableCell align="center" colSpan={10}>
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
            </Paper>

            {/* -----------------------  History Modal  -------------------------------------- */}
            {openHistoryModal && (
                <IntakeHistoryComp
                    open={openHistoryModal}
                    onClose={() => {
                        setOpenHistoryModal(false);
                    }}
                    isHistoryUpdated={() => {}}
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
                    isVitalSignUpdated={() => {}}
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

            {/* -----------------------  View Reports Modal  -------------------------------------- */}
            <ModalCustom open={openNotesModal}>
                <IconButton
                    color="inherit"
                    onClick={() => setOpenNotesModal(false)}
                    sx={{ position: 'absolute', top: 8, right: 5, backgroundColor: '#fff' }}
                >
                    <CloseIcon />
                </IconButton>
                <Box>
                    <Typography>{selectedVisit?.notes}</Typography>
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
    }
};
