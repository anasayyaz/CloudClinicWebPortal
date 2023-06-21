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
    Typography
} from '@mui/material';

import axios from 'axios';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

//--------------  Icons
import PrintIcon from '@mui/icons-material/Print';

//--------------  Constants
import { BASE_URL } from 'constants/baseUrl';
import { COLORS } from 'constants/colors';

//--------------  Custom Components
import SearchField from 'ui-component/FormUI/SearchField.js';

export default function Cancelled() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getCancelledVisitList(newPage, rowsPerPage, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getCancelledVisitList(page, event.target.value, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const [cancelledVisitList, setCancelledVisitList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCancelledVisitList = async (pageNumber, pageSize, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setCancelledVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/cancelVisitsList?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&isConfirm=false`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setCancelledVisitList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCancelledVisitList(page, rowsPerPage, searchQuery);
    }, []);

    return (
        <div>
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1} sx={{ py: 1 }}>
                    Cancelled Appointments
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
                                getCancelledVisitList(0, rowsPerPage, searchQuery);
                            }}
                            onClickClear={() => {
                                setPage(0);
                                setSearchQuery('');
                                getCancelledVisitList(0, rowsPerPage, '');
                            }}
                            titleSearchBtn={'Search Physician and Patients'}
                            titleClearBtn={'Clear search list'}
                        />
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print Cancelled Appointment List">
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!cancelledVisitList &&
                                cancelledVisitList?.items?.map((row) => {
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
