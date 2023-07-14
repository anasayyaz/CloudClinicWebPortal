import React, { useEffect, useState } from 'react';

// material-ui
import { Box, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';

// project imports
import TotalOrderDarkChartCard from '../cards/TotalOrderDarkChartCard';
import TotalIncomeDarkCard from '../cards/TotalIncomeDarkCard';
import TotalIncomeLightCard from '../cards/TotalIncomeLightCard';
import { gridSpacing } from 'store/constant';
import TotalOrderLightChartCard from '../cards/TotalOrderLightChartCard';

import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import {
    IconCalendarEvent,
    IconCalendarOff,
    IconCalendarDue,
    IconStethoscope,
    IconUsers,
    IconNurse,
    IconWheelchair,
    IconUser
} from '@tabler/icons';
import { useNavigate } from 'react-router';
import useFetch from 'hooks/useFetch';
import { BASE_URL } from 'constants/baseUrl';
import PropTypes from 'prop-types';
import UpcomingAppointments from './UpcomingAppointments';
import { useSelector } from 'react-redux';
import CompletedAppointments from './CompletedAppointments';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Physician = () => {
    const { user } = useSelector((state) => state?.user);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const {
        data: stats,
        loading: loadingStats,
        error: errorStats,
        refetch: refetchStats
    } = useFetch(`${BASE_URL}api/DashBoard/PhysicianDBStats/${user?.userId}`);

    const {
        data: upcomingAppointments,
        loading: loadingUpComingAppt,
        error: errorUpComingAppt,
        refetch: refetchUpcomingAppts
    } = useFetch(`${BASE_URL}api/physician/physicianUpcomingVisits/${user?.userId}`);

    const {
        data: completedAppointments,
        loading: loadingCompletedAppt,
        error: errorCompletedAppt,
        refetch: refetchCompletedAppts
    } = useFetch(`${BASE_URL}api/physician/physicianVisits/${user?.userId}`);

    const navigate = useNavigate();

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    }

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Today Visits'}
                            number={stats?.physicianStats?.countGPTodayAppoinments || 0}
                            icon={<IconCalendarEvent fontSize="inherit" />}
                            isLoading={loadingStats}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Today Virtual Appointments'}
                            number={stats?.physicianStats?.countGPTodayVirtualAppoinments || 0}
                            icon={<IconCalendarDue fontSize="inherit" />}
                            isLoading={loadingStats}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Today In-Person Appointments'}
                            number={stats?.physicianStats?.countGPTodayInpersonAppoinments || 0}
                            icon={<PermContactCalendarOutlinedIcon fontSize="inherit" />}
                            isLoading={loadingStats}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Cancelled Appointments'}
                            number={stats?.physicianStats?.countGPTotalCancelAppointments || 0}
                            icon={<IconCalendarOff fontSize="inherit" />}
                            isLoading={loadingStats}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Upcoming Appointments" {...a11yProps(0)} />
                        <Tab label="Completed Appointments" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                <CustomTabPanel value={value} index={0}>
                    <UpcomingAppointments
                        data={upcomingAppointments}
                        loading={loadingUpComingAppt}
                        error={errorUpComingAppt}
                        refetchApt={refetchUpcomingAppts}
                        refetchStats={refetchStats}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <CompletedAppointments
                        data={completedAppointments?.items}
                        loading={loadingCompletedAppt}
                        error={errorCompletedAppt}
                        refetchApt={refetchCompletedAppts}
                    />
                </CustomTabPanel>
            </Grid>
        </Grid>
    );
};

export default Physician;
