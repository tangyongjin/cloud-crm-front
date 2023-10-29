import React from 'react';
import api from '@/api/api';
import fetchDataGridCfg from '@/routes/NanxTable/NanxTableCom/fetchDataGridCfg';
import CommonModal from '@/routes/NanxTable/NanxTableCom/commonModal';
import listDataParams from '@/routes/NanxTable/NanxTableCom/listDataParams';
import { toJS } from 'mobx';

export default class ExportExcel extends React.Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }

    state = {
        excelMsg: {}
    };

    async getExportExcelPara() {
        await fetchDataGridCfg(this.props.NanxTableStore);
        let paradata = listDataParams(this.props.NanxTableStore);
        let params = {
            data: paradata,
            method: 'POST'
        };

        params.geturl = toJS(this.props.NanxTableStore.curd).geturl;
        return params;
    }

    async init() {
        let _para = await this.getExportExcelPara();
        let res = await api.curd.exportExcel(_para);
        if (res.code == 200) {
            this.setState({
                excelMsg: res.data
            });
            this.refs.commonModalRef.showModal();
        }
    }

    hideModal() {
        this.refs.commonModalRef.onCancelHandle();
    }

    render() {
        return (
            <CommonModal
                height="500px"
                cancel={this.hideModal}
                title="导出excel(点击下载)"
                ref="commonModalRef"
                layoutcfg={this.props.NanxTableStore.layoutcfg}>
                <a href={this.state.excelMsg.url}>{this.state.excelMsg.name}</a>
            </CommonModal>
        );
    }
}
