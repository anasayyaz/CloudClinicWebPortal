import { Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function ModalCustom({ open, title, children }) {
    return (
        <Modal open={open} aria-labelledby="delete-confirmation" aria-describedby="modal-for-delete-confirmation">
            <Box sx={styles.modalContainer}>
                <Typography sx={styles.title}>{title}</Typography>
                {children}
            </Box>
        </Modal>
    );
}

const styles = {
    modalContainer: {
        width: 'auto',
        minWidth: 300,
        backgroundColor: '#fff',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 3,
        px: 2,
        p: 3,
        pb: 2
    },
    title: {
        fontSize: 18,
        fontWeight: 600,
        mb: 1
    }
};
