import { useRoutes, Route, Redirect } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import PhysicianRoutes from './PhysicianRoutes';
import PatientRoutes from './PatientRoutes';
import NurseRoutes from './NurseRoutes';
import ReceptionistRoutes from './ReceptionistRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserData } from 'store/slices/userSlice';
import { useEffect } from 'react';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const dispatch = useDispatch();

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        !!userData && dispatch(saveUserData(userData));
        console.log('userData ', userData);
    }, []);

    const { user } = useSelector((state) => state.user);

    const role = user?.roles ?? 'Admin';

    let showRoute = {
        Admin: MainRoutes,
        Physician: PhysicianRoutes,
        Patient: PatientRoutes,
        Nurse: NurseRoutes,
        Receptionist: ReceptionistRoutes
    };

    let isLoggedIn = !!user;
    console.log(isLoggedIn);
    let HomeRoute = showRoute[role];
    let RootRoute = isLoggedIn ? HomeRoute : AuthenticationRoutes;

    return useRoutes([RootRoute]);
}
