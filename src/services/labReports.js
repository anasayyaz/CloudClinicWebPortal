import axios from 'axios';
import { BASE_URL } from 'constants/baseUrl';
const user = JSON.parse(localStorage.getItem('user'));

export const getReportByVisit = async (visitId) => {
    const response = await axios({
        method: 'get',
        url: `${BASE_URL}api/LabTest/visitsLabtests/${visitId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`
        }
    });

    if (response?.data) {
        const mergedData = response?.data.reduce((acc, item) => {
            const existingItem = acc.find((obj) => obj.type === item.type);

            if (existingItem) {
                existingItem.list.push(item);
            } else {
                acc.push({
                    type: item.type,
                    list: [item]
                });
            }

            return acc;
        }, []);

        return mergedData;
    }

    return response;
};

export const postReportByVisit = async (visit) => {
    const response = await axios({
        method: 'post',
        url: `${BASE_URL}api/${role}/${nationalId}`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`
        }
    });

    return response;
};
