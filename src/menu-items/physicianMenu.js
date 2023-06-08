// assets
import { IconDashboard, IconCalendarTime, IconWheelchair, IconFileInvoice } from '@tabler/icons';

// constant
const icons = {
    IconDashboard,
    IconCalendarTime,
    IconWheelchair,
    IconFileInvoice
};

// ==============================|| MAIN MENU ITEMS ||============================== //

const physicianMenu = [
    {
        id: 'physician-menu',
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
                id: 'my-patients',
                title: 'My Patients',
                type: 'item',
                url: '/my-patients',
                icon: icons.IconWheelchair,
                breadcrumbs: false
            },
            {
                id: 'accounts',
                title: 'Accounts',
                type: 'item',
                url: '/accounts',
                icon: icons.IconFileInvoice,
                breadcrumbs: false
            }
        ]
    }
];

export default physicianMenu;
