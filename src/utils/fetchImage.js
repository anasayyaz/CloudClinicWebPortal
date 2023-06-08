import { BASE_URL } from 'constants/baseUrl';
import { useSelector } from 'react-redux';

export const profileImage = (profileImage) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return `${BASE_URL}media/${userData?.domain}/Profile/${profileImage}`;
};

export const domainLogo = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    return `${BASE_URL}images/${userData?.domainLogo}`;
};
