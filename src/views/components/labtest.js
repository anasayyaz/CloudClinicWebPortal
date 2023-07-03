import React, { useState, useEffect, useRef } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
// ==============================|| LabTest ||============================== //
import Autocomplete from '@mui/material/Autocomplete';
import { Form, Formik } from 'formik';
import Textfield from 'ui-component/FormUI/Textfield';
const LabTest = (props) => {
    const icdRef = useRef();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const {
        data: labTestDataList,
        loading: loadinglabTestDataList,
        error: errorlabTestDataList,
        refetch: refetchlabTestDataList
    } = useFetch(`${BASE_URL}api/LabTestType`);
    return (
        <div>
            {' '}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Current Lab Tests</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo
                        lobortis eget.
                    </Typography>
                </AccordionDetails>
            </Accordion>
            {!!labTestDataList && (
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={labTestDataList}
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => `${option.type} - ${option.code}`}
                    renderInput={(params) => <TextField {...params} label="Lab Test" />}
                />
            )}
        </div>
    );
};

export default LabTest;
