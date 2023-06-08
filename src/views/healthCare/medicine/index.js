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

export default function Medicine() {
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modal, setModal] = useState({ open: false, value: null });
    const [selectedRow, setSelectedRow] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const FORM_VALIDATION = Yup.object().shape({
        name: Yup.string().trim().required('Required'),
        dosageForm: Yup.string().trim().required('Required')
    });

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

    const handleRequest = async (values, resetForm) => {
        setLoadingRequest(true);
        try {
            let method = modal.value == 'add' ? 'post' : 'put';
            let data =
                modal.value == 'add'
                    ? { ...values, createdBy: user?.id, createdOn: new Date(), isDeleted: false }
                    : { ...values, lastModifiedBy: user?.id, lastModifiedOn: new Date() };

            let url = modal.value == 'add' ? `${BASE_URL}api/medicine` : `${BASE_URL}api/medicine/${selectedRow?.medicineID}`;

            const res = await axios({
                method,
                data,
                url,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                modal.value == 'update' && getMedicineList(page);
                resetForm();
                setModal({ ...modal, open: false });
                setSelectedRow(null);
                return toast.success(`Medicine ${modal.value == 'add' ? 'Added' : 'Updated'} Successfully`);
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingRequest(false);
        }
    };

    const handleDelete = async () => {
        setLoadingRequest(true);
        try {
            const res = await axios({
                method: 'delete',
                data: {},
                url: `${BASE_URL}api/medicine/${selectedRow?.medicineID}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                setSelectedRow(null);
                getMedicineList(page);
                setOpenModal(false);
            }
        } catch (error) {
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoadingRequest(false);
        }
    };

    useEffect(() => {
        getMedicineList(page);
    }, []);

    return (
        <div>
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Medicines
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Button
                                onClick={() => setModal({ open: true, value: 'add' })}
                                variant="contained"
                                startIcon={<IconPlus size={17} />}
                                sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                            >
                                New Medicine
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <Grid container justifyContent="space-between" alignItems="center" p={2} rowGap={2}>
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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
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

                                <TableCell align={'left'}>Generic Name</TableCell>

                                <TableCell align={'left'}>Dosage Form</TableCell>

                                <TableCell align={'left'}>Purpose</TableCell>

                                <TableCell sx={{ width: 80 }}></TableCell>

                                <TableCell sx={{ width: 80 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!medicineList &&
                                medicineList?.items?.map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.medicineID}
                                            sx={{ '&:hover': { cursor: 'pointer' } }}
                                        >
                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.name?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.genericName?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'} sx={{ textTransform: 'capitalize' }}>
                                                {row?.dosageForm?.toLowerCase()}
                                            </TableCell>

                                            <TableCell align={'left'}>{row?.purpose}</TableCell>

                                            <TableCell>
                                                <IconButton
                                                    sx={{ m: -1 }}
                                                    title="Edit Medicine"
                                                    onClick={() => {
                                                        setSelectedRow(row);
                                                        setModal({ open: true, value: 'update' });
                                                    }}
                                                >
                                                    <BorderColorIcon style={{ color: COLORS.secondory }} />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell>
                                                <IconButton
                                                    sx={{ m: -1 }}
                                                    title="Delete Medicine"
                                                    onClick={() => {
                                                        setSelectedRow(row);
                                                        setOpenModal(true);
                                                    }}
                                                >
                                                    <DeleteIcon style={{ color: 'red' }} />
                                                </IconButton>
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

            <ModalConfirmation
                open={openModal}
                header={'Delete Confirmation'}
                description={'Are you sure, you want to delete this medicine?'}
                loading={loadingRequest}
                onClickNo={() => setOpenModal(false)}
                onClickYes={() => handleDelete()}
            />

            <ModalCustom open={modal.open} title={modal.value == 'add' ? 'Add Medicine' : 'Update Medicine'}>
                <Formik
                    initialValues={
                        modal.value == 'add'
                            ? {
                                  name: '',
                                  genericName: '',
                                  dosageForm: '',
                                  purpose: ''
                              }
                            : {
                                  ...selectedRow
                              }
                    }
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values, { resetForm }) => handleRequest(values, resetForm)}
                >
                    <Form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="name" label="Name" />
                            </Grid>

                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="genericName" label="Generic Name" />
                            </Grid>

                            <Grid item lg={3} md={6} sm={6} xs={12}>
                                <Textfield name="dosageForm" label="Dosage Form" />
                            </Grid>

                            <Grid item lg={9} md={6} sm={6} xs={12}>
                                <Textfield name="purpose" label="Purpose" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                                <Box sx={styles.btnContainer}>
                                    {loadingRequest ? (
                                        <CircularProgress size={25} color="inherit" />
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => setModal({ open: false, value: null })}
                                                variant="text"
                                                sx={{ color: 'red' }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                {modal.value == 'add' ? 'Save' : 'Update'}
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
