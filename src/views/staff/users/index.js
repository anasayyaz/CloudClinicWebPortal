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
import ProfileCard1 from 'ui-component/cards/ProfileCard1';
import SearchField from 'ui-component/FormUI/SearchField.js';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';
import { resetPassword } from 'services/resetPassword';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Users() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(12);
    const [count, setCount] = useState(0);

    const [selectedRole, setSelectedRole] = useState('all');

    const handleChangePage = (event, newPage) => {
        getUserList(newPage, rowsPerPage, selectedRole, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getUserList(page, event.target.value, selectedRole, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const handleSelectedRole = (e) => {
        getUserList(0, rowsPerPage, e.target.value, searchQuery);
        setSelectedRole(e.target.value);
        setPage(0);
    };

    const [userList, setUserList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [statusData, setStatusData] = useState({});
    const [loadingReset, setLoadingReset] = useState(false);

    const getUserList = async (pageNumber, pageSize, role, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setUserList(null);

            let userRole = role == 'all' ? '' : `&roleName=${role}`;

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/accounts/getAllUsers/users?pageNumber=${pageNumber + 1}&pageSize=${pageSize}&QuerySearch=${
                    searchValue ?? ''
                }${userRole}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setUserList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        setLoadingStatus(true);
        try {
            const { selectedUser, isActive } = statusData;

            let url = '';
            let data = {};

            if (selectedUser?.roles?.toLowerCase() == 'receptionist') {
                url = `${BASE_URL}api/accounts/updateUserStatus/${selectedUser?.userId}`;
                data = { lockoutEnabled: isActive == true ? 0 : 1 };
            } else if (selectedUser?.roles?.toLowerCase() == 'patient') {
                url = `${BASE_URL}api/patient/updateStatus/${selectedUser?.userId}`;
                data = {
                    isActive: isActive == true ? 1 : 0,
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date()
                };
            } else {
                url = `${BASE_URL}api/physician/updateStatus/${selectedUser?.userId}`;
                data = {
                    isActive: isActive == true ? 1 : 0,
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date()
                };
            }

            const res = await axios({
                method: 'put',
                url,
                data,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                getUserList(page, rowsPerPage, selectedRole, searchQuery);
                return toast.success('Status updated successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setOpenStatusModal(false);
            setLoadingStatus(false);
        }
    };

    const handleResetPassword = async (selectedUser) => {
        setLoadingReset(true);
        try {
            const responseResetPatient = await resetPassword(selectedUser?.userId);

            if (responseResetPatient?.data) {
                return toast.success(`New Password sent to you on email: ${selectedUser?.email}`);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setLoadingReset(false);
        }
    };

    useEffect(() => {
        getUserList(page, rowsPerPage, selectedRole, searchQuery);
    }, []);

    return (
        <div>
            {/* --------------------------  Header with title and two button for Add User and Multiple User */}

            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1} sx={{ py: 1 }}>
                    Users
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
                                        getUserList(0, rowsPerPage, selectedRole, searchQuery);
                                    }}
                                    onClickClear={() => {
                                        setPage(0);
                                        setSearchQuery('');
                                        getUserList(0, rowsPerPage, selectedRole, '');
                                    }}
                                    titleSearchBtn={'Search User'}
                                    titleClearBtn={'Clear user list'}
                                />
                            </Grid>

                            <Grid lg={2} xs={12}>
                                <FormControl label="Role" fullWidth>
                                    <InputLabel id="role-label">Role</InputLabel>
                                    <Select labelId="role-label" label="Role" value={selectedRole} onChange={handleSelectedRole}>
                                        <MenuItem value={'all'}>All</MenuItem>
                                        <MenuItem value={'physician'}>Physician</MenuItem>
                                        <MenuItem value={'patient'}>Patient</MenuItem>
                                        <MenuItem value={'nurse'}>Nurse</MenuItem>
                                        <MenuItem value={'receptionist'}>Receptionist</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print User List">
                            <PrintIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <Grid container direction="row" pl={2} pr={2} spacing={2}>
                    {!!userList &&
                        userList.items.map((row) => {
                            return (
                                <ProfileCard1
                                    key={row?.userId}
                                    profileImage={profileImage(row?.profileImage)}
                                    name={row?.titles + ' ' + row?.fullName}
                                    role={row?.roles}
                                    phoneNumber={row?.phoneNumber}
                                    isActive={row?.userStatus}
                                    onClickResetPassword={() => handleResetPassword(row)}
                                    onChangeSwitch={(e) => {
                                        setStatusData({ isActive: e?.target?.checked, selectedUser: row });
                                        setOpenStatusModal(true);
                                    }}
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
                            <Typography>{error?.response?.data?.message ?? error?.response?.data ?? error?.message}</Typography>
                        </Grid>
                    )}
                </Grid>

                <TablePagination
                    rowsPerPageOptions={[8, 12, 16]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <ModalConfirmation
                    open={openStatusModal}
                    header={'Status Confirmation'}
                    description={`Are you sure, you want to change ${statusData?.selectedUser?.roles} '${statusData?.selectedUser?.fullName}' status?`}
                    loading={loadingStatus}
                    onClickNo={() => setOpenStatusModal(false)}
                    onClickYes={() => handleUpdateStatus()}
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
