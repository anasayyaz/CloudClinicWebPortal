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
    MenuItem,
    TextField
} from '@mui/material';

// -----------------  Importing Icons
import { IconPlus } from '@tabler/icons';
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

export default function Completed() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const navigate = useNavigate();

    const [completedVisitList, setCompletedVisitList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [isPaid, setIsPaid] = useState('all');

    const curDate = new Date();

    const [startDate, setStartDate] = useState(
        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 14).toLocaleDateString('en-CA')
    );
    const [endDate, setEndDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChangePage = (event, newPage) => {
        getCompletedVisitList(newPage, rowsPerPage, isPaid, startDate, endDate, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getCompletedVisitList(page, event.target.value, isPaid, startDate, endDate, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const handleIsPaid = (e) => {
        getCompletedVisitList(0, rowsPerPage, e.target.value, startDate, endDate, searchQuery);
        setIsPaid(e.target.value);
        setPage(0);
    };

    const handleStartDate = (e) => {
        getCompletedVisitList(0, rowsPerPage, isPaid, e.target.value, endDate, searchQuery);
        setStartDate(e.target.value);
        setPage(0);
    };

    const handleEndDate = (e) => {
        getCompletedVisitList(0, rowsPerPage, isPaid, startDate, e.target.value, searchQuery);
        setEndDate(e.target.value);
        setPage(0);
    };

    const getCompletedVisitList = async (pageNumber, pageSize, paid, start, end, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setCompletedVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/CompletedVisitsList?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&StartDate=${start}&EndDate=${end}&isPaid=${paid == 'all' ? '' : paid}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setCompletedVisitList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCompletedVisitList(page, rowsPerPage, isPaid, startDate, endDate, searchQuery);
    }, []);

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1} sx={{ py: 1 }}>
                    Completed Appointments
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
                                        getCompletedVisitList(0, rowsPerPage, isPaid, startDate, endDate, searchQuery);
                                    }}
                                    onClickClear={() => {
                                        setPage(0);
                                        setSearchQuery('');
                                        getCompletedVisitList(0, rowsPerPage, isPaid, startDate, endDate, '');
                                    }}
                                    titleSearchBtn={'Search Physician and Patient'}
                                    titleClearBtn={'Clear search list'}
                                />
                            </Grid>

                            <Grid lg={2} xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    label="Start Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={startDate}
                                    onChange={handleStartDate}
                                />
                            </Grid>

                            <Grid lg={2} xs={12}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    variant="outlined"
                                    label="End Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={endDate}
                                    onChange={handleEndDate}
                                />
                            </Grid>

                            <Grid lg={2} xs={12}>
                                <FormControl fullWidth>
                                    <Select value={isPaid} onChange={handleIsPaid}>
                                        <MenuItem value={'all'}>All</MenuItem>
                                        <MenuItem value={true}>Paid</MenuItem>
                                        <MenuItem value={false}>Un-Paid</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print Completed Visit List">
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

                                <TableCell align={'left'}>Fee</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!completedVisitList &&
                                completedVisitList?.items?.map((row) => {
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

                                            <TableCell align={'left'}>{row?.amount}</TableCell>
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
                                        <Typography>{error?.response?.data?.message || error?.response?.data || error?.message}</Typography>
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
