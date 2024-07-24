import request from '@/utils/request'

// 查询SysRolePermission列表
export function listSysRolePermission(query) {
    return request({
        url: '/api/v1/sys-role-permission',
        method: 'get',
        params: query
    })
}

// 查询SysRolePermission详细
export function getSysRolePermission (id) {
    return request({
        url: '/api/v1/sys-role-permission/' + id,
        method: 'get'
    })
}


// 新增SysRolePermission
export function addSysRolePermission(data) {
    return request({
        url: '/api/v1/sys-role-permission',
        method: 'post',
        data: data
    })
}

// 修改SysRolePermission
export function updateSysRolePermission(data) {
    return request({
        url: '/api/v1/sys-role-permission/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysRolePermission
export function delSysRolePermission(data) {
    return request({
        url: '/api/v1/sys-role-permission',
        method: 'delete',
        data: data
    })
}

