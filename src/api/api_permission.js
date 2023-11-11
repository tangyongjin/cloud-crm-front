import { root_url, port, version_2 } from './api_config/base_config';
import { post } from './axiosInstance';

const api_root = `${root_url}:${port}/${version_2}`;

export default class permission {
    static apis = {
        getTreeMenuList: (params) => post(`${api_root}/Permission/getTreeMenuList`, params),
        saveMenuPermission: (params) => post(`${api_root}/Permission/saveMenuPermission`, params),
        deleteMenuPermission: (params) => post(`${api_root}/Permission/deleteMenuPermission`, params),
        getUsersByMenuId: (params) => post(`${api_root}/Permission/getUsersByMenuId`, params),
        getMenuTreeByRoleCode: (params) => post(`${api_root}/Permission/getMenuTreeByRoleCode`, params),
        getRolesByMenuId: (params) => post(`${api_root}/Permission/getRolesByMenuId`, params)
    };
}
