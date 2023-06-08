// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from 'store/slices/userSlice';
import { useEffect } from 'react';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        !!userData && dispatch(saveUserData(userData));
    }, []);

    const { user } = useSelector((state) => state.user);
    let role = user?.roles;

    function getMenuItems(role) {
        const menu = menuItem;

        const roleItems = {
            Physician: ['physician-menu'],
            Patient: ['patient-menu'],
            Nurse: ['nurse-menu'],
            Admin: ['dashboard', 'appointment-menu', 'staff-and-users', 'health-care', 'setting-menu'],
            Receptionist: ['receptionist-menu', 're-appointment-menu', 're-staff-and-users']
        };

        return menu.items.filter((item) => roleItems[role]?.includes(item.id));
    }
    const menuItems = getMenuItems(role);

    const navItems = menuItems.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
