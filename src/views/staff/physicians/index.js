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
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
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
import SearchField from 'ui-component/FormUI/SearchField.js';

export default function Physicians() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const [selectedView, setSelectedView] = useState('list');

    const handleChangePage = (event, newPage) => {
        getPhysicianList(newPage, rowsPerPage, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getPhysicianList(page, event.target.value, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const [physicianList, setPhysicianList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const getPhysicianList = async (pageNumber, pageSize, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setPhysicianList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/physician/physicianList?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }&isConfirm=false`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setPhysicianList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPhysicianList(page, rowsPerPage, searchQuery);
    }, []);

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Physicians
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
                                New Physician
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                startIcon={<IconPlus size={17} />}
                                sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                            >
                                Multiple New Physician
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
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
                                getPhysicianList(0, rowsPerPage, searchQuery);
                            }}
                            onClickClear={() => {
                                setPage(0);
                                setSearchQuery('');
                                getPhysicianList(0, rowsPerPage, '');
                            }}
                            titleSearchBtn={'Search Patient'}
                            titleClearBtn={'Clear search list'}
                        />
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print Physician List">
                            <PrintIcon />
                        </IconButton>

                        <ToggleButtonGroup
                            size="small"
                            orientation="horizontal"
                            value={selectedView}
                            exclusive
                            onChange={(e, nextView) => setSelectedView(nextView)}
                        >
                            <ToggleButton title="List View" value="list" aria-label="list">
                                <ViewListIcon />
                            </ToggleButton>
                            <ToggleButton title="Grid View" value="grid" aria-label="grid">
                                <ViewModuleIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                {selectedView == 'list' ? (
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

                                    <TableCell align={'left'}>Speciality</TableCell>

                                    <TableCell align={'left'}>Phone Number</TableCell>

                                    <TableCell align={'left'}>Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!!physicianList &&
                                    physicianList.items.map((row) => {
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
                                                    {row?.name?.toLowerCase()}
                                                </TableCell>

                                                <TableCell align={'left'}>{row?.identificationNo}</TableCell>

                                                <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                    {row?.speciality?.toLowerCase()}
                                                </TableCell>

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
                ) : (
                    <Grid container direction="row" pl={2} pr={2} spacing={2}>
                        {!!physicianList &&
                            physicianList.items.map((row) => {
                                return (
                                    <ProfileCard
                                        key={row?.nationalID}
                                        profileImage={profileImage(row?.profileImage)}
                                        name={row?.name}
                                        identificationNo={row?.identificationNo}
                                        phone={row?.phone}
                                        speciality={row?.speciality}
                                        address={row?.address}
                                        onClick={() => navigate(`edit/${row?.nationalID}`, { state: row })}
                                    />
                                );
                            })}

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
                    </Grid>
                )}

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
