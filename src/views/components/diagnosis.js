import { useSelector } from 'react-redux';

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

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
// ==============================|| Diagnosis ||============================== //

const Diagnosis = (props) => {};

export default Diagnosis;
