import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { Navigate } from 'react-router-dom';
import AppointmentList from 'views/appointmentList';
import LabReports from 'views/patientPages/labReports';
import Medicines from 'views/patientPages/medicines';
import PreviousVisits from 'views/patientPages/previousVisits';
import PageNotFound from 'views/pageNotFound';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// ==============================|| MAIN ROUTING ||============================== //

const PatientRoutes = {
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
        ,
        {
            path: 'lab-reports',
            element: <LabReports />
        },
        {
            path: 'medicines',
            element: <Medicines />
        },
        {
            path: 'previous-visits',
            element: <PreviousVisits />
        },
        {
            path: '*',
            element: <PageNotFound />
        }
    ]
};

export default PatientRoutes;
