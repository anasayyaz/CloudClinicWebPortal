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
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Typography,
    Select,
    MenuItem
} from '@mui/material';

// -----------------  Importing Icons
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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
import useFetch from 'hooks/useFetch';
import moment from 'moment';

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
                                                <Button onClick={() => {}} sx={{ color: COLORS.secondory }}>
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
                                        <Typography>{error?.response?.data?.message ?? error?.message}</Typography>
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
