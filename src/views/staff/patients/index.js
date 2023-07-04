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

export default function Patients() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const navigate = useNavigate();

    const [patientList, setPatientList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [inHospital, setInHospital] = useState('all');
    const [wardId, setWardId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleChangePage = (event, newPage) => {
        getPatientList(newPage, rowsPerPage, inHospital, wardId, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getPatientList(page, event.target.value, inHospital, wardId, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const handleInHospital = (e) => {
        getPatientList(0, rowsPerPage, e.target.value, wardId, searchQuery);
        setInHospital(e.target.value);
        setPage(0);
    };

    const handleWard = (e) => {
        getPatientList(0, rowsPerPage, inHospital, e.target.value, searchQuery);
        setWardId(e.target.value);
        setPage(0);
    };

    const { data: wardList, loading: loadingWardList, error: errorWardList, refetch: refetchWardList } = useFetch(`${BASE_URL}api/ward`);

    const getPatientList = async (pageNumber, pageSize, hospital, ward, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setPatientList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/patient/patientsList?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&InHospital=${hospital == 'all' ? '' : hospital}&WardID=${hospital == true ? ward ?? '' : ''}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setPatientList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPatientList(page, rowsPerPage, inHospital, wardId, searchQuery);
    }, []);

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Patients
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button
                                onClick={() => navigate('add')}
                                variant="contained"
                                startIcon={<IconPlus size={17} />}
                                sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                            >
                                New Patient
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                startIcon={<IconPlus size={17} />}
                                sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                            >
                                Multiple New Patient
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
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
                                        getPatientList(0, rowsPerPage, inHospital, wardId, searchQuery);
                                    }}
                                    onClickClear={() => {
                                        setPage(0);
                                        setSearchQuery('');
                                        getPatientList(0, rowsPerPage, inHospital, wardId, '');
                                    }}
                                    titleSearchBtn={'Search Patient'}
                                    titleClearBtn={'Clear search list'}
                                />
                            </Grid>

                            <Grid lg={2} xs={12}>
                                <FormControl fullWidth>
                                    <Select value={inHospital} onChange={handleInHospital}>
                                        <MenuItem value={'all'}>All Patients</MenuItem>
                                        <MenuItem value={true}>In-Hospital</MenuItem>
                                        <MenuItem value={false}>Outside-Hospital</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {inHospital == true && (
                                <Grid lg={2} xs={12}>
                                    <FormControl label="Ward" fullWidth>
                                        <InputLabel id="ward-label">Ward</InputLabel>
                                        <Select labelId="ward-label" label="Ward" value={wardId} onChange={handleWard}>
                                            {wardList?.map((ward) => (
                                                <MenuItem value={ward?.wardID}>{ward?.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            )}
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
                                <TableCell align={'left'}>Profile Picture</TableCell>

                                <TableCell align={'left'}>Name</TableCell>

                                <TableCell align={'left'}>NIC</TableCell>

                                <TableCell align={'left'}>Phone Number</TableCell>

                                <TableCell align={'left'}>Location</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!patientList &&
                                patientList.items.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.nationalID}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                            onClick={() => navigate(`edit/${row?.nationalID}`, { state: row })}
                                        >
                                            <TableCell align={'left'} alignItems={'center'}>
                                                <img
                                                    alt={'Profile'}
                                                    src={profileImage(row?.profileImage)}
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
                                                {row?.name?.toLowerCase()} {row?.lastName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.identificationNo}</TableCell>

                                            <TableCell align={'left'}>{row?.phone}</TableCell>

                                            <TableCell align={'left'}>{row?.address}</TableCell>
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
