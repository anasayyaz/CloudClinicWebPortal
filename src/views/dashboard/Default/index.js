import { useEffect, useState } from 'react';

// material-ui
import { Divider, Grid } from '@mui/material';

// project imports
import TotalOrderDarkChartCard from './TotalOrderDarkChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import { gridSpacing } from 'store/constant';
import TotalOrderLightChartCard from './TotalOrderLightChartCard';

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

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Today Visits'}
                            number={3}
                            icon={<IconCalendarEvent fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Today Virtual Appointments'}
                            number={3}
                            icon={<IconCalendarDue fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Today In-Person Appointments'}
                            number={3}
                            icon={<PermContactCalendarOutlinedIcon fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Cancelled Appointments'}
                            number={0}
                            icon={<IconCalendarOff fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Patients'}
                            number={3}
                            icon={<IconWheelchair fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Physicians'}
                            number={10}
                            icon={<IconStethoscope fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Receptionists'}
                            number={3}
                            icon={<IconUser fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Nurses'}
                            number={5}
                            icon={<IconNurse fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Divider />
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeLightCard title={'Add Patient'} icon={<IconWheelchair fontSize="inherit" />} isLoading={isLoading} />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeDarkCard title={'Add Physician'} icon={<IconStethoscope fontSize="inherit" />} isLoading={isLoading} />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeLightCard title={'Add Receptionist'} icon={<IconUser fontSize="inherit" />} isLoading={isLoading} />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeDarkCard title={'Add Nurse'} icon={<IconNurse fontSize="inherit" />} isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
