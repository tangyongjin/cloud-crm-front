import React from 'react';
import { Select } from 'antd';
import { observer, inject } from 'mobx-react';

const { Option } = Select;
@inject('DataGridStore')
@observer
class PluginCfg extends React.Component {
    constructor(props) {
        super(props);
        console.log('props: ', props);

        this.state = {
            opts: [
                {
                    validateItemId: 'chineseMobile',
                    validateItemName: '中国手机号',
                    memo: 'ff'
                },
                {
                    validateItemId: 'chinaID',
                    validateItemName: '中国身份证',
                    memo: 'ff'
                }
            ]
        };
    }

    render() {
        return (
            <div className="fromBox">
                <div className="formItem">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path
                            fillRule="evenodd"
                            d="M14.5 10a4.5 4.5 0 004.284-5.882c-.105-.324-.51-.391-.752-.15L15.34 6.66a.454.454 0 01-.493.11 3.01 3.01 0 01-1.618-1.616.455.455 0 01.11-.494l2.694-2.692c.24-.241.174-.647-.15-.752a4.5 4.5 0 00-5.873 4.575c.055.873-.128 1.808-.8 2.368l-7.23 6.024a2.724 2.724 0 103.837 3.837l6.024-7.23c.56-.672 1.495-.855 2.368-.8.096.007.193.01.291.01zM5 16a1 1 0 11-2 0 1 1 0 012 0z"
                            clipRule="evenodd"
                        />
                        <path d="M14.5 11.5c.173 0 .345-.007.514-.022l3.754 3.754a2.5 2.5 0 01-3.536 3.536l-4.41-4.41 2.172-2.607c.052-.063.147-.138.342-.196.202-.06.469-.087.777-.067.128.008.257.012.387.012zM6 4.586l2.33 2.33a.452.452 0 01-.08.09L6.8 8.214 4.586 6H3.309a.5.5 0 01-.447-.276l-1.7-3.402a.5.5 0 01.093-.577l.49-.49a.5.5 0 01.577-.094l3.402 1.7A.5.5 0 016 3.31v1.277z" />
                    </svg>
                    校验规则
                </div>
                <div className="formItem">
                    <Select
                        value={this.props.col.validateRule}
                        onChange={(e) => {
                            this.props.DataGridStore.changeCfg_dropdown(e, 'validateRule', this.props.col.Field);
                        }}
                        showSearch
                        allowClear
                        disabled={this.props.col.Field == 'id'}
                        placeholder="校验规则"
                        name="validateRule">
                        {this.state.opts.map((item, index) => (
                            <Option key={index} value={item.validateItemId}>
                                <div style={{ display: 'flex', justifyContent: 'flexStart' }}>
                                    <span style={{ width: '150px' }}>{item.validateItemId}</span>
                                    <span style={{ marginLeft: '30px' }}>
                                        (<span>{item.validateItemName}</span>
                                        <span style={{ width: '10px' }}>/</span>
                                        <span>{item.memo}]</span>)
                                    </span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
        );
    }
}
export default PluginCfg;
