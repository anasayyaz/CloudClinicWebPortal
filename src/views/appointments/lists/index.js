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
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
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
import ModalCustom from 'ui-component/modals/ModalCustom';
import { Form, Formik } from 'formik';
import Textfield from 'ui-component/FormUI/Textfield';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';

export default function Lists() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getMedicineList(newPage);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [medicineList, setMedicineList] = useState(null);
    const [searchQuery, setSearchQuery] = useState();
    const [isConfirm, setIsConfirm] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMedicineList = async (pageNumber) => {
        try {
            setLoading(true);
            setError(null);
            setMedicineList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/medicine/medicinesList?pageNumber=${pageNumber + 1}&pageSize=${rowsPerPage}&QuerySearch=${
                    searchQuery ?? ''
                }&isConfirm=false`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setMedicineList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMedicineList(page);
    }, []);

    return (
        <div>
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Appointment List
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <FormControl sx={{ width: 130 }}>
                        <Select size="small" value={isConfirm} onChange={(e) => setIsConfirm(e.target.value)}>
                            <MenuItem value={'all'}>All</MenuItem>
                            <MenuItem value={'true'}>Confirmed</MenuItem>
                            <MenuItem value={'false'}>Unconfirmed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid container justifyContent="space-between" alignItems="center" rowGap={2}>
                <FormControl
                    onSubmit={() => {
                        setPage(0);
                        getMedicineList(0);
                    }}
                    sx={{ width: '50ch' }}
                    variant="outlined"
                >
                    <InputLabel>Search</InputLabel>
                    <OutlinedInput
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                {searchQuery && (
                                    <Button type="submit" variant="text" sx={{ color: 'gray' }} onClick={() => setSearchQuery('')}>
                                        Clear
                                    </Button>
                                )}

                                <IconButton
                                    type="submit"
                                    title="Search Medicine"
                                    onClick={() => {
                                        setPage(0);
                                        getMedicineList(0);
                                    }}
                                    edge="end"
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Search"
                    />
                </FormControl>

                <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton title="Print Medicine List">
                        <PrintIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2, p: 2 }}>
                <Grid container direction={'row'}>
                    <Grid item lg={2}>
                        <Box sx={{ width: 40, height: 40, backgroundColor: '#f0f0f0' }} />

                        <FormControlLabel control={<Switch />} label="Unconfirmed" />
                    </Grid>

                    <Grid item lg={3.5} sx={{ backgroundColor: 'yellow' }}>
                        <Typography>Hello</Typography>
                    </Grid>

                    <Grid item lg={3.5} sx={{ backgroundColor: 'green' }}>
                        <Typography>Hello</Typography>
                    </Grid>

                    <Grid item lg={3} sx={{ backgroundColor: 'gray' }}>
                        <Typography>Hello</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
            </Paper>
        </div>
    );
}

const styles = {
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    }
};
