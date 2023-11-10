import React from 'react';
import { Button, message } from 'antd';
import TableSearchForm from './TableSearchForm';
import { observer, inject } from 'mobx-react';

@inject('NanxTableStore')
@observer
export default class SearchFormContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            field_group: [{ inner_order: 0 }]
        };
    }

    saveActions = (actions, index) => {
        let { field_group } = this.state;
        field_group[index].actions = actions;
        this.setState({
            field_group
        });
    };

    addLine = () => {
        let { field_group } = this.state;
        let field_cfg = { inner_order: field_group.length };
        field_group.push(field_cfg);
        this.setState({ field_group });
    };

    deleteLine = () => {
        if (this.state.field_group.length == 1) {
            return;
        }
        let { field_group } = this.state;
        field_group.pop();
        this.setState({ field_group });
    };

    // 执行带搜索条件的后台查询
    searchHandler = async () => {
        let queryLines = await this.returnQueryLines();
        await this.props.NanxTableStore.setCurrentPage(1);
        await this.props.NanxTableStore.setSearchQueryConfig(queryLines);
        await this.props.NanxTableStore.rowSelectChange([], []);
        await this.props.NanxTableStore.listData();
        this.props.hideModal();
    };

    //  回传搜索条件给上级组件 returnQueryLines
    returnQueryLines = async () => {
        let queryLines = [];
        console.log(this.state.field_group);
        for (let i = 0; i < this.state.field_group.length; i++) {
            let formValue = await this.state.field_group[i].actions.getSearchTableFormData();
            formValue['and_or_' + i] = 'and';
            console.log('formValue: ', formValue);
            let fixedFormValue = {};
            fixedFormValue.and_or = formValue['and_or_' + i];
            fixedFormValue.field = formValue['field_' + i];
            fixedFormValue.operator = formValue['operator_' + i];
            fixedFormValue.vset = formValue['vset_' + i];
            console.log('fixedFormValue: ', fixedFormValue);
            queryLines.push(fixedFormValue);
        }

        if (this.validateRepeatField(queryLines) === false) {
            return [];
        }

        let query_cfg = {
            count: this.state.field_group.length,
            lines: {}
        };
        queryLines.map((item) => {
            query_cfg.lines = { ...query_cfg.lines, ...item };
        });

        console.log('queryLines: ', queryLines);
        return queryLines;
    };

    validateRepeatField = (submitData) => {
        for (let i = 0; i < submitData.length; i++) {
            let field_pre = submitData[i]['field_' + i];
            for (let j = i + 1; j < submitData.length - i; j++) {
                let field_next = submitData[j]['field_' + j];
                if (field_pre === field_next) {
                    message.warning('搜索字段不能重复');
                    return false;
                }
            }
        }

        return true;
    };

    render() {
        return (
            <div style={{ paddingTop: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <Button
                        type="primary"
                        className="round-button"
                        htmlType="button"
                        size="small"
                        onClick={this.addLine}
                        style={{ marginRight: '10px' }}>
                        增加
                    </Button>
                    <Button
                        className="round-button"
                        type="danger"
                        htmlType="button"
                        size="small"
                        onClick={this.deleteLine}>
                        删除
                    </Button>
                </div>
                {this.state.field_group.map((item, index) => {
                    return (
                        <TableSearchForm
                            key={index}
                            fieldsList={this.props.fieldsList}
                            saveActions={this.saveActions}
                            onOk={this.props.onOk}
                            form_index={item.inner_order}></TableSearchForm>
                    );
                })}
            </div>
        );
    }
}
