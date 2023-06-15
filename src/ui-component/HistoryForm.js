import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { useState } from 'react';

export default function HistoryForm() {
    const [state, setState] = useState({
        historyID: 73,
        patient_NationalID: 'af990283-d448-4da1-b687-d82d4957a8a2',
        isDeleted: false,
        painScale: 5,
        currentMedications: '',
        allergies: 'peanuts',
        immunization: '',
        fever: '',
        weakness: null,
        shortnessOfBreath: '',
        weightLoss: '',
        swollenGlands: '',
        birthproblems: '',
        childhoodillness: '',
        anymoreaccident: '',
        bloodtransfusion: '',
        psychatricillness: '',
        expiredfamilymembers: null,
        anyfamilymemberswithdisease: null,
        smoking: '',
        drinking: '',
        drugs: '',
        recreational: '',
        ageatmenstruation: '',
        ageofmenopaise: '',
        abnormalperiods: '',
        numberofpregnancies: '',
        abortion: ' ',
        numberoflivebriths: '',
        anychilddied: '',
        lastmenstrualperiod: '',
        pregnant: '',
        lastpapsmear: '',
        breastlump: '',
        lastmemogram: '',
        hotflashes: '',
        breastfeeding: '',
        uterusbleed: '',
        contraception: '',
        cessarionsection: '',
        disability: '',
        stroke: '',
        headinjury: '',
        migrine: '',
        eyeproblems: '',
        sleepdisturbances: '',
        earproblems: '',
        noseproblems: '',
        throatproblems: '',
        dentalproblems: '',
        heartproblems: '',
        lungproblems: '',
        onhomeoxygen: '',
        swallowingproblems: '',
        liverproblems: '',
        urinaryproblems: '',
        kidneydisease: '',
        thyroiddisease: '',
        diabetes: '',
        muscularproblems: '',
        bonepain: '',
        jointstiffness: '',
        backproblems: '',
        skindisease: '',
        skinrashes: '',
        anemia: '',
        bloodclots: '',
        bleedingproblems: '',
        tumor: '',
        cancer: '',
        radiation: '',
        chemotherapy: '',
        addictious: '',
        visitID: 470,
        anyOtherComplaint: '',
        isAnyOtherComplaint: false,
        forHowLong: '',
        surgeriesOperations: '',
        familyMembersHavingNotableIllness: '',
        familyMembersDiedSpecificIllness: '',
        isFever: false,
        feverRange: 0,
        isShortnessofBreath: true,
        isHeadache: false,
        headacheRange: 0,
        isBackache: false,
        backacheRange: 0,
        isChestPain: false,
        chestPainRange: 0,
        isStomachPain: true,
        stomachPainRange: 0,
        isWeaknessGeneralized: false,
        isWeightLoss: false,
        iscough: false,
        isVomiting: true,
        isDiarrhea: false,
        isLossofConsciousness: false,
        isStroke: false,
        isHBP: false,
        isAbnormalLabTest: false,
        isSeizure: false,
        isMuscleWeakDis: false,
        isSleepDisturbance: false,
        isEyeProblem: false,
        isEarProblem: false,
        isNoseProblem: false,
        isThroatProblem: false,
        isDentalPrblem: false,
        isMouthProblem: true,
        isThyroidProblem: false,
        isHeartDisease: false,
        isHeartRacing: false,
        isLungDisease: false,
        isLeverDisease: true,
        isJaundice: false,
        isHepatitis: false,
        isSwallingProblem: false,
        isHeartBurn: false,
        isBloodinStool: false,
        isSwollenFeet: false,
        isFacialPuffiness: false,
        isKidneyDisease: false,
        isBurningUrine: false,
        isBloodinUrine: false,
        isKidneyStones: false,
        isBoneDisease: false,
        isJointSwellingPain: false,
        joinSwellingPainRange: 0,
        isSkinRash: false,
        isSkinDisease: false,
        isDiabetes: false,
        isAnemia: false,
        isBloodDisease: false,
        isBleedingProblem: false,
        isTumor: false,
        isCancer: false,
        isMentalDisease: false,
        isDementia: false,
        isPsychologicalProblem: false,
        isAddiction: false,
        isBloodTransfusion: false,
        isSmooking: false,
        isDrinking: false,
        isDrugs: false,
        isPregnant: false,
        isAbortionMiscarriage: false,
        isHotFlashes: false,
        isBreastFeeding: false,
        isUterinBleeding: false,
        medicineFrequency: '',
        medicineDosage: '',
        medicineForm: '',
        profession: '',
        familyMemberSameMedicalProblems: '',
        isConsultantRequired: true,
        isfollowup: false
    });

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
                                control={
                                    <Checkbox checked={state.isFever} onChange={(e) => setState({ ...state, isFever: e.target.checked })} />
                                }
                                label="Fever"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isShortnessofBreath}
                                        onChange={(e) => setState({ ...state, isShortnessofBreath: e.target.checked })}
                                    />
                                }
                                label="Shortness of Breath"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isHeadache}
                                        onChange={(e) => setState({ ...state, isHeadache: e.target.checked })}
                                    />
                                }
                                label="Headache"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBackache}
                                        onChange={(e) => setState({ ...state, isBackache: e.target.checked })}
                                    />
                                }
                                label="Backache"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isChestPain}
                                        onChange={(e) => setState({ ...state, isChestPain: e.target.checked })}
                                    />
                                }
                                label="Chest Pain"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isStomachPain}
                                        onChange={(e) => setState({ ...state, isStomachPain: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isWeaknessGeneralized: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isWeightLoss: e.target.checked })}
                                    />
                                }
                                label="Weight Loss"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.iscough} onChange={(e) => setState({ ...state, iscough: e.target.checked })} />
                                }
                                label="Cough"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isVomiting}
                                        onChange={(e) => setState({ ...state, isVomiting: e.target.checked })}
                                    />
                                }
                                label="Vomiting"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isDiarrhea}
                                        onChange={(e) => setState({ ...state, isDiarrhea: e.target.checked })}
                                    />
                                }
                                label="Diarrhea"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isLossofConsciousness}
                                        onChange={(e) => setState({ ...state, isLossofConsciousness: e.target.checked })}
                                    />
                                }
                                label="Loss of Consciousness"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isStroke}
                                        onChange={(e) => setState({ ...state, isStroke: e.target.checked })}
                                    />
                                }
                                label="Stroke"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isHBP} onChange={(e) => setState({ ...state, isHBP: e.target.checked })} />
                                }
                                label="High Blood Pressue"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isAbnormalLabTest}
                                        onChange={(e) => setState({ ...state, isAbnormalLabTest: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isAnyOtherComplaint: e.target.checked })}
                                    />
                                }
                                label="Any other complaint"
                            />
                        </Grid>

                        {state?.isAnyOtherComplaint && (
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TextField
                                    value={state?.anyOtherComplaint}
                                    onChange={(e) => setState({ ...state, anyOtherComplaint: e.target.value })}
                                    fullWidth
                                    label="Any Other Complaint"
                                    variant="standard"
                                />
                            </Grid>
                        )}

                        <Grid item lg={12} md={12} sm={12} xs={12} mt={1}>
                            <TextField
                                value={state?.forHowLong}
                                onChange={(e) => setState({ ...state, forHowLong: e.target.value })}
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
                                        onChange={(e) => setState({ ...state, isEyeProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isEarProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isNoseProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isThroatProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isDentalPrblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isMouthProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isThyroidProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isHeartDisease: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isLungDisease: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isLeverDisease: e.target.checked })}
                                    />
                                }
                                label="Liver Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isJaundice}
                                        onChange={(e) => setState({ ...state, isJaundice: e.target.checked })}
                                    />
                                }
                                label="Jaundice"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isHepatitis}
                                        onChange={(e) => setState({ ...state, isHepatitis: e.target.checked })}
                                    />
                                }
                                label="Hepatitis"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSwallingProblem}
                                        onChange={(e) => setState({ ...state, isSwallingProblem: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isKidneyDisease: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isBoneDisease: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isSkinDisease: e.target.checked })}
                                    />
                                }
                                label="Skin Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isDiabetes}
                                        onChange={(e) => setState({ ...state, isDiabetes: e.target.checked })}
                                    />
                                }
                                label="Diabetes"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isAnemia}
                                        onChange={(e) => setState({ ...state, isAnemia: e.target.checked })}
                                    />
                                }
                                label="Anemia"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBloodDisease}
                                        onChange={(e) => setState({ ...state, isBloodDisease: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isBleedingProblem: e.target.checked })}
                                    />
                                }
                                label="Bleeding Disease"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isTumor} onChange={(e) => setState({ ...state, isTumor: e.target.checked })} />
                                }
                                label="Tumor"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isCancer}
                                        onChange={(e) => setState({ ...state, isCancer: e.target.checked })}
                                    />
                                }
                                label="Cancer"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isDementia}
                                        onChange={(e) => setState({ ...state, isDementia: e.target.checked })}
                                    />
                                }
                                label="Dementia"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isPsychologicalProblem}
                                        onChange={(e) => setState({ ...state, isPsychologicalProblem: e.target.checked })}
                                    />
                                }
                                label="Psychological Problem"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSeizure}
                                        onChange={(e) => setState({ ...state, isSeizure: e.target.checked })}
                                    />
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
                                        onChange={(e) => setState({ ...state, isMuscleWeakDis: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isSleepDisturbance: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isHeartRacing: e.target.checked })}
                                    />
                                }
                                label="Heart Racing"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isHeartBurn}
                                        onChange={(e) => setState({ ...state, isHeartBurn: e.target.checked })}
                                    />
                                }
                                label="Heart Burn"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isBloodinStool}
                                        onChange={(e) => setState({ ...state, isBloodinStool: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isSwollenFeet: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isFacialPuffiness: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isBurningUrine: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isBloodinUrine: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isKidneyStones: e.target.checked })}
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
                                        onChange={(e) => setState({ ...state, isJointSwellingPain: e.target.checked })}
                                    />
                                }
                                label="Joint Swelling/Pain"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSkinRash}
                                        onChange={(e) => setState({ ...state, isSkinRash: e.target.checked })}
                                    />
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
                                onChange={(e) => setState({ ...state, currentMedications: e.target.value })}
                                label="Current Medication"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.medicineFrequency}
                                onChange={(e) => setState({ ...state, medicineFrequency: e.target.value })}
                                label="Frequency"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.medicineDosage}
                                onChange={(e) => setState({ ...state, medicineDosage: e.target.value })}
                                label="Dosage"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.medicineForm}
                                onChange={(e) => setState({ ...state, medicineForm: e.target.value })}
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
                                onChange={(e) => setState({ ...state, allergies: e.target.value })}
                                label="Allergies"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.immunization}
                                onChange={(e) => setState({ ...state, immunization: e.target.value })}
                                label="Immunizations"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.surgeriesOperations}
                                onChange={(e) => setState({ ...state, surgeriesOperations: e.target.value })}
                                label="Surgeries Operations"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={3} md={4} sm={6} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.anymoreaccident}
                                onChange={(e) => setState({ ...state, anymoreaccident: e.target.value })}
                                label="Accident"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.bloodtransfusion}
                                        onChange={(e) => setState({ ...state, bloodtransfusion: e.target.checked })}
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
                                onChange={(e) => setState({ ...state, profession: e.target.value })}
                                label="Profession / Job"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isSmooking}
                                        onChange={(e) => setState({ ...state, isSmooking: e.target.checked })}
                                    />
                                }
                                label="Smoking"
                            />
                            <TextField
                                fullWidth
                                value={state?.smoking}
                                onChange={(e) => setState({ ...state, smoking: e.target.value })}
                                label="Smoking Frequency"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.isDrinking}
                                        onChange={(e) => setState({ ...state, isDrinking: e.target.checked })}
                                    />
                                }
                                label="Drinking"
                            />
                            <TextField
                                fullWidth
                                value={state?.drinking}
                                onChange={(e) => setState({ ...state, drinking: e.target.value })}
                                label="Drinking Frequency"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={4} md={4} sm={6} xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox checked={state.isDrugs} onChange={(e) => setState({ ...state, isDrugs: e.target.checked })} />
                                }
                                label="Drugs"
                            />
                            <TextField
                                fullWidth
                                value={state?.drugs}
                                onChange={(e) => setState({ ...state, drugs: e.target.value })}
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
                                onChange={(e) => setState({ ...state, familyMemberSameMedicalProblems: e.target.value })}
                                label="Faimly member having same medical problems"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.familyMembersHavingNotableIllness}
                                onChange={(e) => setState({ ...state, familyMembersHavingNotableIllness: e.target.value })}
                                label="Faimly member having noteable illness"
                                variant="standard"
                            />
                        </Grid>

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <TextField
                                fullWidth
                                value={state?.familyMembersDiedSpecificIllness}
                                onChange={(e) => setState({ ...state, familyMembersDiedSpecificIllness: e.target.value })}
                                label="Faimly Member died for specifc illness"
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
