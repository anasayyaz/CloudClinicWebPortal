// assets
import { IconDashboard, IconCalendarTime } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconCalendarTime
};

// ==============================|| MAIN MENU ITEMS ||============================== //

const nurseMenu = [
    {
        id: 'nurse-menu',
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
            }
        ]
    }
];

export default nurseMenu;
