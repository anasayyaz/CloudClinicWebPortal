import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ------- Importing Components
import Textfield from 'ui-component/FormUI/Textfield';
import SelectCustom from 'ui-component/FormUI/Select';
import DateTimePicker from 'ui-component/FormUI/DateTimePicker';
import MuiPhoneNumber from 'material-ui-phone-number';

// ------- Importing Constants
import { BASE_URL } from 'constants/baseUrl';
import { COLORS } from 'constants/colors';

// ------- Importing Redux Store
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';

import { resetPassword } from 'services/resetPassword';

export default function EditReceptionist() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state?.user);
    const { state } = useLocation();
    const receptionist = state;

    const [mobileNo, setMobileNo] = useState(receptionist?.phoneNumber);

    const [loading, setLoading] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // =========================  Schema and validation schema of Form using Yup

    const INITIAL_FORM_STATE = {
        title: receptionist?.titles,
        employeeId: receptionist?.employeeCode,
        firstName: receptionist?.firstName,
        lastName: receptionist?.lastName,
        emailId: receptionist?.email,
        address: receptionist?.address
    };

    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        employeeId: Yup.number().typeError('Employee ID must be a number').required('Required'),
        firstName: Yup.string().trim().required('Required'),
        lastName: Yup.string().required('Required'),
        emailId: Yup.string().email('Invalid email').required('Required'),
        address: Yup.string().required('Required')
    });

    // =================================  Update Function for Updating user

    const handleUpdate = async (values, resetForm) => {
        setLoading(true);
        try {
            if (mobileNo.length < 12) {
                return toast.error('Please enter valid mobile number');
            }

            const { title, employeeId, firstName, lastName, emailId, address } = values;
            console.log(receptionist);
            const responseUpdateAccount = await axios({
                method: 'put',
                url: `${BASE_URL}api/accounts/user/${receptionist?.id}`,
                data: {
                    url: `${BASE_URL}api/accounts/user/${receptionist?.id}`,
                    id: receptionist?.id,
                    userName: emailId.trim(),
                    employeeCode: employeeId,
                    titles: title,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    fullName: `${firstName.trim()} ${lastName.trim()}`,
                    email: emailId.trim(),
                    emailConfirmed: true,
                    address: address.trim(),
                    phoneNumber: mobileNo.trim().replace(/\D/g, ''),
                    profileImage: receptionist?.profileImage,
                    logoutEnabled: false,
                    useStatus: 'Enable',
                    roles: ['Receptionist'],
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date(),
                    IsActive: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (responseUpdateAccount?.data) {
                return toast.success('Receptionist updated successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message ?? error?.response?.data?.modelState[''][0]);
        } finally {
            setLoading(false);
        }
    };

    // ====================  Reset Receptionist Password

    const handleResetPassword = async () => {
        setLoadingReset(true);
        try {
            const responseResetRecep = await resetPassword(receptionist?.id);

            if (responseResetRecep?.data) {
                return toast.success(`New Password sent to you on email: ${receptionist?.email}`);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setLoadingReset(false);
        }
    };

    // =======================  Delete Receptionist

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const responseDeleteRecep = await axios({
                method: 'delete',
                url: `${BASE_URL}api/accounts/user/${receptionist?.id}`,
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (responseDeleteRecep?.data) {
                navigate(-1);
                return toast.success('Receptionist deleted successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setOpenDeleteModal(false);
            setLoadingDelete(false);
        }
    };

    return (
        <div>
            {/* --------------------------------  Header with Edit Title and a Package Button */}

            <Grid mb={3} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Edit Receptionist
                </Typography>
            </Grid>

            {/* ------------------------------------------  Complete form using Formik and their validation using Yup */}
            <Formik
                initialValues={{
                    ...INITIAL_FORM_STATE
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values, { resetForm }) => handleUpdate(values, resetForm)}
            >
                <Form>
                    {/* --------------------------- Personal Information Card */}
                    <Typography variant="h4" mb={1} sx={{ fontWeight: 500 }} color={COLORS.color1}>
                        Personal Information
                    </Typography>

                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <Grid container direction="row" p={2} spacing={2}>
                            <Grid item lg={1} md={1.5} sm={2.5} xs={12}>
                                <SelectCustom defaultValue="" name="title" label="Title" options={['Mr', 'Ms']} />
                            </Grid>

                            <Grid item lg={3} md={2.5} sm={3.5} xs={12}>
                                <Textfield name="employeeId" label="Employee ID" />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Textfield name="firstName" label="First Name" />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Textfield name="lastName" label="Last Name" />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Textfield name="emailId" label="Email ID" />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <MuiPhoneNumber
                                    fullWidth
                                    onlyCountries={['us', 'pk']}
                                    defaultCountry={'pk'}
                                    autoFormat={true}
                                    disableAreaCodes={true}
                                    label="Mobile Number"
                                    value={mobileNo}
                                    onChange={(value) => setMobileNo(value)}
                                />
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={12}>
                                <Textfield name="address" label="Address" />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* -------------------------------  Three buttons use for Reset Password, Update and Delete Physician */}

                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
                        <Button
                            disabled={loadingReset}
                            onClick={() => handleResetPassword()}
                            variant="contained"
                            sx={{ width: 200, backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                        >
                            {loadingReset ? <CircularProgress size={25} color="inherit" /> : 'Reset Password'}
                        </Button>

                        <Button
                            disabled={loading}
                            type="submit"
                            variant="contained"
                            sx={{ width: 200, backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                        >
                            {loading ? <CircularProgress size={25} color="inherit" /> : 'Update'}
                        </Button>

                        <Button
                            disabled={loadingDelete}
                            onClick={() => setOpenDeleteModal(true)}
                            variant="contained"
                            sx={{ width: 200, backgroundColor: '#ff0011', '&: hover': { background: '#c4020f' } }}
                        >
                            Delete
                        </Button>
                    </div>
                </Form>
            </Formik>

            <ModalConfirmation
                open={openDeleteModal}
                header={'Delete Confirmation'}
                description={'Are you sure, you want to delete this nurse?'}
                loading={loadingDelete}
                onClickNo={() => setOpenDeleteModal(false)}
                onClickYes={() => handleDelete()}
            />
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
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    }
};
