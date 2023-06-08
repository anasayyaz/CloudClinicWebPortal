import axios from 'axios';
import { BASE_URL } from 'constants/baseUrl';

export const getToken = async (email, password, domain) => {
    let data2 = {
        userName: email,
        password: password,
        domain: domain,
        grant_type: 'password'
    };

    let formBody = [];
    for (let property in data2) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(data2[property]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    let config = {
        method: 'post',
        url: `${BASE_URL}oauth/token`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: formBody
    };

    const resp = await axios(config);

    return resp?.data?.access_token;
};
