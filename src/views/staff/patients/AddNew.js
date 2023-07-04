import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
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
import useFetch from 'hooks/useFetch';

export default function AddNewPatient() {
    const { user } = useSelector((state) => state.user);

    const [guardianPhone, setGuardianPhone] = useState('');
    const [inHospital, setInHospital] = useState(false);
    const [mobileNo, setMobileNo] = useState('');
    const [loading, setLoading] = useState(false);

    const INITIAL_FORM_STATE = {
        title: '',
        mrNumber: '',
        firstName: '',
        lastName: '',
        emailId: '',
        identificationNo: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        guardianName: ''
    };

    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        mrNumber: Yup.number().typeError('Medical Record No. must be a number').required('Required'),
        firstName: Yup.string().trim().required('Required'),
        lastName: Yup.string().required('Required'),
        emailId: Yup.string().email('Invalid email'),
        identificationNo: Yup.number()
            .typeError('National ID must be a number')
            .required('Required')
            .test('length', 'Input must be exactly 13 characters', (value) => value && value.toString().length === 13),
        gender: Yup.string().required('Required'),
        dateOfBirth: Yup.date().required('Required'),
        address: Yup.string().required('Required')
    });

    const handleSubmit = async (values, resetForm) => {
        setLoading(true);
        try {
            if (mobileNo.length < 15) {
                return toast.error('Please enter valid mobile number');
            }

            const { title, mrNumber, firstName, lastName, emailId, identificationNo, gender, dateOfBirth, address, guardianName } = values;
            let nationalID = uuidv4();

            const responseCreateAccount = await axios({
                method: 'post',
                url: `${BASE_URL}api/accounts/create`,
                data: {
                    email: emailId ? emailId.trim() : `${user?.domain}-${firstName.trim().replace(' ', '-')}-${nationalID}@dummy.com`,
                    userName: emailId ? emailId.trim() : `${user?.domain}-${firstName.trim().replace(' ', '-')}-${nationalID}@dummy.com`,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    roleName: 'Patient',
                    phoneNumber: mobileNo.trim().replace(/\D/g, ''),
                    address: address.trim(),
                    titles: title.trim(),
                    employeeCode: mrNumber.trim(),
                    identificationNo: identificationNo.trim(),
                    createdBy: user?.userId,
                    createdOn: new Date(),
                    profileImage: 'cloudclinic_dummy.jpg'
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (responseCreateAccount?.data) {
                const { id } = responseCreateAccount?.data;

                const data = {
                    nationalID: nationalID,
                    identificationNo: identificationNo.trim(),
                    name: firstName.trim(),
                    dob: dateOfBirth,
                    address: address.trim(),
                    phone: mobileNo.trim().replace(/\D/g, ''),
                    gender: gender,
                    guardianName: guardianName.trim(),
                    guardianPhone: guardianPhone.trim().replace(/\D/g, ''),
                    email: emailId ? emailId.trim() : `${user?.domain}-${firstName.trim().replace(' ', '-')}-${nationalID}@dummy.com`,
                    userID: id,
                    titles: title.trim(),
                    lastName: lastName.trim(),
                    inHospital: inHospital,
                    mrNumber: mrNumber.trim(),
                    role: 'Patient',
                    createdBy: user?.userId,
                    createdOn: new Date(),
                    isActive: true,
                    profileImage: 'cloudclinic_dummy.jpg'
                };

                const responseCreatePatient = await axios({
                    method: 'post',
                    url: `${BASE_URL}api/patient`,
                    data,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user?.token}`
                    }
                });

                if (responseCreatePatient?.data) {
                    resetForm();
                    setMobileNo('+92');
                    setGuardianPhone('+92');
                    setInHospital(false);
                    return toast.success('Patient created successfully');
                }
            }
        } catch (error) {
            console.log(error?.response?.status);
            if (error?.response?.status == 403) {
                return toast.error('Employee Id already exit');
            }
            return toast.error(error?.response?.data?.modelState[''][0] ?? error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Grid mb={3} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Add New Patient
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
                                <SelectCustom defaultValue="" name="gender" label="Gender" options={['Male', 'Female', 'Other']} />
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

                            {/* <Grid item lg={1} md={1} sm={2} xs={4}>
                                <Textfield name="age" label="Age" />
                            </Grid> */}

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

                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            disabled={loading}
                            type="submit"
                            variant="contained"
                            sx={{ width: 200, backgroundColor: COLORS.secondory, '&: hover': { background: COLORS.primary } }}
                        >
                            {loading ? <CircularProgress size={25} color="inherit" /> : 'Save'}
                        </Button>
                    </div>
                </Form>
            </Formik>
        </div>
    );
}
