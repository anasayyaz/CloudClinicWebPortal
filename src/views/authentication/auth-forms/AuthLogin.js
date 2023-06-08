import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { COLORS } from 'constants/colors';

import { getToken } from 'services/getToken';
import axios from 'axios';
import { BASE_URL } from 'constants/baseUrl';
import { useDispatch } from 'react-redux';
import { saveUserData } from 'store/slices/userSlice';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    // const [checked, setChecked] = useState(true);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const errorMessage = {
        invalid_grant: 'The email or password is incorrect',
        invalid_client: 'This domain not exits'
    };

    const handleLogin = async (email, password, domain) => {
        setLoading(true);
        try {
            const token = await getToken(email, password, domain);

            const res = await axios({
                method: 'post',
                url: `${BASE_URL}api/accounts/users/login?UserName=${email}&Password=${password}`,
                headers: { Authorization: `Bearer ${token}` }
            });

            var decoded = jwt_decode(token);
            const user = { ...res?.data[0], domainLogo: decoded?.Image, domain: decoded?.Domain, token: token };

            localStorage.setItem('user', JSON.stringify(user));
            dispatch(saveUserData(res?.data[0]));
        } catch (error) {
            // console.log('error ', errorMessage[error?.response?.data?.error] ?? error?.response?.data);
            toast.error(errorMessage[error?.response?.data?.error] ?? error?.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    domain: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    domain: Yup.string().max(255).required('Domain is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            setStatus({ success: true });
                            setSubmitting(false);

                            const { email, password, domain } = values;
                            handleLogin(email.trim().toLowerCase(), password.trim(), domain.trim().toLowerCase());
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.domain && errors.domain)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-domain-login">Domain</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-domain-login"
                                type="text"
                                value={values.domain}
                                name="domain"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Domain"
                                inputProps={{}}
                            />
                            {touched.domain && errors.domain && (
                                <FormHelperText error id="standard-weight-helper-text-domain-login">
                                    {errors.domain}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            /> */}
                            <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                                Forgot Password?
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={loading}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    sx={{
                                        backgroundColor: COLORS.primary
                                    }}
                                >
                                    {loading ? <CircularProgress size={25} color="inherit" /> : 'Sign in'}
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
