// assets
import {
    IconDashboard,
    IconCalendarTime,
    IconCalendarStats,
    IconCash,
    IconMapPin,
    IconNurse,
    IconSettings,
    IconUser,
    IconPill,
    IconBrandBandlab,
    IconBuildingHospital,
    IconBriefcase,
    IconUsers,
    IconStethoscope,
    IconWheelchair,
    IconDeviceCameraPhone
} from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconCalendarTime,
    IconCalendarStats,
    IconCash,
    IconMapPin,
    IconNurse,
    IconSettings,
    IconUser,
    IconPill,
    IconBrandBandlab,
    IconBuildingHospital,
    IconBriefcase,
    IconUsers,
    IconStethoscope,
    IconWheelchair,
    IconDeviceCameraPhone
};

// ==============================|| MAIN MENU ITEMS ||============================== //

const mainMenu = [
    {
        id: 'dashboard',
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
        id: 'appointment-menu',
        // title: 'Pages',
        // caption: 'Pages Caption',
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
        id: 'staff-and-users',
        type: 'group',
        children: [
            {
                id: 'users',
                title: 'Users',
                type: 'item',
                url: '/users',
                icon: icons.IconUsers,
                breadcrumbs: false
            },
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
                id: 'receptionists',
                title: 'Receptionists',
                type: 'item',
                url: '/receptionists',
                icon: icons.IconUser,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 'health-care',
        type: 'group',
        children: [
            {
                id: 'medicine',
                title: 'Medicine',
                type: 'item',
                url: '/medicine',
                icon: icons.IconPill,
                breadcrumbs: false
            },
            {
                id: 'lab-test',
                title: 'Lab Test',
                type: 'item',
                url: '/lab-test',
                icon: icons.IconBrandBandlab,
                breadcrumbs: false
            },
            {
                id: 'speciality',
                title: 'Speciality',
                type: 'item',
                url: '/speciality',
                icon: icons.IconBriefcase,
                breadcrumbs: false
            },
            {
                id: 'wards',
                title: 'Wards',
                type: 'item',
                url: '/wards',
                icon: icons.IconBuildingHospital,
                breadcrumbs: false
            }
        ]
    },
    {
        id: 'setting-menu',
        type: 'group',
        children: [
            {
                id: 'location',
                title: 'Location',
                type: 'item',
                url: '/location',
                icon: icons.IconMapPin,
                breadcrumbs: false
            },
            {
                id: 'payment',
                title: 'Payment',
                type: 'item',
                url: '/payment',
                icon: icons.IconCash,
                breadcrumbs: false
            },
            {
                id: 'configuration',
                title: 'Configuration',
                type: 'item',
                url: '/configuration',
                icon: icons.IconSettings,
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

export default mainMenu;
