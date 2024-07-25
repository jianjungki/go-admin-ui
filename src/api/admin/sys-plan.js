import request from '@/utils/request'

// 查询SysPlan列表
export function listSysPlan(query) {
  return request({
    url: '/api/v1/sys-plan',
    method: 'get',
    params: query
  })
}

// 查询SysPlan详细
export function getSysPlan(id) {
  return request({
    url: '/api/v1/sys-plan/' + id,
    method: 'get'
  })
}

// 新增SysPlan
export function addSysPlan(data) {
  return request({
    url: '/api/v1/sys-plan',
    method: 'post',
    data: data
  })
}

// 修改SysPlan
export function updateSysPlan(data) {
  return request({
    url: '/api/v1/sys-plan/' + data.id,
    method: 'put',
    data: data
  })
}

// 删除SysPlan
export function delSysPlan(data) {
  return request({
    url: '/api/v1/sys-plan',
    method: 'delete',
    data: data
  })
}

