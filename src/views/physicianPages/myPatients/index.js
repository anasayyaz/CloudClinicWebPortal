import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { COLORS } from 'constants/colors';
import { profileImage } from 'utils/fetchImage';
import { useState } from 'react';
import { BASE_URL } from 'constants/baseUrl';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import ProfileCard from 'ui-component/cards/ProfileCard';
import { useSelector } from 'react-redux';
import SearchField from 'ui-component/FormUI/SearchField.js';

export default function MyPatients() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getPhysicianPatients(newPage, rowsPerPage, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getPhysicianPatients(page, event.target.value, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const [physicianPatients, setPhysicianPatients] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const getPhysicianPatients = async (pageNumber, pageSize, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setPhysicianPatients(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/physician/physicianPatients/${user.userId}?pageNumber=${
                    pageNumber + 1
                }&pageSize=${pageSize}&QuerySearch=${searchValue ?? ''}&isConfirm=false`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setPhysicianPatients(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPhysicianPatients(page, rowsPerPage, searchQuery);
    }, []);

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center" py={1}>
                <Typography variant="h3" color={COLORS.color1}>
                    Patients List
                </Typography>
            </Grid>

            {/* -------------------------------  Search Layout button */}

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container justifyContent="space-between" alignItems="center" p={2} rowGap={2}>
                    <Grid item lg={4} xs={12}>
                        <SearchField
                            label="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClickSearch={() => {
                                setPage(0);
                                getPhysicianPatients(0, rowsPerPage, searchQuery);
                            }}
                            onClickClear={() => {
                                setPage(0);
                                setSearchQuery('');
                                getPhysicianPatients(0, rowsPerPage, '');
                            }}
                            titleSearchBtn={'Search Patient'}
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
                                <TableCell align={'left'}>Profile Picture</TableCell>

                                <TableCell align={'left'}>Name</TableCell>

                                <TableCell align={'left'}>NIC</TableCell>

                                <TableCell align={'left'}>Phone Number</TableCell>

                                <TableCell align={'left'}>Location</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!physicianPatients &&
                                physicianPatients.items.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.patient_NationalID}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                            onClick={() => navigate(`visits`, { state: row })}
                                        >
                                            <TableCell align={'left'} alignItems={'center'}>
                                                <img
                                                    alt={'Profile'}
                                                    src={profileImage(row?.patientProfilImage)}
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: 20,
                                                        marginTop: -20,
                                                        marginBottom: -15,
                                                        position: 'relative'
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.patientTitle?.toLowerCase()} {row?.patientFirstName?.toLowerCase()}{' '}
                                                {row?.patientLastName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.patientIdentificationNo}</TableCell>

                                            <TableCell align={'left'}>{row?.patientPhone}</TableCell>

                                            <TableCell align={'left'}>{row?.patientAddress}</TableCell>
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
