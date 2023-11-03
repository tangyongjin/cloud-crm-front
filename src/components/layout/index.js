import React from 'react';
import Sidebar from './sidebar/Sidebar';
import Navbar from './navbar//Navbar';
import { Layout } from 'antd';
import { inject, observer } from 'mobx-react';
const { Header, Sider, Content } = Layout;

@inject('NavigationStore')
@observer
export default class PortalLayout extends React.Component {
    constructor(props) {
        super();
        this.store = props.NavigationStore;
        this.store.getMenuTreeByRoleCode();
    }

    // onCollapse={(value) => setCollapsed(value)}
    render() {
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider collapsed={this.store.isCollapse}>
                    <Sidebar
                        collapsed={this.store.isCollapse}
                        className="portal_menu"
                        menuList={this.store.menuList}
                        style={{ padding: 0, height: '100vh', overflowY: 'scroll' }}
                        width={300}
                    />
                </Sider>
                <Layout>
                    <Header>
                        <Navbar />
                    </Header>
                    <Content
                        key={this.store.updateKey}
                        style={{
                            background: '#fff',
                            minHeight: 280,
                            height: '100vh',
                            overflowY: 'scroll'
                        }}
                        className="portal_content">
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
