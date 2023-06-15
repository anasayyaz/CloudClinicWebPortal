import { Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

export default function ModalCustom({ open, title, children }) {
    return (
        <Modal open={open}>
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
        maxHeight: '90%',
        overflowY: 'scroll',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: 3,
        px: 2,
        p: 3,
        pb: 2,
        '&::-webkit-scrollbar': {
            width: '0.4em',
            overflow: 'hidden'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            overflow: 'hidden'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey',
            overflow: 'hidden'
        }
    },
    title: {
        fontSize: 18,
        fontWeight: 600,
        mb: 1
    }
};
