import request from '@/utils/request'

// 查询SysOrder列表
export function listSysOrder(query) {
    return request({
        url: '/api/v1/sys-order',
        method: 'get',
        params: query
    })
}

// 查询SysOrder详细
export function getSysOrder (id) {
    return request({
        url: '/api/v1/sys-order/' + id,
        method: 'get'
    })
}


// 新增SysOrder
export function addSysOrder(data) {
    return request({
        url: '/api/v1/sys-order',
        method: 'post',
        data: data
    })
}

// 修改SysOrder
export function updateSysOrder(data) {
    return request({
        url: '/api/v1/sys-order/'+data.id,
        method: 'put',
        data: data
    })
}

// 删除SysOrder
export function delSysOrder(data) {
    return request({
        url: '/api/v1/sys-order',
        method: 'delete',
        data: data
    })
}

