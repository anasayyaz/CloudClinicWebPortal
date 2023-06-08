import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { COLORS } from 'constants/colors';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: COLORS.white,
    color: COLORS.white,
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: COLORS.secondory,
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        // content: '""',
        // position: 'absolute',
        // zIndex: 1,
        // width: 210,
        // height: 210,
        // background: theme.palette.primary[800],
        // borderRadius: '50%',
        // top: -125,
        // right: -15,
        // opacity: 0.5,
        // [theme.breakpoints.down('sm')]: {
        //     top: -155,
        //     right: -70
        // }
    }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLightChartCard = ({ isLoading, title, number, icon }) => {
    const theme = useTheme();

    const [timeValue, setTimeValue] = useState(false);
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: COLORS.secondory,
                                                color: COLORS.white,
                                                mt: 1
                                            }}
                                        >
                                            {icon}
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 0.75 }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={66}>
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                <Typography
                                                    sx={{
                                                        fontSize: '2.125rem',
                                                        fontWeight: 500,
                                                        mr: 1,
                                                        mt: 1.75,
                                                        mb: 0.75,
                                                        color: COLORS.primary
                                                    }}
                                                >
                                                    {number}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 500,
                                                        color: COLORS.secondory
                                                    }}
                                                >
                                                    {title}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalOrderLightChartCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalOrderLightChartCard;
