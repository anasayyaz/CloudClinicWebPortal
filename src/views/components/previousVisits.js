import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
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
import axios from 'axios';
// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';
import { COLORS } from 'constants/colors';
import { TableRow, TablePagination, TableHead, TableContainer, TableBody, TableCell, Table } from '@mui/material';
// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
// ==============================|| PreviousVisits ||============================== //

const PreviousVisits = (props) => {
    const { user } = useSelector((state) => state?.user);
    const [previousVisitsList, setPreviousVisitsList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getPreviousVisitsList = async () => {
        try {
            setLoading(true);
            setError(null);
            setPreviousVisitsList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/getpatientPreviousVisits/7be9ad27-bc71-4921-b22f-f767edf1f480`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setPreviousVisitsList(res?.data);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPreviousVisitsList();
    }, []);

    return (
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
                        <TableCell align={'left'}>Visit ID</TableCell>

                        <TableCell align={'left'}>Description</TableCell>

                        <TableCell align={'left'}>Doctors Name</TableCell>

                        <TableCell align={'left'}>Initial Complain</TableCell>

                        <TableCell align={'left'}>Prescription</TableCell>

                        <TableCell align={'left'}>Diagnosis</TableCell>

                        <TableCell align={'left'}>Referred To</TableCell>

                        <TableCell align={'left'}>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!!previousVisitsList &&
                        previousVisitsList.map((row) => {
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.patient_id}
                                    sx={{ '&:hover': { cursor: 'pointer' } }}
                                    // onClick={() => navigate(`edit/${row?.nationalID}`, { state: row })}
                                >
                                    <TableCell align={'left'}>{row?.id}</TableCell>

                                    <TableCell align={'left'}>{row?.title}</TableCell>

                                    <TableCell align={'left'}>{row?.consultantFirstName}</TableCell>

                                    <TableCell align={'left'}>{row?.initialComplain}</TableCell>

                                    <TableCell align={'left'}>{row?.address}</TableCell>

                                    <TableCell align={'left'}>{row?.address}</TableCell>

                                    <TableCell align={'left'}>{row?.referredTo}</TableCell>

                                    <TableCell align={'left'}>
                                        <span>
                                            {new Date(row?.startDateTime).toLocaleString('en-US', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: '2-digit'
                                            })}
                                        </span>
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
    );
};

export default PreviousVisits;
