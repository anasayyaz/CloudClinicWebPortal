import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    Typography
} from '@mui/material';

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
import { getDetail } from 'services/getDetail';
import { deleteUser } from 'services/deleteUser';

export default function EditPatient() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state?.user);
    const { state } = useLocation();
    const patientNationalId = state?.nationalID;

    const [patientDetail, setPatientDetail] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const [mobileNo, setMobileNo] = useState(state?.phone);
    const [guardianPhone, setGuardianPhone] = useState('');
    const [inHospital, setInHospital] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // ========================   Get Patient Detail

    const getPatientDetail = async () => {
        try {
            const res = await getDetail('patient', patientNationalId);

            if (res?.data) {
                setPatientDetail(res?.data);
                setGuardianPhone(res?.data?.guardianPhone);
                setInHospital(res?.data?.inHospital);
            }
        } catch (error) {
            console.log('error ', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getPatientDetail();
    }, []);

    // =========================  Schema and validation schema of Form using Yup

    const INITIAL_FORM_STATE = {
        title: patientDetail?.titles,
        mrNumber: patientDetail?.mrNumber,
        firstName: patientDetail?.name,
        lastName: patientDetail?.lastName,
        emailId: patientDetail?.email,
        identificationNo: patientDetail?.identificationNo,
        gender: patientDetail?.gender,
        dateOfBirth: new Date(patientDetail?.dob).toLocaleDateString('en-CA'),
        address: patientDetail?.address,
        guardianName: patientDetail?.guardianName
    };

    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        mrNumber: Yup.number().typeError('Medical Record No. must be a number').required('Required'),
        firstName: Yup.string().trim().required('Required'),
        lastName: Yup.string().required('Required'),
        emailId: Yup.string().email('Invalid email').required('Required'),
        identificationNo: Yup.number()
            .typeError('National ID must be a number')
            .required('Required')
            .test('length', 'Input must be exactly 13 characters', (value) => value && value.toString().length === 13),
        gender: Yup.string().required('Required'),
        dateOfBirth: Yup.date().required('Required'),
        address: Yup.string().required('Required')
    });

    // =================================  Update Function for Updating user

    const handleUpdate = async (values, resetForm) => {
        setLoading(true);
        try {
            if (mobileNo.length < 12) {
                return toast.error('Please enter valid mobile number');
            }

            const { title, mrNumber, firstName, lastName, emailId, identificationNo, gender, dateOfBirth, address, guardianName } = values;

            const responseUpdateAccount = await axios({
                method: 'put',
                url: `${BASE_URL}api/accounts/user/${patientDetail?.userID}`,
                data: {
                    url: `${BASE_URL}api/accounts/user/${patientDetail?.userID}`,
                    id: patientDetail?.userID,
                    userName: emailId.trim(),
                    employeeCode: mrNumber.trim(),
                    titles: title,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    fullName: `${firstName.trim()} ${lastName.trim()}`,
                    email: emailId.trim(),
                    emailConfirmed: true,
                    address: address.trim(),
                    phoneNumber: mobileNo.trim().replace(/\D/g, ''),
                    profileImage: patientDetail.profileImage,
                    logoutEnabled: false,
                    useStatus: 'Enable',
                    roles: ['Patient'],
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
                    ...patientDetail,
                    identificationNo: identificationNo.trim(),
                    titles: title,
                    name: firstName.trim(),
                    lastName: lastName.trim(),
                    dob: dateOfBirth,
                    gender: gender.trim(),
                    address: address.trim(),
                    phone: mobileNo.trim().replace(/\D/g, ''),
                    email: emailId.trim(),
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date(),
                    mrNumber: mrNumber.trim(),
                    inHospital: inHospital,
                    guardianName: guardianName.trim(),
                    guardianPhone: guardianPhone.trim().replace(/\D/g, '')
                };

                const responseUpdatePatient = await axios({
                    method: 'put',
                    url: `${BASE_URL}api/patient/${patientDetail?.nationalID}`,
                    data,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                if (responseUpdatePatient?.data) {
                    return toast.success('Patient updated successfully');
                }
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message ?? error?.response?.data?.modelState[''][0]);
        } finally {
            setLoading(false);
        }
    };

    // ====================  Reset Patient Password

    const handleResetPassword = async () => {
        setLoadingReset(true);
        try {
            const responseResetPatient = await resetPassword(patientDetail?.userID);

            if (responseResetPatient?.data) {
                return toast.success(`New Password sent to you on email: ${patientDetail?.email}`);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setLoadingReset(false);
        }
    };

    // =======================  Delete Patient only from Patient Table

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const responseDeletePatient = await deleteUser('patient', patientDetail?.nationalID);

            if (responseDeletePatient?.data) {
                navigate(-1);
                return toast.success('Patient deleted successfully');
            }
        } catch (error) {
            console.log(error);
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
                    Edit Patient
                </Typography>
            </Grid>

            {/* ------------------------------------------  Complete form using Formik and their validation using Yup */}
            {!!patientDetail && (
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
                                    <Textfield name="mrNumber" label="Medical Record No." />
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
                                    <DateTimePicker
                                        name="dateOfBirth"
                                        label="Date of Birth"
                                        InputProps={{
                                            inputProps: {
                                                max: new Date().toLocaleDateString('en-CA')
                                            }
                                        }}
                                    />
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
                                    <Textfield name="guardianName" label="Guardian Name" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <MuiPhoneNumber
                                        fullWidth
                                        onlyCountries={['us', 'pk']}
                                        defaultCountry={'pk'}
                                        autoFormat={true}
                                        disableAreaCodes={true}
                                        label="Guardian Mobile Number"
                                        value={guardianPhone}
                                        onChange={(value) => setGuardianPhone(value)}
                                    />
                                </Grid>

                                <Grid item lg={6} md={4} sm={12} xs={12}>
                                    <Textfield name="address" label="Address" />
                                </Grid>

                                <Grid item lg={6} md={4} sm={12} xs={12}>
                                    <FormControlLabel
                                        control={<Switch checked={inHospital} onChange={(e) => setInHospital(e.target.checked)} />}
                                        label="In Hospital"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* -------------------------------  Three buttons use for Reset Password, Update and Delete Patient */}

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
                description={'Are you sure, you want to delete this patient?'}
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
