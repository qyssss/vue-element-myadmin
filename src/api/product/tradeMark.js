/*
*  获取品牌管理数据 GET /admin/product/baseTrademark/{page}/{limit}
* */
import request from "@/utils/request";
export const reqTradeMarkList = (page,limit) => request({
  url: `/goods/admin/product/baseTrademark/${page}/${limit}`,
  method: 'GET',
})
/*
*   新增品牌 POST /admin/product/baseTrademark/save 2个参数 品牌名称、logo
*   修改品牌 PUT /admin/product/baseTrademark/update 3个参数 id、品牌名称、logo      封装一个接口
* */
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
  // 如果有 id 代表修改,否则是新增
  if(tradeMark.id)
  {
    return request({url: `/goods/admin/product/baseTrademark/update`, method: 'PUT',data:tradeMark})
  }
  else
  {
    return request({url: `/goods/admin/product/baseTrademark/save`, method: 'POST',data:tradeMark})
  }
}
/*
*   删除品牌接口 DELETE /admin/product/baseTrademark/remove/{id}
* */
export const reqDeleteTradeMark = (id)=>request({
  url: `/goods/admin/product/baseTrademark/remove/${id}`,
  method: 'DELETE'
})
