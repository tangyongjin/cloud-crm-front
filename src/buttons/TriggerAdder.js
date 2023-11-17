import React from 'react';
import { Modal, message, Button } from 'antd';
import { observer, inject } from 'mobx-react';
import TriggerAddCom from './trigger/TriggerAddCom';
import { toJS } from 'mobx';
import { AppstoreAddOutlined } from '@ant-design/icons';

@inject('DataGridStore')
@observer
export default class TriggerAdder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.init = this.init.bind(this);
    }

    async init() {
        let { selectedRows } = this.props.NanxTableStore;
        if (selectedRows.length == 0) {
            message.info('必须选择一项');
            return;
        } else {
            let record = selectedRows[0];
            console.log(record);
            this.props.DataGridStore.setCurrentActcode(toJS(record).datagrid_code);
            this.props.DataGridStore.setCurrentDatagridTitle(toJS(record).datagrid_title);
            this.props.DataGridStore.setCurrentBasetable(toJS(record).base_table);
            this.props.DataGridStore.prepareDataGirdEnv();
            this.setState({ open: true });
        }
    }

    onCancel = () => {
        this.setState({
            open: false
        });
    };

    render() {
        console.log(this.props.DataGridStore);

        let { selectedRows } = this.props.NanxTableStore;
        return selectedRows.length > 0 ? (
            <Modal
                open={this.state.open}
                destroyOnClose={true}
                onCancel={this.onCancel}
                width={'1300px'}
                footer={[
                    <Button key="triggerAdd" type="primary" onClick={this.onCancel}>
                        关闭
                    </Button>
                ]}
                title={
                    <div>
                        <AppstoreAddOutlined />
                        添加联动
                    </div>
                }>
                {this.props.DataGridStore.ColsDbInfo.length == 0 ? null : <TriggerAddCom />}
            </Modal>
        ) : null;
    }
}
