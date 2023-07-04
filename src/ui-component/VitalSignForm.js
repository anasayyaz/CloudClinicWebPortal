import * as React from 'react';

import { Grid, TextField } from '@mui/material';
import { useState } from 'react';

export default function VitalSignForm({ data, onChange, visit }) {
    const [weight, setWeight] = useState(data?.weight || '');
    const [height, setHeight] = useState(data?.height || '');
    const [temp, setTemp] = useState(data?.temp || '');
    const [spO2, setSPO2] = useState(data?.spO2 || '');

    const [sys, setSys] = useState(data?.sys || '');
    const [dia, setDia] = useState(data?.dia || '');
    const [pi, setPi] = useState(data?.pi || '');
    const [pr, setPr] = useState(data?.pr || '');

    let state = {
        vitalSignID: data?.vitalSignID,
        patient_NationalID: visit?.patient_NationalID,
        visitID: visit?.id,

        dateTime1: data?.dateTime1 || new Date(),
        dateTime2: data?.dateTime2 || new Date(),
        datetimeECG: data?.datetimeECG || new Date(),
        datetimeBP: data?.datetimeBP || new Date(),

        weight,
        height,
        temp,
        spO2,

        sys,
        dia,
        pi,
        pr,

        hr: pr,
        bpm: pr,
        map: dia + (1 / 3) * (sys - dia)
    };

    onChange(state); // Pass the updated state to the callback function

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        label="Weight (kg)"
                        variant="standard"
                    />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        label="Height (feet)"
                        variant="standard"
                    />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField fullWidth value={temp} onChange={(e) => setTemp(e.target.value)} label="Temp (°F)" variant="standard" />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField fullWidth value={spO2} onChange={(e) => setSPO2(e.target.value)} label="SPO2" variant="standard" />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField fullWidth value={sys} onChange={(e) => setSys(e.target.value)} label="Systolic" variant="standard" />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField fullWidth value={dia} onChange={(e) => setDia(e.target.value)} label="Diastolic" variant="standard" />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField fullWidth value={pi} onChange={(e) => setPi(e.target.value)} label="Perfusion Index" variant="standard" />
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12}>
                    <TextField fullWidth value={pr} onChange={(e) => setPr(e.target.value)} label="Pulse Rate" variant="standard" />
                </Grid>
            </Grid>
        </div>
    );
}
