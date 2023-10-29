import React from 'react';
import { Tag } from 'antd';

class ColumnsHandle {
    splitDate(text) {
        if (!text) {
            return text;
        }
        let arr = text.split(' ');
        return arr[0];
    }
    renderTag(text) {
        if (text == 'y') {
            return <Tag color="#108ee9">已读</Tag>;
        }
        if (text == 'n') {
            return <Tag color="volcano">未读</Tag>;
        }
    }

    yesOrNoHandle(text) {
        if (!text) {
            return null;
        }
        return text === 'y' ? '是' : '否';
    }
}

export default new ColumnsHandle();
