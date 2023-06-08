import axios from 'axios';
import { BASE_URL } from 'constants/baseUrl';

export const resetPassword = async (userId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const response = await axios({
        method: 'put',
        data: {},
        url: `${BASE_URL}api/accounts/resentPassword/${userId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response;
};
