import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { useState } from 'react';

export default function HistoryForm({ data, onUpdate }) {
    const [state, setState] = useState(data);

    const handleState = (key, value) => {
        setState((prevState) => ({ ...prevState, [key]: value }));
    };

    onUpdate(state); // Pass the updated state to the callback function

    return (
        <div>
            <Accordion>
                {/* ===================================  Chief Complaints */}

                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography sx={styles.accordianTitle}>I - Chief Complaints</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isFever} onChange={(e) => handleState('isFever', e.target.checked)} />}
                                label="Fever"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isShortnessofBreath}
                                        onChange={(e) => handleState('isShortnessofBreath', e.target.checked)}
                                    />
                                }
                                label="Shortness of Breath"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isHeadache} onChange={(e) => handleState('isHeadache', e.target.checked)} />
                                }
                                label="Headache"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isBackache} onChange={(e) => handleState('isBackache', e.target.checked)} />
                                }
                                label="Backache"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isChestPain} onChange={(e) => handleState('isChestPain', e.target.checked)} />
                                }
                                label="Chest Pain"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isStomachPain}
                                        onChange={(e) => handleState('isStomachPain', e.target.checked)}
                                    />
                                }
                                label="Stomach Pain"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isWeaknessGeneralized}
                                        onChange={(e) => handleState('isWeaknessGeneralized', e.target.checked)}
                                    />
                                }
                                label="Weakness"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isWeightLoss}
                                        onChange={(e) => handleState('isWeightLoss', e.target.checked)}
                                    />
                                }
                                label="Weight Loss"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.iscough} onChange={(e) => handleState('iscough', e.target.checked)} />}
                                label="Cough"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isVomiting} onChange={(e) => handleState('isVomiting', e.target.checked)} />
                                }
                                label="Vomiting"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isDiarrhea} onChange={(e) => handleState('isDiarrhea', e.target.checked)} />
                                }
                                label="Diarrhea"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isLossofConsciousness}
                                        onChange={(e) => handleState('isLossofConsciousness', e.target.checked)}
                                    />
                                }
                                label="Loss of Consciousness"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isStroke} onChange={(e) => handleState('isStroke', e.target.checked)} />}
                                label="Stroke"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isHBP} onChange={(e) => handleState('isHBP', e.target.checked)} />}
                                label="High Blood Pressue"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isAbnormalLabTest}
                                        onChange={(e) => handleState('isAbnormalLabTest', e.target.checked)}
                                    />
                                }
                                label="Abnormal Lab Test"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isAnyOtherComplaint}
                                        onChange={(e) => handleState('isAnyOtherComplaint', e.target.checked)}
                                    />
                                }
                                label="Any other complaint"
                            />
                        </Grid>

                        {state?.isAnyOtherComplaint && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    value={state?.anyOtherComplaint}
                                    onChange={(e) => handleState('anyOtherComplaint', e.target.value)}
                                    fullWidth
                                    label="Any Other Complaint"
                                    variant="standard"
                                />
                            </Grid>
                        )}

                        <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                            <TextField
                                value={state?.forHowLong}
                                onChange={(e) => handleState('forHowLong', e.target.value)}
                                fullWidth
                                label="For how long?"
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* ===================================  Diseases */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                    <Typography sx={styles.accordianTitle}>II - Diseases</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isEyeProblem}
                                        onChange={(e) => handleState('isEyeProblem', e.target.checked)}
                                    />
                                }
                                label="Eye Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isEarProblem}
                                        onChange={(e) => handleState('isEarProblem', e.target.checked)}
                                    />
                                }
                                label="Ear Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isNoseProblem}
                                        onChange={(e) => handleState('isNoseProblem', e.target.checked)}
                                    />
                                }
                                label="Nose Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isThroatProblem}
                                        onChange={(e) => handleState('isThroatProblem', e.target.checked)}
                                    />
                                }
                                label="Throat Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isDentalPrblem}
                                        onChange={(e) => handleState('isDentalPrblem', e.target.checked)}
                                    />
                                }
                                label="Dental Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isMouthProblem}
                                        onChange={(e) => handleState('isMouthProblem', e.target.checked)}
                                    />
                                }
                                label="Mouth Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isThyroidProblem}
                                        onChange={(e) => handleState('isThyroidProblem', e.target.checked)}
                                    />
                                }
                                label="Thyroid Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isHeartDisease}
                                        onChange={(e) => handleState('isHeartDisease', e.target.checked)}
                                    />
                                }
                                label="Heart Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isLungDisease}
                                        onChange={(e) => handleState('isLungDisease', e.target.checked)}
                                    />
                                }
                                label="Lung Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isLeverDisease}
                                        onChange={(e) => handleState('isLeverDisease', e.target.checked)}
                                    />
                                }
                                label="Liver Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isJaundice} onChange={(e) => handleState('isJaundice', e.target.checked)} />
                                }
                                label="Jaundice"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isHepatitis} onChange={(e) => handleState('isHepatitis', e.target.checked)} />
                                }
                                label="Hepatitis"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSwallingProblem}
                                        onChange={(e) => handleState('isSwallingProblem', e.target.checked)}
                                    />
                                }
                                label="Swallowing Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isKidneyDisease}
                                        onChange={(e) => handleState('isKidneyDisease', e.target.checked)}
                                    />
                                }
                                label="Kidney Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBoneDisease}
                                        onChange={(e) => handleState('isBoneDisease', e.target.checked)}
                                    />
                                }
                                label="Bone Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSkinDisease}
                                        onChange={(e) => handleState('isSkinDisease', e.target.checked)}
                                    />
                                }
                                label="Skin Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isDiabetes} onChange={(e) => handleState('isDiabetes', e.target.checked)} />
                                }
                                label="Diabetes"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isAnemia} onChange={(e) => handleState('isAnemia', e.target.checked)} />}
                                label="Anemia"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBloodDisease}
                                        onChange={(e) => handleState('isBloodDisease', e.target.checked)}
                                    />
                                }
                                label="Blood Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBleedingProblem}
                                        onChange={(e) => handleState('isBleedingProblem', e.target.checked)}
                                    />
                                }
                                label="Bleeding Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isTumor} onChange={(e) => handleState('isTumor', e.target.checked)} />}
                                label="Tumor"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isCancer} onChange={(e) => handleState('isCancer', e.target.checked)} />}
                                label="Cancer"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isDementia} onChange={(e) => handleState('isDementia', e.target.checked)} />
                                }
                                label="Dementia"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isPsychologicalProblem}
                                        onChange={(e) => handleState('isPsychologicalProblem', e.target.checked)}
                                    />
                                }
                                label="Psychological Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isSeizure} onChange={(e) => handleState('isSeizure', e.target.checked)} />
                                }
                                label="Seizure"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* ===================================  Symptoms */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
                    <Typography sx={styles.accordianTitle}>III - Symptoms</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isMuscleWeakDis}
                                        onChange={(e) => handleState('isMuscleWeakDis', e.target.checked)}
                                    />
                                }
                                label="Muscle Weakness"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSleepDisturbance}
                                        onChange={(e) => handleState('isSleepDisturbance', e.target.checked)}
                                    />
                                }
                                label="Sleep Disturbance"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isHeartRacing}
                                        onChange={(e) => handleState('isHeartRacing', e.target.checked)}
                                    />
                                }
                                label="Heart Racing"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isHeartBurn} onChange={(e) => handleState('isHeartBurn', e.target.checked)} />
                                }
                                label="Heart Burn"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBloodinStool}
                                        onChange={(e) => handleState('isBloodinStool', e.target.checked)}
                                    />
                                }
                                label="Blood in Stool"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSwollenFeet}
                                        onChange={(e) => handleState('isSwollenFeet', e.target.checked)}
                                    />
                                }
                                label="Swollen Feet"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isFacialPuffiness}
                                        onChange={(e) => handleState('isFacialPuffiness', e.target.checked)}
                                    />
                                }
                                label="Facial Puffiness"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBurningUrine}
                                        onChange={(e) => handleState('isBurningUrine', e.target.checked)}
                                    />
                                }
                                label="Burning Urine"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBloodinUrine}
                                        onChange={(e) => handleState('isBloodinUrine', e.target.checked)}
                                    />
                                }
                                label="Blood in Urine"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isKidneyStones}
                                        onChange={(e) => handleState('isKidneyStones', e.target.checked)}
                                    />
                                }
                                label="Kidney Stones"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isJointSwellingPain}
                                        onChange={(e) => handleState('isJointSwellingPain', e.target.checked)}
                                    />
                                }
                                label="Joint Swelling/Pain"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isSkinRash} onChange={(e) => handleState('isSkinRash', e.target.checked)} />
                                }
                                label="Skin Rash"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* ===================================  Current Medication */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="current-medication-content" id="current-medication-header">
                    <Typography sx={styles.accordianTitle}>IV - Current Medication</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.currentMedications}
                                onChange={(e) => handleState('currentMedications', e.target.value)}
                                label="Current Medication"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.medicineFrequency}
                                onChange={(e) => handleState('medicineFrequency', e.target.value)}
                                label="Frequency"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.medicineDosage}
                                onChange={(e) => handleState('medicineDosage', e.target.value)}
                                label="Dosage"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.medicineForm}
                                onChange={(e) => handleState('medicineForm', e.target.value)}
                                label="Form"
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* ===================================  Other Details */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="other-details-content" id="other-details-header">
                    <Typography sx={styles.accordianTitle}>V - Other Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.allergies}
                                onChange={(e) => handleState('allergies', e.target.value)}
                                label="Allergies"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.immunization}
                                onChange={(e) => handleState('immunization', e.target.value)}
                                label="Immunizations"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.surgeriesOperations}
                                onChange={(e) => handleState('surgeriesOperations', e.target.value)}
                                label="Surgeries Operations"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.anymoreaccident}
                                onChange={(e) => handleState('anymoreaccident', e.target.value)}
                                label="Accident"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.bloodtransfusion}
                                        onChange={(e) => handleState('bloodtransfusion', e.target.checked)}
                                    />
                                }
                                label="Blood Transfusion"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* ===================================  Social History */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="social-history-content" id="social-history-header">
                    <Typography sx={styles.accordianTitle}>VI - Social History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.profession}
                                onChange={(e) => handleState('profession', e.target.value)}
                                label="Profession / Job"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isSmooking} onChange={(e) => handleState('isSmooking', e.target.checked)} />
                                }
                                label="Smoking"
                            />
                            <TextField
                                fullWidth
                                value={state?.smoking}
                                onChange={(e) => handleState('smoking', e.target.value)}
                                label="Smoking Frequency"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isDrinking} onChange={(e) => handleState('isDrinking', e.target.checked)} />
                                }
                                label="Drinking"
                            />
                            <TextField
                                fullWidth
                                value={state?.drinking}
                                onChange={(e) => handleState('drinking', e.target.value)}
                                label="Drinking Frequency"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={state.isDrugs} onChange={(e) => handleState('isDrugs', e.target.checked)} />}
                                label="Drugs"
                            />
                            <TextField
                                fullWidth
                                value={state?.drugs}
                                onChange={(e) => handleState('drugs', e.target.value)}
                                label="Drugs Frequency"
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* ===================================  Family History */}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="family-history-content" id="family-history-header">
                    <Typography sx={styles.accordianTitle}>VII - Family History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.familyMemberSameMedicalProblems}
                                onChange={(e) => handleState('familyMemberSameMedicalProblems', e.target.value)}
                                label="Family member having same medical problems"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.familyMembersHavingNotableIllness}
                                onChange={(e) => handleState('familyMembersHavingNotableIllness', e.target.value)}
                                label="Family member having noteable illness"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.familyMembersDiedSpecificIllness}
                                onChange={(e) => handleState('familyMembersDiedSpecificIllness', e.target.value)}
                                label="Family Member died for specific illness"
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* <Button onClick={() => console.log('state ', state)}>Save</Button> */}
        </div>
    );
}

const styles = {
    accordianTitle: { fontSize: 16, fontWeight: 600 }
};
