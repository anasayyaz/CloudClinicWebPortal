import { useEffect, useState } from 'react';

import Admin from './admin';
import Physician from './physician';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const role = 'Admin';
    const { user } = useSelector((state) => state?.user);

    return user?.roles == 'Admin' ? <Admin /> : <Physician />;
};

export default Dashboard;
