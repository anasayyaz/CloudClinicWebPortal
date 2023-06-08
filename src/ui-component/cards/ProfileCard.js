import { Grid, Typography } from '@mui/material';
import { COLORS } from 'constants/colors';
import React from 'react';

export default function ProfileCard({ profileImage, name, identificationNo, speciality, phone, address, onClick }) {
    return (
        <Grid onClick={onClick} item lg={3} md={4} sm={6} xs={12}>
            <Grid sx={styles.cardContainer}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img alt={'Profile'} src={profileImage} style={styles.cardProfilePicture} />
                </div>

                <Typography sx={styles.cardHeader}>{name?.toLowerCase()}</Typography>

                <Typography sx={{ textAlign: 'center', fontSize: 14 }}>{identificationNo}</Typography>

                <Typography sx={{ textAlign: 'center', fontSize: 14, textTransform: 'capitalize' }}>{speciality?.toLowerCase()}</Typography>

                <Typography sx={{ textAlign: 'center', fontSize: 14 }}>{phone}</Typography>

                <Typography sx={{ textAlign: 'center', fontSize: 14 }}>{address}</Typography>
            </Grid>
        </Grid>
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
    cardContainer: {
        backgroundColor: '#f0f0f0',
        height: 250,
        padding: 2,
        borderRadius: 2,
        '&: hover': {
            backgroundColor: COLORS.secondory,
            color: '#fff',
            cursor: 'pointer',
            transition: 'all .2s ease-in-out'
        }
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
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize'
    }
};
