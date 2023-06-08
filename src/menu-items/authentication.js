// assets
import { IconBrandBandlab, IconPill, IconBuildingHospital, IconBriefcase, IconUser } from '@tabler/icons';

// constant
const icons = { IconPill, IconBrandBandlab, IconBuildingHospital, IconBriefcase, IconUser };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const authentication = {
    id: 'authentication',
    type: 'group',
    children: [
        {
            id: 'login',
            title: 'Login',
            type: 'item',
            url: '/login',
            icon: icons.IconPill,
            breadcrumbs: false
        },
        {
            id: 'register',
            title: 'Register',
            type: 'item',
            url: '/register',
            icon: icons.IconBrandBandlab,
            breadcrumbs: false
        }
    ]
};

export default authentication;
