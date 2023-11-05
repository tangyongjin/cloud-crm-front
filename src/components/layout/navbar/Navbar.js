import { Dropdown, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { PicLeftOutlined } from '@ant-design/icons';
import React from 'react';
import { hashHistory } from 'react-router';
import LoginService from '@/routes/login/LoginService';
import LoadingGif from './loading.gif';

import { port, root_url } from '@/api/api_config/base_config';

const avatarRoot = `${root_url}:${port}/`;

const { confirm } = Modal;

@inject('NavigationStore')
@observer
export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.NavigationStore = props.NavigationStore;
        this.LoginService = new LoginService();
    }

    logout = () => {
        this.NavigationStore.setBossTitle(null);
        this.LoginService.logout();
    };

    showConfirm() {
        confirm({
            content: <h4>您确定要退出系统么？</h4>,
            onOk: () => this.logout(),
            cancelText: '取消',
            icon: (
                <div>
                    <a-icon type="exclamation-circle" />
                </div>
            ),
            okText: '确定',
            okButtonProps: { style: { backgroundColor: '#343c41', color: '#fff', borderColor: '#343c41' } },
            cancelButtonProps: { style: { color: '#174a02', borderColor: '#343c41' } }
        });
    }

    render() {
        const onClick = ({ key }) => {
            if (key == 1) {
                hashHistory.push('/profile');
            }
            if (key == 2) {
                this.showConfirm();
            }
        };

        const items = [
            {
                label: '个人中心',
                key: '1'
            },
            {
                type: 'divider'
            },
            {
                label: '退出登录',
                key: '2'
            }
        ];

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                    style={{
                        flex: 1,
                        width: '33.33%',
                        textAlign: 'left'
                    }}>
                    <PicLeftOutlined
                        onClick={this.NavigationStore.toggleCollapse}
                        style={{ paddingLeft: '15px', fontSize: '16px', color: '#225e04' }}
                    />
                </div>
                <div
                    id="preloader"
                    style={{
                        flex: 1,
                        width: '33.33%',
                        display: 'none',
                        textAlign: 'center'
                    }}>
                    <img src={LoadingGif} alt="loading" />
                </div>
                <div
                    style={{
                        flex: 1,
                        width: '33.33%',
                        textAlign: 'right',
                        display: 'flex',
                        paddingRight: '15px',
                        justifyContent: 'flex-end'
                    }}>
                    <div style={{ width: '190px', cursor: 'pointer' }}>
                        <Dropdown
                            trigger={['click']}
                            menu={{
                                items,
                                onClick
                            }}>
                            <div>
                                <span style={{ paddingRight: '5px', color: '#97a8be', fontSize: '14px' }}>
                                    {sessionStorage.getItem('staff_name') + ' / ' + sessionStorage.getItem('role_name')}
                                </span>
                                <img
                                    alt="head"
                                    style={{
                                        width: '36px',
                                        borderRadius: '5px',
                                        height: '36px',
                                        verticalAlign: 'middle'
                                    }}
                                    src={avatarRoot + JSON.parse(sessionStorage.getItem('userInfo')).head_portrait}
                                    className="user-avatar"
                                />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }
}
