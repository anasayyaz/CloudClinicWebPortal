import React, { useState, useEffect, useRef } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, IconButton, Typography } from '@mui/material';

import { BASE_URL } from 'constants/baseUrl';
import { useSelector } from 'react-redux';

import ModalCustom from 'ui-component/modals/ModalCustom';
import CloseIcon from '@mui/icons-material/Close';
import { getReportByVisit } from 'services/labReports';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ViewReportsComp({ visit, open, onClose }) {
    const { user } = useSelector((state) => state?.user);

    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState({ open: false, image: null });

    const getReports = async () => {
        try {
            const res = await getReportByVisit(visit?.id);
            setReports(res);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReports();

        return () => {
            setLoading(true);
            setError(null);
            setReports(null);
        };
    }, [open]);

    return (
        <>
            <ModalCustom open={open} title={'Lab Reports'}>
                <Box sx={{ width: '40vw' }}>
                    {loading ? (
                        <Box sx={styles.loadingContainer}>
                            <CircularProgress size={35} color="inherit" />
                        </Box>
                    ) : (
                        <>
                            <IconButton color="inherit" onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
                                <CloseIcon />
                            </IconButton>

                            {reports?.map((item) => (
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
                            {error?.response?.data?.message || error?.response?.data || error?.message}
                        </Typography>
                    )}
                </Box>
            </ModalCustom>

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
        </>
    );
}

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
