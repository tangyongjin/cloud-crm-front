import React from 'react';
import { Select } from 'antd';
import api from '@/api/api';
import { observer, inject } from 'mobx-react';

@inject('NanxTableStore', 'TriggerStore') //
@observer
export default class AssocSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            optionList: [],
            loading: false,
            selectedValue: null // 下拉框选中的值
        };

        this.onSelect = this.onSelect.bind(this);
    }

    componentWillUnmount() {
        this.props.TriggerStore.clearTrigger();
    }

    async componentDidMount() {
        //把自己(AssosSelect注册到 triggers )

        this.props.TriggerStore.registerTrigger(this);
        let groups = this.props.TriggerStore.getDropdownGroups(this.props.schema);
        console.log('>>>>>>groups: ', groups);

        if (this.props.query_cfg.level == 1) {
            await this.getOptionList(this.props.query_cfg, null, this);
        }

        if (this.props.query_cfg.level == groups[this.props.query_cfg.trigger_group_uuid]) {
            //模拟用户点击下拉选择
            if (this.props.NanxTableStore.table_action === 'edit') {
                await this.simulateClick();
            }
        }
    }

    async simulateClick() {
        if (this.props.NanxTableStore.table_action === 'edit') {
            for (let i = 0; i < this.props.TriggerStore.triggers.length; i++) {
                let element = this.props.TriggerStore.triggers[i];
                // 2、同一组

                if (element.props.query_cfg.trigger_group_uuid == this.props.query_cfg.trigger_group_uuid) {
                    let _tmp1_rows = element.props.nnstore.selectedRows;
                    let curren_value = _tmp1_rows[0]['ghost_' + element.props.ass_select_field_id];
                    await element.getDefaultOptionList(element);
                    element.props.onChange(curren_value);
                    element.setState({ selectedValue: curren_value });
                }
            }
            return;
        }
    }

    async getDefaultOptionList(current_ele) {
        let prev_sel_value = null;
        if (current_ele.props.query_cfg.level == 1) {
            prev_sel_value = null;
        }
        if (current_ele.props.query_cfg.level > 1) {
            prev_sel_value = current_ele.getPrevSelValue(current_ele);
        }
        await current_ele.getOptionList(current_ele.props.query_cfg, prev_sel_value, current_ele);
    }

    // 获取上一个联动值
    getPrevSelValue(current_ele) {
        for (let i = 0; i < this.props.TriggerStore.triggers.length; i++) {
            let element = this.props.TriggerStore.triggers[i];

            // 不同组结束本次循环
            if (element.props.query_cfg.trigger_group_uuid != current_ele.props.query_cfg.trigger_group_uuid) {
                continue;
            }
            // 不是上一个联动的结束本次循环
            if (current_ele.props.query_cfg.level - element.props.query_cfg.level != 1) {
                continue;
            }

            let prev_value = element.props.nnstore.selectedRows[0]['ghost_' + element.props.ass_select_field_id];

            if (prev_value) {
                return prev_value;
            }
            return element.props.default;
        }
    }

    async onSelect(value, isClear) {
        console.log('select', value);
        // 1、设置当前字段的value
        this.props.onChange(value);

        this.setState({
            selectedValue: value
        });

        // 关联字段设置
        for (let i = 0; i < this.props.TriggerStore.triggers.length; i++) {
            let element = this.props.TriggerStore.triggers[i];

            // 2、同一组
            if (element.props.query_cfg.trigger_group_uuid == this.props.query_cfg.trigger_group_uuid) {
                if (element.props.query_cfg.level - this.props.query_cfg.level == 1) {
                    await element.getOptionList(element.props.query_cfg, value, element);
                    if (isClear === 'y') {
                        element.setState({
                            selectedValue: null
                        });
                        element.props.value && element.props.onChange('');
                    }
                }
                // 4、清空level - 当前level >= 2 的字段的value和optionList
                if (element.props.query_cfg.level - this.props.query_cfg.level >= 2) {
                    if (isClear === 'y') {
                        element.setState({
                            optionList: [],
                            selectedValue: null
                        });
                        element.props.value && element.props.onChange('');
                    }
                }
            }
        }
    }

    getOptionList = async (query_cfg, value, element) => {
        this.setState({
            loading: true
        });
        let params = {
            data: { ...query_cfg, value_field: value },
            method: 'POST'
        };

        let res = await api.dataGrid.getAssociateData(params);
        if (res.code == 200) {
            let optionList = this.props.TriggerStore.formatOptionList(
                res.data,
                query_cfg.label_field,
                query_cfg.value_field
            );
            element.setState({ optionList: optionList, loading: false });
        }
    };

    render() {
        return (
            <Select
                loading={this.state.loading}
                showSearch
                disabled={this.props.disabled}
                value={this.props.value}
                optionFilterProp="children"
                onSelect={(event) => this.onSelect(event, 'y')}>
                {this.state.optionList.map((option) => {
                    return (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    );
                })}
            </Select>
        );
    }
}
