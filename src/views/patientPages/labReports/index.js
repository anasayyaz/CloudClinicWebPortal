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
import ModalCustom from 'ui-component/modals/ModalCustom';
import CloseIcon from '@mui/icons-material/Close';
import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// ==============================|| LabReports ||============================== //

const LabReports = (props) => {
    const { user } = useSelector((state) => state?.user);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState({ open: false, image: null });
    const getPreviousVisitsList = async () => {
        try {
            setLoading(true);
            setError(null);
            setReports(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/LabTest/LabtestsbyUser/${user.userId}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            if (res?.data) {
                const mergedData = res?.data.reduce((acc, item) => {
                    const existingItem = acc.find((obj) => obj.type === item.type);

                    if (existingItem) {
                        existingItem.list.push(item);
                    } else {
                        acc.push({
                            type: item.type,
                            list: [item]
                        });
                    }

                    return acc;
                }, []);

                setReports(mergedData);
            }
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
        <Box>
            {loading ? (
                <Box sx={styles.loadingContainer}>
                    <CircularProgress size={35} color="inherit" />
                </Box>
            ) : (
                <>
                    {reports &&
                        reports?.map((item) => (
                            <Accordion key={item?.type}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={styles.accordianTitle}>{item?.type}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {item?.list.map((report) => (
                                            <Box onClick={() => setSelectedImage({ open: true, image: report?.imagePath })}>
                                                <img
                                                    src={`${BASE_URL}media/${user?.domain}/Documents/${report?.imagePath}`}
                                                    alt={'lab report'}
                                                    width={50}
                                                    height={50}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                </>
            )}
            {!!error && (
                <Typography sx={{ ...styles.loadingContainer, py: 1 }}>
                    {error?.res?.data?.message || error?.res?.data || error?.message}
                </Typography>
            )}
            <ModalCustom open={selectedImage?.open}>
                <IconButton
                    color="inherit"
                    onClick={() => setSelectedImage({ open: false, image: null })}
                    sx={{ position: 'absolute', top: 8, right: 5, backgroundColor: '#fff' }}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ ml: -2.1, mr: -2.7, mb: -1.7, mt: -3.2 }}>
                    <img src={`${BASE_URL}media/${user?.domain}/Documents/${selectedImage?.image}`} alt={'select report'} width={'100%'} />
                </Box>
            </ModalCustom>
        </Box>
    );
};

export default LabReports;
const styles = {
    loadingContainer: {
        height: 'auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    accordianTitle: { fontSize: 16, fontWeight: 600 }
};
