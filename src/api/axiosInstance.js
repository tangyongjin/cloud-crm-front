import axios from 'axios';
import moment from 'moment';
import { hashHistory } from 'react-router';
import AuthStore from '@/store/AuthStore';

const { v4: uuidv4 } = require('uuid');

const API_URL = 'http://127.0.0.1:8502/v2';

const axiosInstance = axios.create({
    method: 'post',
    baseURL: API_URL,
    headers: {
        'Content-Type': 'text/plain'
    },
    validateStatus: function (status) {
        return status >= 200 && status < 300;
    }
});

let source = axios.CancelToken.source();

function nowString() {
    const now = moment();
    const timeString = now.format('HH:mm:ss');
    console.log(timeString);
    return timeString;
}

axiosInstance.interceptors.request.use(
    function (config) {
        const requestId = uuidv4();
        console.log('Request ID:', requestId);
        config.requestId = requestId + config.url;
        console.log('Axios拦截>>🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩🧩>>>>>>' + config.url);
        AuthStore.setLoading(true);
        AuthStore.setValue(1997);
        AuthStore.setTimeStamp(nowString());
        AuthStore.addRunnitem(config.requestId);
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        AuthStore.delRunnitem(error.config.requestId);
        console.log(error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        // 打印响应日志
        console.log('Response ID:', response.config.requestId);
        AuthStore.setLoading(false);
        AuthStore.delRunnitem(response.config.requestId);
        console.log('响应数据:', response);
        return response;
    },
    (error) => {
        console.log('Error:', error);

        AuthStore.delRunnitem(error.config.requestId);
        AuthStore.setLoading(false);

        if (error.response.status === 401) {
            console.log('Session过期等各种情况,route to /login');
            source.cancel('Landing Component got unmounted');
            hashHistory.push('/login');
        }

        return Promise.reject(error);
    }
);

// this is good
export async function post(url, params, config) {
    console.log('url: ', url);
    console.log('config: ', config);
    console.log('params: ', params);
    if (!params) {
        params = { data: {} };
    }

    try {
        axiosInstance.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        const response = await axiosInstance.post(url, params.data, { ...config });
        console.log(response);

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        return error.response.data;
    }
}

export async function get(url, para, config = {}) {
    return axiosInstance.get(url, { ...para }, { ...config }).then((response) => {
        console.log(response); // Add this line to log the response
        return response.data;
    });
}