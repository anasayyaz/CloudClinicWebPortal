import axios from 'axios';
import { addData } from './indexedDB';
const { BASE_URL } = require('constants/baseUrl');

const syncListToLS = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('Called    ', userData);
    try {
        const resMed = await axios({
            method: 'get',
            url: `${BASE_URL}api/medicine`,
            headers: { Authorization: `Bearer ${userData?.token}` }
        });

        const resDia = await axios({
            method: 'get',
            url: `${BASE_URL}api/diagnostic`,
            headers: { Authorization: `Bearer ${userData?.token}` }
        });

        const resLab = await axios({
            method: 'get',
            url: `${BASE_URL}api/LabTestType`,
            headers: { Authorization: `Bearer ${userData?.token}` }
        });

        addData('medicine', resMed?.data);
        addData('diagnosis', resDia?.data);
        addData('labTestType', resLab?.data);
    } catch (error) {
        console.log('Error in File SyncListToLS ', error);
    }
};

export default syncListToLS;
