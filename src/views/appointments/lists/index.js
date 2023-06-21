import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
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

import CloseIcon from '@mui/icons-material/Close';
import { COLORS } from 'constants/colors';
import PrintIcon from '@mui/icons-material/Print';
import { profileImage } from 'utils/fetchImage';
import { useState } from 'react';
import { BASE_URL } from 'constants/baseUrl';
import { useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ModalCustom from 'ui-component/modals/ModalCustom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalConfirmation from 'ui-component/modals/ModalConfirmation';
import MeetingCard from 'ui-component/cards/MeetingCard';
import SearchField from 'ui-component/FormUI/SearchField.js';
import { getDetail } from 'services/getDetail';
import moment from 'moment/moment';
import HistoryForm from 'ui-component/HistoryForm';
import { useRef } from 'react';
import { getReportByVisit } from 'services/labReports';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Lists() {
    const { user } = useSelector((state) => state?.user);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [count, setCount] = useState(0);

    const handleChangePage = (event, newPage) => {
        getVisitList(newPage, rowsPerPage, isConfirmed, searchQuery);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        getVisitList(page, event.target.value, isConfirm, searchQuery);
        setRowsPerPage(+event.target.value);
    };

    const handleIsConfirmed = (e) => {
        getVisitList(page, rowsPerPage, e.target.value, searchQuery);
        setIsConfirmed(e.target.value);
    };

    const [visitList, setVisitList] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isConfirmed, setIsConfirmed] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [patient, setPatient] = useState({ loading: false, error: null, data: null, modalOpen: false });
    const [cancel, setCancel] = useState({ loading: false, error: null, data: null, modalOpen: false });

    const [historyModal, setHistoryModal] = useState({ open: false, loading: false, error: null });
    const [viewReportsModal, setViewReportsModal] = useState({ open: false, loading: false, error: null, data: null });
    const [uploadReportsModal, setUploadReportsModal] = useState({ open: false, loading: false, error: null, data: null });

    const getVisitList = async (pageNumber, pageSize, isConfirm, searchValue) => {
        try {
            setLoading(true);
            setError(null);
            setVisitList(null);

            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/visit/primaryCareVisitsList/${user?.userId}?pageNumber=${
                    pageNumber + 1
                }&pageSize=${pageSize}&QuerySearch=${searchValue ?? ''}&isConfirm=${isConfirm == 'all' ? '' : isConfirm}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            setVisitList(res?.data);
            setCount(res?.data?.paginationMetadata?.totalCount);
        } catch (error) {
            console.log(error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVisitList(page, rowsPerPage, isConfirmed, searchQuery);
    }, []);

    //--------------------  Getting Patient Detail and handling other states using object
    const handlePatientProfile = async (nationalId) => {
        setPatient({ ...patient, modalOpen: true, loading: true });
        try {
            const patientDetail = await getDetail('patient', nationalId);

            setPatient({ ...patient, loading: false, modalOpen: true, data: patientDetail?.data });
        } catch (error) {
            setPatient({ ...patient, loading: false, modalOpen: true, error: error });
        }
    };

    //--------------------  Confirm Visit  ------------------------------
    const handleConfirmVisit = async (visitConfirm, visit) => {
        try {
            const updatedVisitList = visitList.items.map((obj) => {
                if (obj.id === visit?.id) {
                    obj.isConfirm = !obj.isConfirm; // change isConfirm Status of visitID that matched
                }
                return obj;
            });
            let newVisitList = { items: updatedVisitList };
            setVisitList(newVisitList);

            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/confirmVisit/${visit?.id}`,
                data: { isConfirm: visitConfirm },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        }
    };

    // ----------------------  Cancel Appointment  ---------------------------
    const handleCancelAppointment = async () => {
        const { data: visit } = cancel;
        setCancel({ ...cancel, loading: true });
        try {
            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/visit/updateCancelVisitStatus/${visit?.id}`,
                data: { id: visit.id, status: 10 },
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                const updatedVisitList = visitList.items.filter((obj) => {
                    return obj.id !== visit?.id; //------------- Remove that object that match that id
                });
                let newVisitList = { items: updatedVisitList };
                setVisitList(newVisitList);
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setCancel({ ...cancel, loading: false, modalOpen: false });
        }
    };

    // -----------------------  Set Updated Histoy to History State

    const [historyLoading, setHistoryLoading] = useState(false);
    const historyRef = useRef({});

    const handleHistory = async (visit) => {
        setHistoryModal({ open: true, loading: true, error: null });
        try {
            const res = await axios({
                method: 'get',
                url: `${BASE_URL}api/History/patientLastHistory/${visit?.patient_NationalID}`,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            historyRef.current = res?.data;
            setHistoryModal({ open: true, loading: false, error: null });
        } catch (error) {
            setHistoryModal({ open: true, loading: false, error: error });
        }
    };

    const handlePostHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await axios({
                method: 'post',
                url: `${BASE_URL}api/History`,
                data: historyRef?.current,
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if (res?.data) {
                return toast.error('History added successfully');
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setHistoryLoading(false);
            setHistoryModal({ open: false, loading: false, error: null });
        }
    };

    // --------------------------  View Reports
    const [selectedImage, setSelectedImage] = useState({ open: false, image: null });

    const handleViewReports = async (visit) => {
        setViewReportsModal({ ...viewReportsModal, open: true, loading: true });
        try {
            const res = await getReportByVisit(visit?.id);
            setViewReportsModal({ ...viewReportsModal, open: true, loading: false, data: res });
        } catch (error) {
            setViewReportsModal({ ...viewReportsModal, open: true, loading: false, error: error });
        }
    };

    // --------------------------  Upload Reports

    const [uploadedFile, setUploadedFile] = useState(null);
    const [labReportType, setLabReportType] = useState('X-Ray');

    const handleOnChangeUploadReport = async (file) => {
        let imageName = `${user?.userId}_` + Date.now() + `_${user?.domain}.` + file?.[0]?.name?.split('.').pop();

        let image = {
            name: imageName,
            image: file?.[0],
            url: URL.createObjectURL(file?.[0])
        };

        setUploadedFile(image);
    };

    const handleUploadReport = async () => {
        setUploadReportsModal({ ...uploadReportsModal, open: true, loading: true });
        try {
            let formdata = new FormData();
            console.log('uploadedFile ', uploadedFile?.image, uploadedFile?.name);
            formdata.append('body', uploadedFile?.image, uploadedFile?.name);

            const resUploadFile = await axios.post(`${BASE_URL}api/uploadFile`, formdata, {
                headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data;', Accept: 'application/json' }
            });

            if (resUploadFile?.data) {
                const uploadTestRes = await axios.post(
                    `${BASE_URL}api/labtest`,
                    {
                        VisitID: uploadReportsModal?.data?.id,
                        ImagePath: uploadedFile?.name,
                        ImageName: uploadedFile?.name,
                        Patient_NationalID: uploadReportsModal?.data?.patient_NationalID,
                        Description: labReportType == 'Other' ? description : labReportType,
                        Type: labReportType,
                        IsLatest: true
                    },
                    {
                        headers: { Authorization: `Bearer ${user?.token}`, Accept: 'application/json' }
                    }
                );

                if (uploadTestRes?.data) {
                    setUploadedFile(null);
                    return toast.success('Report Uploaded Successfully');
                }
            }
        } catch (error) {
            return toast.error(error?.response?.data ?? error?.message);
        } finally {
            setUploadReportsModal({ data: null, open: false, loading: false });
        }
    };

    return (
        <div>
            {/* -----------------  Main Header  -------------------------- */}
            <Grid mb={2} container direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" color={COLORS.color1}>
                    Appointment List
                </Typography>

                <Grid item sx={{ ml: 'auto' }}>
                    <FormControl sx={{ width: 130 }}>
                        <Select size="small" value={isConfirmed} onChange={handleIsConfirmed}>
                            <MenuItem value={'all'}>All</MenuItem>
                            <MenuItem value={true}>Confirmed</MenuItem>
                            <MenuItem value={false}>Unconfirmed</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* ---------------------  Search Bar and Print Button ------------------- */}
            <Grid container justifyContent="space-between" alignItems="center" rowGap={2}>
                <Grid item lg={4} xs={12}>
                    <SearchField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClickSearch={() => {
                            setPage(0);
                            getVisitList(0, rowsPerPage, isConfirmed, searchQuery);
                        }}
                        onClickClear={() => {
                            setPage(0);
                            setSearchQuery('');
                            getVisitList(0, rowsPerPage, isConfirmed, '');
                        }}
                        titleSearchBtn={'Search Visit'}
                        titleClearBtn={'Clear search list'}
                    />
                </Grid>

                <Grid sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <IconButton title="Print Visit List">
                        <PrintIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {/* --------------------------  Meeting Card  ------------------------- */}
            {!!visitList &&
                visitList?.items?.map((visit) => (
                    <MeetingCard
                        key={visit?.meetinglink}
                        visit={visit}
                        onClickPatientProfile={() => handlePatientProfile(visit?.patient_NationalID)}
                        onClickStart={() => {}}
                        onClickReschedule={() => {}}
                        onClickCancel={() => {
                            setCancel({ ...cancel, modalOpen: true, data: visit });
                        }}
                        onClickVitalSign={() => {}}
                        onClickHistory={() => handleHistory(visit)}
                        onClickViewReports={() => handleViewReports(visit)}
                        onClickUploadReports={() => setUploadReportsModal({ ...uploadReportsModal, open: true, data: visit })}
                        onChangeConfirm={(e) => handleConfirmVisit(e.target.checked, visit)}
                    />
                ))}

            {loading && (
                <Grid sx={styles.loadingContainer}>
                    <CircularProgress size={35} color="inherit" />
                </Grid>
            )}
            {!!error && (
                <Grid sx={styles.loadingContainer}>
                    <Typography>{error?.response?.data?.message ?? error?.message}</Typography>
                </Grid>
            )}
            {searchQuery?.length > 0 && visitList?.length == 0 && (
                <Grid sx={styles.loadingContainer}>
                    <Typography sx={{ fontSize: 16, fontWeight: '600' }}>Does not match any results!</Typography>
                </Grid>
            )}

            {/* ---------------------------- Pagination ----------------------- */}
            {!!visitList && visitList?.items?.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}

            {/* --------------------------  Modal for Showing Patient Info  ------------------------- */}
            <ModalCustom open={patient.modalOpen} title={'Patient Info'}>
                <Box sx={{ width: 330 }}>
                    {patient?.loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress size={30} color="inherit" />
                        </Box>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => setPatient({ ...patient, modalOpen: false, data: null, error: null })}
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {!!patient?.data && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                                <img alt={'Profile'} src={profileImage(patient?.data?.profileImage)} style={styles.profilePicture} />
                            </Box>

                            <TextBox
                                title={'Name'}
                                subTitle={`${patient?.data?.titles} ${patient?.data?.name} ${patient?.data?.lastName}`}
                            />
                            <TextBox title={'Gender'} subTitle={`${patient?.data?.gender}`} />
                            <TextBox title={'Phone No.'} subTitle={`${patient?.data?.phone}`} />
                            <TextBox title={'NIC'} subTitle={`${patient?.data?.identificationNo}`} />
                            <TextBox title={'Date of Birth'} subTitle={moment(patient?.data?.dob).format('MMM DD, YYYY')} />
                            <TextBox title={'Email'} subTitle={`${patient?.data?.email}`} />
                            <TextBox title={'Address'} subTitle={`${patient?.data?.address}`} />
                            <TextBox title={'Guardian Name'} subTitle={`${patient?.data?.guardianName}`} />
                            <TextBox title={'Guardian Phone'} subTitle={`${patient?.data?.guardianPhone}`} />
                            <TextBox title={'Active'} subTitle={`${patient?.data?.isActive == true ? 'Yes' : 'No'}`} />
                            <TextBox title={'In-Hospital'} subTitle={`${patient?.data?.inHospital == true ? 'Yes' : 'No'}`} />
                        </>
                    )}
                </Box>
            </ModalCustom>

            {/* ------------------------  Modal Cancel Confirmation  -------------------------- */}
            <ModalConfirmation
                open={cancel.modalOpen}
                header={'Cancel Confirmation'}
                description={'Are you sure, you want to cancel this appointment?'}
                loading={cancel.loading}
                onClickNo={() => setCancel({ ...cancel, modalOpen: false, data: null })}
                onClickYes={() => handleCancelAppointment()}
            />

            {/* -----------------------  History Modal  -------------------------------------- */}
            <ModalCustom open={historyModal?.open} title={'Add History'}>
                <Box sx={{ maxWidth: 900 }}>
                    {historyModal?.loading ? (
                        <Box sx={{ ...styles.loadingContainer, height: 'auto' }}>
                            <CircularProgress size={35} color="inherit" />
                        </Box>
                    ) : (
                        <>
                            <HistoryForm
                                data={historyRef.current}
                                onUpdate={(val) => {
                                    historyRef.current = val;
                                }}
                            />

                            <Box sx={styles.btnContainer}>
                                {historyLoading ? (
                                    <CircularProgress size={25} color="inherit" />
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => setHistoryModal({ open: false, loading: false, error: null })}
                                            variant="text"
                                            sx={{ color: 'red' }}
                                        >
                                            Cancel
                                        </Button>

                                        {!!historyModal?.error == false && (
                                            <Button onClick={handlePostHistory} variant="text" sx={{ color: COLORS.secondory }}>
                                                Save
                                            </Button>
                                        )}
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                    {!!historyModal?.error && (
                        <Typography>
                            {historyModal?.error?.response?.data?.message ||
                                historyModal?.error?.response?.data ||
                                historyModal?.error?.message}
                        </Typography>
                    )}
                </Box>
            </ModalCustom>

            {/* -----------------------  View Reports Modal  -------------------------------------- */}
            <ModalCustom open={viewReportsModal?.open} title={'Lab Reports'}>
                <Box>
                    {viewReportsModal?.loading ? (
                        <Box sx={{ ...styles.loadingContainer, height: 'auto' }}>
                            <CircularProgress size={35} color="inherit" />
                        </Box>
                    ) : (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={() => setViewReportsModal({ ...viewReportsModal, error: null, open: false, data: null })}
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>

                            {viewReportsModal?.data?.map((item) => (
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                        <Typography sx={styles.accordianTitle}>{item?.type}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            {item?.list.map((report) => (
                                                <Box onClick={() => setSelectedImage({ open: true, image: report?.imagePath })}>
                                                    <img
                                                        src={`https://cloudclinicdevapi.azurewebsites.net/media/clinic/Documents/${report?.imagePath}`}
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
                    {!!viewReportsModal?.error && (
                        <Typography>
                            {viewReportsModal?.error?.response?.data?.message ||
                                viewReportsModal?.error?.response?.data ||
                                viewReportsModal?.error?.message}
                        </Typography>
                    )}
                </Box>
            </ModalCustom>

            {/* -----------------------  Upload Reports Modal  -------------------------------------- */}
            <ModalCustom open={uploadReportsModal?.open} title={'Upload Reports'}>
                <Grid container sx={{ maxWidth: 500 }}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={styles.imageContainer}>
                                {uploadedFile?.url && (
                                    <img src={uploadedFile?.url} alt={'uploaded report'} width={'100%'} height={'100%'} />
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                    name="controlled-radio-buttons-group"
                                    value={labReportType}
                                    onChange={(e) => setLabReportType(e.target.value)}
                                >
                                    <FormControlLabel value="X-Ray" control={<Radio />} label="X-Ray" />
                                    <FormControlLabel value="CT Scan" control={<Radio />} label="CT Scan" />
                                    <FormControlLabel value="MRI" control={<Radio />} label="MRI" />
                                    <FormControlLabel value="Lab Test" control={<Radio />} label="Lab Test" />
                                    <FormControlLabel value="Ultrasound" control={<Radio />} label="Ultrasound" />
                                    <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </Grid>

                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {labReportType == 'Other' && <TextField type="input" fullWidth placeholder="Description" sx={{ mb: 2 }} />}
                        <TextField type="file" fullWidth accept="image/*" onChange={(e) => handleOnChangeUploadReport(e.target.files)} />
                    </Grid>

                    <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
                        <Box sx={styles.btnContainer}>
                            {uploadReportsModal?.loading ? (
                                <CircularProgress size={25} color="inherit" />
                            ) : (
                                <>
                                    <Button
                                        onClick={() => setUploadReportsModal({ open: false, loading: false, error: null })}
                                        variant="text"
                                        sx={{ color: 'red' }}
                                    >
                                        Cancel
                                    </Button>

                                    <Button onClick={handleUploadReport} variant="text" sx={{ color: COLORS.secondory }}>
                                        Upload
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </ModalCustom>

            <ModalCustom open={selectedImage?.open}>
                <IconButton
                    color="inherit"
                    onClick={() => setSelectedImage({ open: false, image: null })}
                    sx={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#fff' }}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ m: -3 }}>
                    <img
                        src={`https://cloudclinicdevapi.azurewebsites.net/media/clinic/Documents/${selectedImage?.image}`}
                        alt={'select report'}
                        width={'100%'}
                    />
                </Box>
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
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#d5d5d5',
        alignSelf: 'center'
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    },
    accordianTitle: { fontSize: 16, fontWeight: 600 },
    imageContainer: {
        backgroundColor: '#D3D3D3',
        width: 150,
        height: 220,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #d5d5d5'
    }
};

const TextBox = ({ title, subTitle }) => {
    return (
        <Box sx={{ display: 'flex', my: 1 }}>
            <Typography sx={{ width: '45%' }}>{title}</Typography>
            <Typography>{subTitle ?? '--'}</Typography>
        </Box>
    );
};
