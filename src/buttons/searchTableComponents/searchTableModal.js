import React from 'react';
import { Modal } from 'antd';
import SearchFormContainer from './searchFormContainer';
import { SearchOutlined } from '@ant-design/icons';

export default class SearchTableModal extends React.Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
        this.state = {
            visible: false
        };
    }

    init() {
        this.showModal();
    }

    onCancelHandle = () => {
        this.setState({
            visible: false
        });
    };

    showModal() {
        this.setState({
            visible: true
        });
    }

    searchQuery = () => {
        this.refs.searchFormContainerRef.searchHandler();
    };

    getModalProps() {
        return {
            destroyOnClose: true,
            title: (
                <div>
                    <SearchOutlined />
                    数据检索
                </div>
            ),
            bodyStyle: {
                height: 'auto',
                overflow: 'auto',
                bottom: 0
            },
            cancelText: '取消',
            okText: '确定',
            visible: this.state.visible,
            onOk: this.searchQuery,
            onCancel: () => this.onCancelHandle()
        };
    }

    getFieldList = () => {
        return this.props.NanxTableStore.tableColumnConfig.map(({ title, key }) => ({ label: title, value: key }));
    };

    render() {
        let modalProps = this.getModalProps();
        return (
            <Modal width={800} {...modalProps}>
                <SearchFormContainer
                    ref="searchFormContainerRef"
                    hideModal={this.onCancelHandle}
                    fieldsList={this.getFieldList()}
                    onOk={this.searchQuery}
                />
            </Modal>
        );
    }
}
