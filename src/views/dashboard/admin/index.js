import { useEffect, useState } from 'react';

// material-ui
import { Divider, Grid } from '@mui/material';

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

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Admin = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const {
        data: stats,
        loading: loadingStats,
        error: errorStats,
        refetch: refetchStats
    } = useFetch(`${BASE_URL}api/DashBoard/AdminDBStats`);

    const navigate = useNavigate();

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Today Visits'}
                            number={stats?.adminStats?.totalCounttodaysvisits || 0}
                            icon={<IconCalendarEvent fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Today Virtual Appointments'}
                            number={stats?.adminStats?.countTodayVirtualAppoinments || 0}
                            icon={<IconCalendarDue fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Today In-Person Appointments'}
                            number={stats?.adminStats?.countTodayInpersonAppoinments || 0}
                            icon={<PermContactCalendarOutlinedIcon fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Cancelled Appointments'}
                            number={stats?.adminStats?.countTotalCancelVisits || 0}
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
                            number={stats?.adminStats?.totalCountpatients || 0}
                            icon={<IconWheelchair fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Physicians'}
                            number={stats?.adminStats?.totalCountphysicians || 0}
                            icon={<IconStethoscope fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderDarkChartCard
                            title={'Receptionists'}
                            number={stats?.adminStats?.totalCountReceptionist || 0}
                            icon={<IconUser fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item lg={3} md={6} sm={6} xs={12}>
                        <TotalOrderLightChartCard
                            title={'Nurses'}
                            number={stats?.adminStats?.totalCountnurses || 0}
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
                        <TotalIncomeLightCard
                            onClick={() => navigate('/patients/add')}
                            title={'Add Patient'}
                            icon={<IconWheelchair fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeDarkCard
                            onClick={() => navigate('/physicians/add')}
                            title={'Add Physician'}
                            icon={<IconStethoscope fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeLightCard
                            onClick={() => navigate('/receptionists/add')}
                            title={'Add Receptionist'}
                            icon={<IconUser fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={3}>
                        <TotalIncomeDarkCard
                            onClick={() => navigate('/nurses/add')}
                            title={'Add Nurse'}
                            icon={<IconNurse fontSize="inherit" />}
                            isLoading={isLoading}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Admin;
