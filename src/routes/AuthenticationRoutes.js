import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import Login from 'views/authentication/login';
import Register from 'views/authentication/register';

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MinimalLayout />,
    children: [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/',
            element: <Navigate to="/login" replace={true} />
        }
        // {
        //     path: '/register',
        //     element: <Register />
        // },
        // {
        //     path: '*',
        //     element: <Navigate to="/login" replace={true} />
        // }
    ]
};

export default AuthenticationRoutes;
