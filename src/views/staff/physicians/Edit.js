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

export default function EditPhysician() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state?.user);
    const { state } = useLocation();
    const physicianNationalId = state?.nationalID;

    const [physicianDetail, setPhysicianDetail] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const [specialityData, setSpecialityData] = useState(null);

    const [mobileNo, setMobileNo] = useState(state?.phone);
    const [selectedSpeciality, setSelectedSpeciality] = useState(state?.speciality);
    const [selectedColor, setSelectedColor] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingPackage, setLoadingPackage] = useState(false);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openPackageModal, setOpenPackageModal] = useState(false);

    // ========================   Get Physician Detail

    const getPhysicianDetail = async () => {
        try {
            const res = await getDetail('physician', physicianNationalId);

            const resSpecialityList = await axios({
                method: 'get',
                url: `${BASE_URL}api/colorcode/speciality`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                setPhysicianDetail(res?.data);
                setSelectedColor(res?.data?.colorCode);
                setSpecialityData(resSpecialityList?.data);
            }
        } catch (error) {
            console.log('error ', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        getPhysicianDetail();
    }, []);

    // =========================  Schema and validation schema of Form using Yup

    const INITIAL_FORM_STATE = {
        title: physicianDetail?.titles,
        employeeId: physicianDetail?.employeeCode,
        firstName: physicianDetail?.name,
        lastName: physicianDetail?.lastName,
        emailId: physicianDetail?.email,
        identificationNo: physicianDetail?.identificationNo,
        gender: physicianDetail?.gender,
        dateOfBirth: new Date(physicianDetail?.dob).toLocaleDateString('en-CA'),
        address: physicianDetail?.address,
        currentAppointment: '',
        fee: physicianDetail?.feeShare,
        degree: physicianDetail?.degree,
        healthCareLicenseCode: physicianDetail?.healthCareLicenseID,
        licenseValidity: new Date(physicianDetail?.healthCareLicenseValidDate).toLocaleDateString('en-CA')
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
        fee: Yup.number().typeError('Invalid Fee').required('Required').max(99, 'Fee share must be less than 100, it is in %'),
        degree: Yup.string().required('Required'),
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
            if (selectedColor == '' || selectedSpeciality == '') {
                return toast.error('Please fill speciality and calendar color');
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
                currentAppointment,
                fee,
                degree,
                healthCareLicenseCode,
                licenseValidity
            } = values;

            const responseCreateAccount = await axios({
                method: 'put',
                url: `${BASE_URL}api/accounts/user/${physicianDetail?.userID}`,
                data: {
                    url: `${BASE_URL}api/accounts/user/${physicianDetail?.userID}`,
                    id: physicianDetail?.userID,
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
                    profileImage: physicianDetail.profileImage,
                    logoutEnabled: false,
                    useStatus: 'Enable',
                    roles: ['Physician'],
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date(),
                    feeShare: fee,
                    identificationNo: identificationNo.trim(),
                    colorCode: selectedColor.trim(),
                    IsActive: true
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (responseCreateAccount?.data) {
                const data = {
                    ...physicianDetail,
                    identificationNo: identificationNo.trim(),
                    choosenColor: selectedColor.trim(),
                    healthCareLicenseID: healthCareLicenseCode.trim(),
                    titles: title,
                    Name: firstName.trim(),
                    LastName: lastName.trim(),
                    dob: dateOfBirth,
                    gender: gender.trim(),
                    address: address.trim(),
                    phone: mobileNo.trim().replace(/\D/g, ''),
                    healthCareLicenseValidDate: licenseValidity,
                    speciality: selectedSpeciality.trim(),
                    Email: emailId.trim(),
                    title: degree.trim(),
                    degree: degree.trim(),
                    EmployeeCode: employeeId.trim(),
                    feeShare: fee,
                    colorCode: selectedColor.trim(),
                    lastModifiedBy: user?.userId,
                    lastModifiedOn: new Date()
                };

                const responseCreatePhysician = await axios({
                    method: 'put',
                    url: `${BASE_URL}api/physician/${physicianDetail?.nationalID}`,
                    data,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                if (responseCreatePhysician?.data) {
                    return toast.success('Physician updated successfully');
                }
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message ?? error?.response?.data?.modelState[''][0]);
        } finally {
            setLoading(false);
        }
    };

    // ====================  Reset Physician Password

    const handleResetPassword = async () => {
        setLoadingReset(true);
        try {
            const responseResetPhysician = await resetPassword(physicianDetail?.userID);

            if (responseResetPhysician?.data) {
                return toast.success(`New Password sent to you on email: ${physicianDetail?.email}`);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setLoadingReset(false);
        }
    };

    // =======================  Delete Physician only from Physician Table

    const handleDelete = async () => {
        setLoadingDelete(true);
        try {
            const responseDeletePhysician = await deleteUser('physician', physicianDetail?.nationalID);

            if (responseDeletePhysician?.data) {
                navigate(-1);
                return toast.success('Physician deleted successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setOpenDeleteModal(false);
            setLoadingDelete(false);
        }
    };

    // =======================  Adding Physician Package

    const handleAddPackage = async (values, resetForm) => {
        setLoadingPackage(true);
        try {
            const data = {
                ...values,
                Consultant_NationalID: physicianDetail?.nationalID,
                createdBy: user?.userId,
                createdOn: new Date()
            };

            const res = await axios({
                method: 'post',
                url: `${BASE_URL}api/physicianFee`,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                resetForm();
                return toast.error('Package Added Successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setOpenPackageModal(false);
            setLoadingPackage(false);
        }
    };

    return (
        <div>
            {/* --------------------------------  Header with Edit Title and a Package Button */}

            <Grid mb={3} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Edit Physician
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <Button
                        onClick={() => setOpenPackageModal(true)}
                        variant="contained"
                        startIcon={<IconPlus size={17} />}
                        sx={{ backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                    >
                        Package
                    </Button>
                </Grid>
            </Grid>

            {/* ------------------------------------------  Complete form using Formik and their validation using Yup */}
            {!!physicianDetail && (
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
                                    <SelectCustom defaultValue="" name="title" label="Title" options={['Dr', 'Mr', 'Ms']} />
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

                                <Grid item lg={6} md={4} sm={12} xs={12}>
                                    <Textfield name="address" label="Address" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="currentAppointment" label="Current Appointment if any" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="fee" label="Fee Share" />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* ----------------------------  Education and Speciality Card */}

                        <Typography variant="h4" mt={3} mb={1} sx={{ fontWeight: 500 }} color={COLORS.color1}>
                            Education and Speciality
                        </Typography>

                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Grid container direction="row" p={2} spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Textfield name="degree" label="Degree" />
                                </Grid>

                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="demo-simple-select-standard-label">Speciality</InputLabel>
                                        <Select
                                            defaultValue=""
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            sx={{ textTransform: 'capitalize' }}
                                            value={selectedSpeciality}
                                            onChange={(e) => {
                                                setSelectedSpeciality(e.target.value);
                                                setSelectedColor('');
                                            }}
                                            label="Speciality"
                                        >
                                            {/* ------ we are mapping here specialityData List and while selecting we will save it to selectedSpeciality ----- */}
                                            {specialityData?.map((item, index) => (
                                                <MenuItem key={index} value={item?.speciality} sx={{ textTransform: 'capitalize' }}>
                                                    {item?.speciality?.toLowerCase()}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item lg={3} md={3} sm={6} xs={12}>
                                    <FormControl variant="standard" fullWidth>
                                        <InputLabel id="demo-simple-select-standard-label">Calendar Color</InputLabel>
                                        <Select
                                            defaultValue=""
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={selectedColor}
                                            onChange={(e) => setSelectedColor(e.target.value)}
                                            label="Calendar Color"
                                        >
                                            {/* ------ In this Code we will filter the code of selected speciality,
                                             we will find selected speciality from specialityData list and then map color codes to list ----- */}
                                            {specialityData
                                                ?.find((item) => item?.speciality?.toLowerCase() == selectedSpeciality?.toLowerCase())
                                                ?.colorHexaCode?.map((item, index) => (
                                                    <MenuItem key={index} value={item}>
                                                        <Grid container direction={'row'} alignItems={'center'}>
                                                            <Grid
                                                                sx={{ backgroundColor: item, width: '100%', borderRadius: 1, height: 20 }}
                                                            />
                                                        </Grid>
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* -------------------------  Health Care Card  */}

                        <Typography variant="h4" mt={3} mb={1} sx={{ fontWeight: 500 }} color={COLORS.color1}>
                            Healthcare License Information
                        </Typography>

                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <Grid container direction="row" p={2} spacing={2}>
                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <Textfield name="healthCareLicenseCode" label="Healthcare License Code" />
                                </Grid>

                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                    <DateTimePicker name="licenseValidity" label="Healthcare License Validity" />
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
                description={'Are you sure, you want to delete this physician?'}
                loading={loadingDelete}
                onClickNo={() => setOpenDeleteModal(false)}
                onClickYes={() => handleDelete()}
            />

            <ModalCustom open={openPackageModal} title={'Add Package'}>
                <Formik
                    initialValues={{
                        description: '',
                        fee: ''
                    }}
                    validationSchema={Yup.object().shape({
                        description: Yup.string().required('Required'),
                        fee: Yup.number().typeError('Fee must be a number').required('Required')
                    })}
                    onSubmit={(values, { resetForm }) => handleAddPackage(values, resetForm)}
                >
                    <Form>
                        <Grid container direction="row" spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="description" label="Description" />
                            </Grid>

                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Textfield name="fee" label="Fee" />
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                                <Box sx={styles.btnContainer}>
                                    {loadingPackage ? (
                                        <CircularProgress size={25} color="inherit" />
                                    ) : (
                                        <>
                                            <Button onClick={() => setOpenPackageModal(false)} variant="text" sx={{ color: 'red' }}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="text" sx={{ color: COLORS.secondory }}>
                                                Save
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
