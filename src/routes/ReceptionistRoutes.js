import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Physicians from 'views/staff/physicians';
import Patients from 'views/staff/patients';
import Nurse from 'views/staff/nurse';
import Wards from 'views/healthCare/wards';
import Device from 'views/settings/device';
import Meeting from 'views/meeting';
import UpcomingVisits from 'views/upcomingVisits';
import AddEdit from 'views/appointments/addEdit';
import ToBeAdded from 'views/appointments/tobeAdded';
import ToBeCancelled from 'views/appointments/tobeCancelled';
import AvailableSlots from 'views/appointments/availableSlots';
import Lists from 'views/appointments/lists';
import Completed from 'views/appointments/completed';
import Cancelled from 'views/appointments/cancelled';
import { Navigate } from 'react-router-dom';
import PageNotFound from 'views/pageNotFound';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const ReceptionistRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Navigate to="/dashboard" replace={true} />
        },
        {
            path: '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '/login',
            element: <Navigate to="/dashboard" replace={true} />
        },
        {
            path: '/',
            children: [
                {
                    path: '/appointments/add-edit',
                    element: <AddEdit />
                },
                {
                    path: '/appointments/to-be-added',
                    element: <ToBeAdded />
                },
                {
                    path: '/appointments/to-be-cancelled',
                    element: <ToBeCancelled />
                },
                {
                    path: '/appointments/available-slots',
                    element: <AvailableSlots />
                },
                {
                    path: '/appointments/lists',
                    element: <Lists />
                },
                {
                    path: '/appointments/completed',
                    element: <Completed />
                },
                {
                    path: '/appointments/cancelled',
                    element: <Cancelled />
                }
            ]
        },
        {
            path: 'upcoming-visits',
            element: <UpcomingVisits />
        },
        {
            path: 'physicians',
            element: <Physicians />
        },
        {
            path: 'patients',
            element: <Patients />
        },
        {
            path: 'nurses',
            element: <Nurse />
        },
        {
            path: 'wards',
            element: <Wards />
        },
        { path: 'meeting', element: Meeting },
        {
            path: 'device',
            element: <Device />
        },
        {
            path: 'meeting/:visitId',
            element: <Meeting />
        },
        {
            path: '*',
            element: <PageNotFound />
        }
    ]
};

export default ReceptionistRoutes;
