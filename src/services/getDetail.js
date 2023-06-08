import axios from 'axios';
import { BASE_URL } from 'constants/baseUrl';

export const getDetail = async (role, nationalId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios({
        method: 'get',
        url: `${BASE_URL}api/${role}/${nationalId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response;
};
