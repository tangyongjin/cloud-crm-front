import React, { useState } from 'react';
import { Button } from 'antd';
import '@/components/UformExtends';
import { toJS } from 'mobx';
import { SchemaForm, createFormActions } from '@uform/antd';
import 'antd/dist/reset.css';
const actions = createFormActions();

const CommonTableForm = (props) => {
    let formCfg = toJS(props.NanxTableStore.formCfg);
    const [rawData, setRawData] = useState({ editable: props.editable });

    if (!formCfg) {
        return null;
    }

    console.log('💚💚💚', props.NanxTableStore.selectedRows[0]);

    return (
        <div style={{ marginTop: '20px' }}>
            <SchemaForm
                initialValues={rawData.value}
                actions={actions}
                editable={rawData.editable}
                schema={formCfg}
                effects={($, { setFieldState }) => {
                    const hide = (name) => {
                        setFieldState(name, (field) => {
                            field.visible = false;
                        });
                    };

                    $('onFormInit').subscribe(async () => {
                        hide('id');

                        if (props.NanxTableStore.table_action == 'edit') {
                            setRawData({ value: { ...props.NanxTableStore.selectedRows[0] } });
                        } else {
                            setRawData({ value: {} });
                        }

                        for (let key in formCfg.properties) {
                            setFieldState(key, (item) => {
                                item.props['x-props'].nnstore = props.NanxTableStore;
                                item.props['x-props'].datagrid_code = props.NanxTableStore.datagrid_code;
                                item.props['x-props'].actions = actions;
                                item.props['x-props'].props_tag = '💘💘';
                                item.props['x-props'].value = '2023-12-11';
                                item.props['x-props'].defaultValue = '2023-12-11';
                            });
                        }
                    });
                }}
                labelCol={4}
                wrapperCol={15}>
                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        htmlType="button"
                        className="round-button  marginRihgt10"
                        onClick={async () => {
                            await actions.validate();
                            await props.saveFormData(actions.getFormState().values);
                            props.NanxTableStore.hideButtonModal();
                        }}>
                        保存
                    </Button>
                </div>
            </SchemaForm>
        </div>
    );
};

export default CommonTableForm;
