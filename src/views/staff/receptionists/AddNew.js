import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';

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

export default function AddNewReceptionist() {
    const { user } = useSelector((state) => state.user);

    const [mobileNo, setMobileNo] = useState('');
    const [loading, setLoading] = useState(false);

    const INITIAL_FORM_STATE = {
        title: '',
        employeeId: '',
        firstName: '',
        lastName: '',
        emailId: '',
        address: ''
    };

    const FORM_VALIDATION = Yup.object().shape({
        title: Yup.string().required('Required'),
        employeeId: Yup.number().typeError('Employee ID must be a number').required('Required'),
        firstName: Yup.string().trim().required('Required'),
        lastName: Yup.string().required('Required'),
        emailId: Yup.string().email('Invalid email').required('Required'),
        address: Yup.string().required('Required')
    });

    const handleSubmit = async (values, resetForm) => {
        setLoading(true);
        try {
            if (mobileNo.length < 15) {
                return toast.error('Please enter valid mobile number');
            }

            const { title, employeeId, firstName, lastName, emailId, address } = values;

            const responseCreateAccount = await axios({
                method: 'post',
                url: `${BASE_URL}api/accounts/create`,
                data: {
                    email: emailId.trim(),
                    userName: emailId.trim(),
                    firstName: firstName.trim(),
                    roleName: 'Receptionist',
                    titles: title.trim(),
                    lastName: lastName.trim(),
                    phoneNumber: mobileNo.trim().replace(/\D/g, ''),
                    employeeCode: employeeId.trim(),
                    address: address.trim(),
                    createdBy: user?.userId,
                    createdOn: new Date(),
                    ProfileImage: 'cloudclinic_dummy.jpg'
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (responseCreateAccount?.data) {
                resetForm();
                setMobileNo('+92');
                return toast.success('Receptionist created successfully');
            }
        } catch (error) {
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
                    Add New Receptionist
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
