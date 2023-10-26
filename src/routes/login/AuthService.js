import decode from 'jwt-decode';
import { hashHistory } from 'react-router';
import api from '../../api/api';
import navigationStore from '@/store/navigationStore';
import userStore from '@/store/userStore';
import { message } from 'antd';

export default class AuthService {
    constructor(domain) {
        this.loginMobile = this.loginMobile.bind(this);
    }

    async loginMobile(mobile, password, transaction_id) {
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('mobile');
        let params = {
            data: { mobile, password, transaction_id },
            method: 'POST'
        };

        let res = await api.user.loginMobile(params);
        if (res.code == 401) {
            message.error('登陆失败，请检查手机号和密码！', 2.5);
            return;
        }

        if (res.code == 200) {
            this.afterLoginSuccess(res);
        }
    }

    afterLoginSuccess(res) {
        message.loading('登录成功>>,准备工作环境 ', 1.1, () => {
            navigationStore.saveSessionBadge(res.info);
            navigationStore.setBadge(res.info);
            userStore.setUserProfile(res.profile);
            userStore.setToken(res.token);
            hashHistory.push('/home');
        });
    }

    loggedIn() {
        let token = userStore.getToken(); //

        if (token === null) {
            message.info('请重新登录', 2.5);
            return false;
        }

        if (this.isTokenExpired(token)) {
            message.info('登陆过期,请重新登录', 2.5);
            return false;
        }
        return true;
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                // Checking if token is expired. N
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    logout() {
        userStore.clearToken();
        sessionStorage.clear();
        navigationStore.clear();
        hashHistory.push('/login');
    }
}