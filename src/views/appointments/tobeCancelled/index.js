import React, { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    CircularProgress,
    Grid,
    IconButton,
    Typography,
    Button
} from '@mui/material';

import axios from 'axios';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//--------------  Icons
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

//--------------  Constants
import { BASE_URL } from 'constants/baseUrl';
import { COLORS } from 'constants/colors';

//--------------  Custom Components
import SearchField from 'ui-component/FormUI/SearchField.js';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';

export default function ToBeCancelled() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getVisitToBeCancelledList(newPage, rowsPerPage, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getVisitToBeCancelledList(page, event.target.value, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const [visitToBeCancelledList, setVisitToBeCancelledList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [loadingCancel, setLoadingCancel] = useState(false);

    const getVisitToBeCancelledList = async (pageNumber, pageSize, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setVisitToBeCancelledList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/cancelToBeVisitsList?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&Action=`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setVisitToBeCancelledList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVisitToBeCancelledList(page, rowsPerPage, searchQuery);
    }, []);

    const handleCancelAppointment = async () => {
        setLoadingCancel(true);
        try {
            const resCancel = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/updateCancelVisitStatus/${selectedVisit?.id}`,
                data: {
                    Id: 489,
                    Status: 10
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (resCancel?.data) {
                getVisitToBeCancelledList(page, rowsPerPage, searchQuery);
                setOpenModal(false);
                setSelectedVisit(null);
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingCancel(false);
        }
    };

    const handleContinueAppointment = async (visit) => {
        try {
            const resContinue = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/updateVisit/${visit?.id}`,
                data: {
                    Id: 489,
                    Status: 1
                },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (resContinue?.data) {
                getVisitToBeCancelledList(page, rowsPerPage, searchQuery);
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        }
    };

    return (
        <div>
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1} sx={{ py: 1 }}>
                    To Be Cancelled
                </Typography>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container justifyContent="space-between" alignItems="center" p={2} rowGap={2}>
                    <Grid item lg={4} xs={12}>
                        <SearchField
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClickSearch={() => {
                                setPage(0);
                                getVisitToBeCancelledList(0, rowsPerPage, searchQuery);
                            }}
                            onClickClear={() => {
                                setPage(0);
                                setSearchQuery('');
                                getVisitToBeCancelledList(0, rowsPerPage, '');
                            }}
                            titleSearchBtn={'Search Physician and Patients'}
                            titleClearBtn={'Clear search list'}
                        />
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print list of visits to be cancelled">
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

                                <TableCell align={'left'}>Physician Name</TableCell>

                                <TableCell align={'left'}>Date Time</TableCell>

                                <TableCell align={'left'}>Summary Notes</TableCell>

                                <TableCell align={'left'}></TableCell>

                                <TableCell align={'left'}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!visitToBeCancelledList &&
                                visitToBeCancelledList?.items?.map((row) => {
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

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.consultantName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>
                                                {moment(row?.startDateTime).format('MMM DD, YYYY  -  hh:mm A')}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.title}</TableCell>

                                            <TableCell align={'left'}>
                                                <Button
                                                    sx={{ color: 'red' }}
                                                    startIcon={<CloseIcon size={17} />}
                                                    onClick={() => {
                                                        setSelectedVisit(row);
                                                        setOpenModal(true);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </TableCell>

                                            <TableCell align={'left'}>
                                                <Button startIcon={<CheckIcon size={17} />} onClick={() => handleContinueAppointment(row)}>
                                                    Continue
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
            </Paper>

            <ModalConfirmation
                open={openModal}
                header={'Cancel Appointment'}
                description={'Are you sure, you want to cancel this appointment?'}
                loading={loadingCancel}
                onClickNo={() => setOpenModal(false)}
                onClickYes={() => handleCancelAppointment()}
            />
        </div>
    );
}
