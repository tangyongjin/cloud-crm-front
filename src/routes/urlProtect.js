import AuthService from './login/AuthService';

function win_requireAuth(nextState, replace, callback) {
    // 判断是否登录
    const Auth = new AuthService();
    if (!Auth.loggedIn()) {
        console.log('not login');
        replace('/login'); // 如果没有登录就跳转到登录路由
    }
    return callback();
}

export default win_requireAuth;