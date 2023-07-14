import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';
import AppointmentList from 'views/appointmentList';
import PageNotFound from 'views/pageNotFound';
import Meeting from 'views/meeting';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// ==============================|| MAIN ROUTING ||============================== //

const NurseRoutes = {
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
            path: 'appointment-list',
            element: <AppointmentList />
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

export default NurseRoutes;
