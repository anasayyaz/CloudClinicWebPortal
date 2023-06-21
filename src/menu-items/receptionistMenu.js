// assets
import {
    IconDashboard,
    IconCalendarTime,
    IconCalendarStats,
    IconNurse,
    IconBuildingHospital,
    IconStethoscope,
    IconWheelchair
} from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconCalendarTime,
    IconCalendarStats,
    IconNurse,
    IconBuildingHospital,
    IconStethoscope,
    IconWheelchair
};

// ==============================|| MAIN MENU ITEMS ||============================== //

const receptionistMenu = [
    {
        id: 'receptionist-menu',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard',
                icon: icons.IconDashboard,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 're-appointment-menu',
        type: 'group',
        children: [
            {
                id: 'appointments',
                title: 'Appointments',
                type: 'collapse',
                icon: icons.IconCalendarTime,

                children: [
                    {
                        id: 'appointments/add-edit',
                        title: 'Add / Edit',
                        type: 'item',
                        url: '/appointments/add-edit'
                    },
                    {
                        id: 'appointments/to-be-added',
                        title: 'To Be Added',
                        type: 'item',
                        url: '/appointments/to-be-added'
                    },
                    {
                        id: 'appointments/to-be-cancelled',
                        title: 'To Be Cancelled',
                        type: 'item',
                        url: '/appointments/to-be-cancelled'
                    },
                    {
                        id: 'appointments/available-slots',
                        title: 'Available Slots',
                        type: 'item',
                        url: '/appointments/available-slots'
                    },
                    {
                        id: 'appointments/lists',
                        title: 'Lists',
                        type: 'item',
                        url: '/appointments/lists'
                    },
                    {
                        id: 'appointments/completed',
                        title: 'Completed',
                        type: 'item',
                        url: '/appointments/completed'
                    },
                    {
                        id: 'appointments/cancelled',
                        title: 'Cancelled',
                        type: 'item',
                        url: '/appointments/cancelled'
                    }
                ]
            },
            {
                id: 'upcoming-visits',
                title: 'Upcoming Visits',
                type: 'item',
                url: '/upcoming-visits',
                icon: icons.IconCalendarStats,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 're-staff-and-users',
        type: 'group',
        children: [
            {
                id: 'physicians',
                title: 'Physicians',
                type: 'item',
                url: '/physicians',
                icon: icons.IconStethoscope,
                breadcrumbs: false
            },
            {
                id: 'patients',
                title: 'Patients',
                type: 'item',
                url: '/patients',
                icon: icons.IconWheelchair,
                breadcrumbs: false
            },
            {
                id: 'nurses',
                title: 'Nurses',
                type: 'item',
                url: '/nurses',
                icon: icons.IconNurse,
                breadcrumbs: false
            },
            {
                id: 'wards',
                title: 'Wards',
                type: 'item',
                url: '/wards',
                icon: icons.IconBuildingHospital,
                breadcrumbs: false
            },
            {
                id: 'device',
                title: 'Device',
                type: 'item',
                url: '/device',
                icon: icons.IconDeviceCameraPhone,
                breadcrumbs: false
            }
        ]
    }
];

export default receptionistMenu;
