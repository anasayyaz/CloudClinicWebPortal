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
// ==============================|| Mediciens ||============================== //

const Mediciens = (props) => {
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
                url: `${BASE_URL}api/prescription/PrescriptionByUser/${user.userId}`,
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
                        <TableCell align={'left'}>Medicine Name</TableCell>
                        <TableCell align={'left'}>Generic Name</TableCell>

                        <TableCell align={'left'}>Dose</TableCell>

                        <TableCell align={'left'}>Dose Unit</TableCell>

                        <TableCell align={'left'}>Route</TableCell>

                        <TableCell align={'left'}>Direction</TableCell>

                        <TableCell align={'left'}>Frequency</TableCell>
                        <TableCell align={'left'}>Duration</TableCell>
                        <TableCell align={'left'}>Duration Unit</TableCell>
                        <TableCell align={'left'}>Instructions</TableCell>
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
                                    <TableCell align={'left'}>{row?.medicineName}</TableCell>

                                    <TableCell align={'left'}>{row?.medicineGenericName}</TableCell>

                                    <TableCell align={'left'}>{row?.dose}</TableCell>

                                    <TableCell align={'left'}>{row?.doseUnit}</TableCell>

                                    <TableCell align={'left'}>{row?.route}</TableCell>

                                    <TableCell align={'left'}>{row?.direction}</TableCell>

                                    <TableCell align={'left'}>{row?.frequency}</TableCell>
                                    <TableCell align={'left'}>{row?.duration}</TableCell>
                                    <TableCell align={'left'}>{row?.durationUnit}</TableCell>
                                    <TableCell align={'left'}>{row?.dosageInstruction}</TableCell>
                                    <TableCell align={'left'}>
                                        <span>
                                            {new Date(row?.createdOn).toLocaleString('en-US', {
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

export default Mediciens;
