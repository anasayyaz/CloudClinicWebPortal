import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';
import AppointmentList from 'views/appointmentList';
import MyPatients from 'views/physicianPages/myPatients';
import Accounts from 'views/physicianPages/accounts';
import PageNotFound from 'views/pageNotFound';
import Meeting from 'views/meeting';
import PatientVisits from 'views/physicianPages/myPatients/PatientVisits';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

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
        // {
        //     path: 'appointment-list',
        //     element: <AppointmentList />
        // },
        {
            path: 'my-patients',
            element: <MyPatients />
        },
        {
            path: 'my-patients/visits',
            element: <PatientVisits />
        },
        {
            path: 'accounts',
            element: <Accounts />
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

export default PhysicianRoutes;
