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

import { IconPlus } from '@tabler/icons';
import ModalCustom from 'ui-component/modals/ModalCustom';
import { FamilyRestroomOutlined } from '@mui/icons-material';
import { resetPassword } from 'services/resetPassword';
import { deleteUser } from 'services/deleteUser';
import { getDetail } from 'services/getDetail';

export default function EditNurse() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state?.user);
    const { state } = useLocation();
    const physicianNationalId = state?.nationalID;

    const [nurseDetail, setNurseDetail] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const [mobileNo, setMobileNo] = useState(state?.phone);

    const [loading, setLoading] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // ========================   Get Physician Detail

    const getNurseDetail = async () => {
        try {
            const res = await getDetail('physician', physicianNationalId);

            if (res?.data) {
                setNurseDetail(res?.data);
            }
        } catch (error) {
            console.log('error ', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getNurseDetail();
    }, []);

    // =========================  Schema and validation schema of Form using Yup

    const INITIAL_FORM_STATE = {
        title: nurseDetail?.titles,
        employeeId: nurseDetail?.employeeCode,
        firstName: nurseDetail?.name,
        lastName: nurseDetail?.lastName,
        emailId: nurseDetail?.email,
        identificationNo: nurseDetail?.identificationNo,
        gender: nurseDetail?.gender,
        dateOfBirth: new Date(nurseDetail?.dob).toLocaleDateString('en-CA'),
        address: nurseDetail?.address,
        healthCareLicenseCode: nurseDetail?.healthCareLicenseID,
        licenseValidity: new Date(nurseDetail?.healthCareLicenseValidDate).toLocaleDateString('en-CA')
    };

    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        employeeId: Yup.number().typeError('Employee ID must be a number').required('Required'),
        firstName: Yup.string().trim().required('Required'),
        lastName: Yup.string().required('Required'),
        emailId: Yup.string().email('Invalid email').required('Required'),
        identificationNo: Yup.number()
            .typeError('National ID must be a number')
            .required('Required')
            .test('length', 'Input must be exactly 13 characters', (value) => value && value.toString().length === 13),
        gender: Yup.string().required('Required'),
        dateOfBirth: Yup.date().required('Required'),
        address: Yup.string().required('Required'),
        healthCareLicenseCode: Yup.string().required('Required'),
        licenseValidity: Yup.date().required('Required')
    });

    // =================================  Update Function for Updating user

    const handleUpdate = async (values, resetForm) => {
        setLoading(true);
        try {
            if (mobileNo.length < 12) {
                return toast.error('Please enter valid mobile number');
            }

            const {
                title,
                employeeId,
                firstName,
                lastName,
                emailId,
                identificationNo,
                gender,
                dateOfBirth,
                address,
                healthCareLicenseCode,
                licenseValidity
            } = values;

            const responseUpdateAccount = await axios({
                method: 'put',
                url: `${BASE_URL}api/accounts/user/${nurseDetail?.userID}`,
                data: {
                    url: `${BASE_URL}api/accounts/user/${nurseDetail?.userID}`,
                    id: nurseDetail?.userID,
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
                    profileImage: nurseDetail.profileImage,
                    logoutEnabled: false,
                    useStatus: 'Enable',
                    roles: ['Nurse'],
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date(),
                    identificationNo: identificationNo.trim(),
                    IsActive: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (responseUpdateAccount?.data) {
                const data = {
                    ...nurseDetail,
                    identificationNo: identificationNo.trim(),
                    healthCareLicenseID: healthCareLicenseCode.trim(),
                    titles: title,
                    name: firstName.trim(),
                    lastName: lastName.trim(),
                    dob: dateOfBirth,
                    gender: gender.trim(),
                    address: address.trim(),
                    phone: mobileNo.trim().replace(/\D/g, ''),
                    healthCareLicenseValidDate: licenseValidity,
                    email: emailId.trim(),
                    employeeCode: employeeId.trim(),
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date()
                };

                const responseUpdateNurse = await axios({
                    method: 'put',
                    url: `${BASE_URL}api/physician/${nurseDetail?.nationalID}`,
                    data,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                if (responseUpdateNurse?.data) {
                    return toast.success('Nurse updated successfully');
                }
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message ?? error?.response?.data?.modelState[''][0]);
        } finally {
            setLoading(false);
        }
    };

    // ====================  Reset Nurse Password

    const handleResetPassword = async () => {
        setLoadingReset(true);
        try {
            const responseResetNurse = await resetPassword(nurseDetail?.userID);

            if (responseResetNurse?.data) {
                return toast.success(`New Password sent to you on email: ${nurseDetail?.email}`);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setLoadingReset(false);
        }
    };

    // =======================  Delete Nurse only from Nurse Table

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const responseDeleteNurse = await deleteUser('physician', nurseDetail?.nationalID);

            if (responseDeleteNurse?.data) {
                navigate(-1);
                return toast.success('Nurse deleted successfully');
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
                    Edit Nurse
                </Typography>
            </Grid>

            {/* ------------------------------------------  Complete form using Formik and their validation using Yup */}
            {!!nurseDetail && (
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

                                <Grid item lg={2} md={2.5} sm={3.5} xs={12}>
                                    <Textfield name="employeeId" label="Employee ID" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="firstName" label="First Name" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="lastName" label="Last Name" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="emailId" label="Email ID" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="identificationNo" label="National ID" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <SelectCustom defaultValue="" name="gender" label="Gender" options={['Male', 'Female']} />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <DateTimePicker name="dateOfBirth" label="Date of Birth" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
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

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="healthCareLicenseCode" label="Healthcare License Code" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <DateTimePicker name="licenseValidity" label="Healthcare License Validity" />
                                </Grid>

                                <Grid item lg={6} md={4} sm={12} xs={12}>
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
            )}

            {loadingData && (
                <Grid sx={styles.loadingContainer}>
                    <CircularProgress size={35} color="inherit" />
                </Grid>
            )}

            {!!error && (
                <Grid sx={styles.loadingContainer}>
                    <Typography>{error?.response?.data?.message ?? error?.message}</Typography>
                </Grid>
            )}

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
