import React, { useState } from 'react';

import { Box, Button, CircularProgress, Grid, RadioGroup, FormControl, FormControlLabel, Radio, TextField } from '@mui/material';

import { BASE_URL } from 'constants/baseUrl';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ModalCustom from 'ui-component/modals/ModalCustom';
import { COLORS } from 'constants/colors';
import axios from 'axios';

export default function UploadReportComp({ visit, open, onClose }) {
    const { user } = useSelector((state) => state?.user);

    const [description, setDescription] = useState('');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [labReportType, setLabReportType] = useState('X-Ray');

    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            let formdata = new FormData();

            formdata.append('body', uploadedFile?.image, uploadedFile?.name);

            const resUploadFile = await axios.post(`${BASE_URL}api/uploadFile`, formdata, {
                headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data;', Accept: 'application/json' }
            });

            if (resUploadFile?.data) {
                const uploadTestRes = await axios.post(
                    `${BASE_URL}api/labtest`,
                    {
                        VisitID: visit?.id,
                        ImagePath: uploadedFile?.name,
                        ImageName: uploadedFile?.name,
                        Patient_NationalID: visit?.patient_NationalID,
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
            return toast.error(error?.response?.data?.message ?? error?.response?.data ?? error?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ModalCustom open={open} title={'Upload Reports'}>
                <Grid container sx={{ width: '40vw' }}>
                    {/* --------------------------- Image Container */}
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={styles.imageContainer}>
                                {uploadedFile?.url && (
                                    <img src={uploadedFile?.url} alt={'uploaded report'} width={'100%'} height={'100%'} />
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* -------------------------------  Radio Button */}
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
                        {labReportType == 'Other' && (
                            <TextField
                                type="input"
                                fullWidth
                                placeholder="Description"
                                sx={{ mb: 2 }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        )}
                        <TextField type="file" fullWidth accept="image/*" onChange={(e) => handleOnChangeUploadReport(e.target.files)} />
                    </Grid>

                    <Grid item lg={12} md={12} sm={12} xs={12} mt={2}>
                        <Box sx={styles.btnContainer}>
                            {loading ? (
                                <CircularProgress size={25} color="inherit" />
                            ) : (
                                <>
                                    <Button onClick={onClose} variant="text" sx={{ color: 'red' }}>
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
        </>
    );
}

const styles = {
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    },
    imageContainer: {
        backgroundColor: '#D3D3D3',
        width: 150,
        height: 220,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #d5d5d5'
    }
};
