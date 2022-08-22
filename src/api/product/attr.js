/*
*  平台属性管理模块
* */
import request  from "@/utils/request";

/*
*  获取一级分类接口 GET /admin/product/getCategory1
* */
export const reqCategory1List = () => request({
  url: `/goods/admin/product/getCategory1`,
  method: 'GET',
})
/*
*  获取二级分类接口 GET /admin/product/getCategory2/{category1Id}
* */
export const reqCategory2List = (category1Id) => request({
  url: `/goods/admin/product/getCategory2/${category1Id}`,
  method: 'GET',
})
/*
*  获取三级分类接口 GET /admin/product/getCategory3/{category2Id}
* */
export const reqCategory3List = (category2Id) => request({
  url: `/goods/admin/product/getCategory3/${category2Id}`,
  method: 'GET',
})
/*
*  获取平台属性接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
* */
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url: `/goods/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'GET',
})
/*
*  添加属性和属性值接口 POST /admin/product/saveAttrInfo
* */
export const reqAddAttr = (data) => request({
  url: `/goods/admin/product/saveAttrInfo`,
  method: 'POST',
  data,
})
/*   要带的参数
{
  "attrName": "string",   属性名
  "attrValueList": [      属性值数组
    {
      "attrId": 0,        属性值id
      "valueName": "string" 属性名
    }
  ],
  "categoryId": 0,        商品id
  "categoryLevel": 0,     几级的id
}
 */
