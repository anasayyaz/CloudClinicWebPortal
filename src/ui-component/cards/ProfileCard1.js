import { Box, Button, FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import { COLORS } from 'constants/colors';
import React from 'react';

export default function ProfileCard1({ profileImage, name, role, phoneNumber, onClickResetPassword, isActive, onChangeSwitch }) {
    return (
        <Grid item lg={3} md={4} sm={6} xs={12} sx={{ minWidth: 270 }}>
            <Grid sx={styles.cardContainer}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img alt={'Profile'} src={profileImage} style={styles.cardProfilePicture} />
                </div>

                <Typography sx={styles.cardHeader}>{name?.toLowerCase()}</Typography>

                <Box sx={styles.textContainer}>
                    <Typography sx={{ fontSize: 15, fontWeight: '600' }}>Role</Typography>
                    <Typography sx={{ fontSize: 15 }}>{role}</Typography>
                </Box>

                <Box sx={styles.textContainer}>
                    <Typography sx={{ fontSize: 15, fontWeight: '600' }}>Phone No.</Typography>
                    <Typography sx={{ fontSize: 15 }}>{phoneNumber}</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'gray' }}>
                    <Button variant="contained" sx={{ my: 2 }} onClick={onClickResetPassword}>
                        Reset Password
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <FormControlLabel
                        control={<Switch checked={isActive == 'Enable' ? true : false} onChange={onChangeSwitch} />}
                        label="Active"
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

const styles = {
    cardContainer: {
        backgroundColor: '#f0f0f0',
        // height: 250,
        padding: 2,
        borderRadius: 2
    },
    cardProfilePicture: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        marginTop: 10,
        marginBottom: 10,
        objectFit: 'cover'
    },
    cardHeader: {
        textAlign: 'center',
        marginBottom: 1,
        fontSize: 17,
        fontWeight: 'bold',
        textTransform: 'capitalize'
    },
    textContainer: {
        display: 'flex',
        direction: 'row',
        justifyContent: 'space-between',
        px: 2
    }
};
