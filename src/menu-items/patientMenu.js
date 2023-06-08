// assets
import { IconDashboard, IconCalendarTime, IconWheelchair, IconPill, IconBrandBandlab, IconHistory } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconCalendarTime,
    IconWheelchair,
    IconPill,
    IconBrandBandlab,
    IconHistory
};

// ==============================|| MAIN MENU ITEMS ||============================== //

const patientMenu = [
    {
        id: 'patient-menu',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'item',
                url: '/dashboard',
                icon: icons.IconDashboard,
                breadcrumbs: false
            },
            {
                id: 'appointment-list',
                title: 'Appointment List',
                type: 'item',
                url: '/appointment-list',
                icon: icons.IconCalendarTime,
                breadcrumbs: false
            },
            {
                id: 'medicine',
                title: 'Medicines',
                type: 'item',
                url: '/medicines',
                icon: icons.IconPill,
                breadcrumbs: false
            },
            {
                id: 'lab-reports',
                title: 'Lab Reports',
                type: 'item',
                url: '/lab-reports',
                icon: icons.IconBrandBandlab,
                breadcrumbs: false
            },
            {
                id: 'previous-visits',
                title: 'Previous Visits',
                type: 'item',
                url: '/previous-visits',
                icon: icons.IconHistory,
                breadcrumbs: false
            }
        ]
    }
];

export default patientMenu;
