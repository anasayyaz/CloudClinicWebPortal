import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    Button,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
    Box,
    Modal
} from '@mui/material';
import { COLORS } from 'constants/colors';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from 'constants/baseUrl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import useFetch from 'hooks/useFetch';
import Textfield from 'ui-component/FormUI/Textfield';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';
import ModalCustom from 'ui-component/modals/ModalCustom';

export default function Location() {
    const { user } = useSelector((state) => state?.user);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
    const [selectedRowToUpdate, setSelectedRowToUpdate] = useState(null);

    const {
        data: locationList,
        loading: loadingLocationList,
        error: errorLocationList,
        refetch: refetchLocationList
    } = useFetch(`${BASE_URL}api/location?pageNumber=1&pageSize=100&QuerySearch=`);

    const filteredLocations = locationList?.filter((location) => location?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    const INITIAL_FORM_STATE = {
        name: '',
        address: '',
        contactNo: '',
        contactPerson: ''
    };

    const regExp = /\b\d{12}\b/;
    const FORM_VALIDATION = Yup.object().shape({
        name: Yup.string().trim().required('Required'),
        address: Yup.string().trim().required('Required'),
        contactNo: Yup.string().matches(regExp, { message: 'Must be exactly 12 numbers', excludeEmptyString: true }).required('Required')
    });

    const handleSubmit = async (values, resetForm) => {
        setLoading(true);
        try {
            const data = { ...values, createdBy: user?.id, createdOn: new Date(), isDeleted: false };

            const res = await axios({
                method: 'post',
                data,
                url: `${BASE_URL}api/location`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                refetchLocationList();
                resetForm();
                return toast.success('Location Added Successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (values, resetForm) => {
        setLoadingUpdate(true);
        try {
            let data = { ...values, lastModifiedBy: user?.id, lastModifiedOn: new Date() };

            const res = await axios({
                method: 'put',
                data,
                url: `${BASE_URL}api/location/${selectedRowToUpdate?.locationID}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                refetchLocationList();
                setOpenUpdateModal(false);
                setSelectedRowToUpdate(null);
                resetForm();
                return toast.success('Location updated successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const res = await axios({
                method: 'delete',
                url: `${BASE_URL}api/location/${selectedRowToDelete?.locationID}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                setSelectedRowToDelete(null);
                refetchLocationList();
                setOpenModal(false);
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <div>
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Location
                </Typography>
            </Grid>

            <Formik
                initialValues={{
                    ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
            >
                <Form>
                    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2, mb: 2 }}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <Textfield name="name" label="Name" />
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <Textfield name="address" label="Address" />
                            </Grid>

                            <Grid item lg={2} md={4} sm={4} xs={12}>
                                <Textfield name="contactNo" label="Contact No" />
                            </Grid>

                            <Grid item lg={2} md={4} sm={4} xs={12}>
                                <Textfield name="contactPerson" label="Contact Person" />
                            </Grid>

                            <Grid item lg={2} md={4} sm={4} xs={12} mt={1}>
                                <Button
                                    disabled={loading}
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                                >
                                    {loading ? <CircularProgress size={25} color="inherit" /> : 'Save'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Form>
            </Formik>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container justifyContent="space-between" alignItems="center" p={2} rowGap={2}>
                    <FormControl sx={{ width: '50ch' }} variant="outlined">
                        <InputLabel>Search</InputLabel>
                        <OutlinedInput
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    {searchQuery?.length > 0 ? (
                                        <IconButton type="submit" title="End Searching" onClick={() => setSearchQuery('')} edge="end">
                                            <CloseIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton type="submit" title="Search Location" edge="end">
                                            <SearchIcon />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            }
                            label="Search"
                        />
                    </FormControl>

                    <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <IconButton title="Print Location List">
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
                                <TableCell align={'left'}>Name</TableCell>

                                <TableCell align={'left'}>Address</TableCell>

                                <TableCell align={'left'}>Contact No</TableCell>

                                <TableCell align={'left'}>Person Contact</TableCell>

                                <TableCell sx={{ width: 80 }}></TableCell>

                                <TableCell sx={{ width: 80 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!locationList &&
                                filteredLocations?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.id}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                        >
                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.name?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.address?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.contactNo}</TableCell>

                                            <TableCell align={'left'}>{row?.contactPerson}</TableCell>

                                            <TableCell>
                                                <IconButton
                                                    sx={{ m: -1 }}
                                                    title="Edit Location"
                                                    onClick={() => {
                                                        setSelectedRowToUpdate(row);
                                                        setOpenUpdateModal(true);
                                                    }}
                                                >
                                                    <BorderColorIcon style={{ color: COLORS.secondory }} />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell>
                                                <IconButton
                                                    sx={{ m: -1 }}
                                                    title="Delete Location"
                                                    onClick={() => {
                                                        setOpenModal(true);
                                                        setSelectedRowToDelete(row);
                                                    }}
                                                >
                                                    <DeleteIcon style={{ color: 'red' }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            {loadingLocationList && (
                                <TableRow sx={{ height: 300 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <CircularProgress size={35} color="inherit" />
                                    </TableCell>
                                </TableRow>
                            )}

                            {!!errorLocationList && (
                                <TableRow sx={{ height: 300 }}>
                                    <TableCell align="center" colSpan={6}>
                                        <Typography>{errorLocationList?.response?.data?.message ?? errorLocationList?.message}</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <ModalConfirmation
                open={openModal}
                header={'Delete Confirmation'}
                description={'Are you sure, you want to delete this location?'}
                loading={loadingDelete}
                onClickNo={() => setOpenModal(false)}
                onClickYes={() => handleDelete()}
            />

            <ModalCustom open={openUpdateModal} title={'Update Location'}>
                <Formik
                    initialValues={{
                        ...selectedRowToUpdate
                    }}
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values, { resetForm }) => handleUpdate(values, resetForm)}
                >
                    <Form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="name" label="Name" />
                            </Grid>

                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="address" label="Address" />
                            </Grid>

                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="contactNo" label="Contact No" />
                            </Grid>

                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="contactPerson" label="Contact Person" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                                <Box sx={styles.btnContainer}>
                                    {loadingUpdate ? (
                                        <CircularProgress size={25} color="inherit" />
                                    ) : (
                                        <>
                                            <Button onClick={() => setOpenUpdateModal(false)} variant="text" sx={{ color: 'red' }}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                Update
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                </Formik>
            </ModalCustom>
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
