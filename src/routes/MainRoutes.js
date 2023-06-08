import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Physicians from 'views/staff/physicians';
import Patients from 'views/staff/patients';
import Nurse from 'views/staff/nurse';
import Receptionists from 'views/staff/receptionists';
import Medicine from 'views/healthCare/medicine';
import Configuration from 'views/settings/configuration';
import Payment from 'views/settings/payment';
import Location from 'views/settings/location';
import Wards from 'views/healthCare/wards';
import Speciality from 'views/healthCare/speciality';
import LabTest from 'views/healthCare/labTest';
import Users from 'views/staff/users';
import UpcomingVisits from 'views/upcomingVisits';
import AddEdit from 'views/appointments/addEdit';
import ToBeAdded from 'views/appointments/tobeAdded';
import ToBeCancelled from 'views/appointments/tobeCancelled';
import AvailableSlots from 'views/appointments/availableSlots';
import Lists from 'views/appointments/lists';
import Completed from 'views/appointments/completed';
import Cancelled from 'views/appointments/cancelled';
import { Navigate } from 'react-router-dom';
import AddNewPhysician from 'views/staff/physicians/AddNew';
import EditPhysician from 'views/staff/physicians/Edit';
import PageNotFound from 'views/pageNotFound';
import AddNewPatient from 'views/staff/patients/AddNew';
import EditPatient from 'views/staff/patients/Edit';
import AddNewNurse from 'views/staff/nurse/AddNew';
import EditNurse from 'views/staff/nurse/Edit';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
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
            path: 'users',
            element: <Users />
        },
        {
            path: 'physicians',
            element: <Physicians />
        },
        {
            path: 'physicians/add',
            element: <AddNewPhysician />
        },
        {
            path: 'physicians/edit/:nationalId',
            element: <EditPhysician />
        },
        {
            path: 'patients',
            element: <Patients />
        },
        {
            path: 'patients/add',
            element: <AddNewPatient />
        },
        {
            path: 'patients/edit/:nationalId',
            element: <EditPatient />
        },
        {
            path: 'nurses',
            element: <Nurse />
        },
        {
            path: 'nurses/add',
            element: <AddNewNurse />
        },
        {
            path: 'nurses/edit/:nationalId',
            element: <EditNurse />
        },
        {
            path: 'receptionists',
            element: <Receptionists />
        },
        {
            path: 'medicine',
            element: <Medicine />
        },
        {
            path: 'lab-test',
            element: <LabTest />
        },
        {
            path: 'speciality',
            element: <Speciality />
        },
        {
            path: 'wards',
            element: <Wards />
        },
        {
            path: 'location',
            element: <Location />
        },
        ,
        {
            path: 'payment',
            element: <Payment />
        },
        {
            path: 'configuration',
            element: <Configuration />
        },
        {
            path: '*',
            element: <PageNotFound />
        }
    ]
};

export default MainRoutes;
