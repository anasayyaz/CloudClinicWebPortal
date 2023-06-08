import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';
import AppointmentList from 'views/appointmentList';
import MyPatients from 'views/physicianPages/myPatients';
import Accounts from 'views/physicianPages/accounts';
import PageNotFound from 'views/pageNotFound';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// ==============================|| MAIN ROUTING ||============================== //

const PhysicianRoutes = {
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
            path: 'my-patients',
            element: <MyPatients />
        },
        {
            path: 'accounts',
            element: <Accounts />
        },
        {
            path: '*',
            element: <PageNotFound />
        }
    ]
};

export default PhysicianRoutes;
