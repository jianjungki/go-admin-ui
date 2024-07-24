import request from '@/utils/request'

// 查询SysUserPlan列表
export function listSysUserPlan(query) {
  return request({
    url: '/api/v1/sys-user-plan',
    method: 'get',
    params: query
  })
}

// 查询SysUserPlan详细
export function getSysUserPlan(roleId) {
  return request({
    url: '/api/v1/sys-user-plan/' + roleId,
    method: 'get'
  })
}

// 新增SysUserPlan
export function addSysUserPlan(data) {
  return request({
    url: '/api/v1/sys-user-plan',
    method: 'post',
    data: data
  })
}

// 修改SysUserPlan
export function updateSysUserPlan(roleId, data) {
  return request({
    url: '/api/v1/sys-user-plan/' + roleId,
    method: 'put',
    data: data
  })
}

// 删除SysUserPlan
export function delSysUserPlan(data) {
  return request({
    url: '/api/v1/sys-user-plan',
    method: 'delete',
    data: data
  })
}

