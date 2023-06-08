import { Grid, Typography } from '@mui/material';
import React from 'react';

export default function PageNotFound() {
    return (
        <Grid
            container
            direction={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            sx={{
                height: '100%'
            }}
        >
            <Typography item sx={{ fontSize: 100, fontWeight: '700' }}>
                404
            </Typography>
            <Typography item sx={{ fontSize: 20, marginTop: -2, fontWeight: '700' }}>
                Not Found
            </Typography>
            <Typography item sx={{ fontSize: 15, marginTop: 1, fontWeight: '500' }}>
                The resource requested could not be found on this server!
            </Typography>
        </Grid>
    );
}
