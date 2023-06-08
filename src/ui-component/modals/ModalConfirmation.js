import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import { COLORS } from 'constants/colors';
import React from 'react';

export default function ModalConfirmation({ header, description, onClickNo, onClickYes, open, loading }) {
    return (
        <Modal
            open={open}
            // onClose={() => setOpenModal(false)}
            aria-labelledby="delete-confirmation"
            aria-describedby="modal-for-delete-confirmation"
        >
            <Box sx={styles.modalContainer}>
                {loading ? (
                    <Box sx={styles.loaderBoxContainer}>
                        <CircularProgress size={35} color="inherit" />
                    </Box>
                ) : (
                    <>
                        <Typography sx={styles.header}>{header}</Typography>
                        <Typography sx={{ fontSize: 14, mb: 1 }}>{description}</Typography>

                        <Box sx={styles.btnContainer}>
                            <Button onClick={onClickNo} variant="text" sx={{ color: COLORS.secondory }}>
                                No
                            </Button>
                            <Button onClick={onClickYes} variant="text" sx={{ color: 'red' }}>
                                Yes
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
}

const styles = {
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: COLORS.white,
        // border: '2px solid #000',
        // boxShadow: 24,
        borderRadius: 3,
        px: 2,
        p: 3,
        pb: 2
    },
    btnContainer: {
        display: 'flex',
        direction: 'row',
        gap: 1,
        justifyContent: 'flex-end'
    },
    header: {
        fontSize: 18,
        fontWeight: 600,
        mb: 1
    },
    loaderBoxContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
};
