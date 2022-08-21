/*
*  将4个模块请求统一暴露
* */
import * as tradeMark from "./product/tradeMark";
import * as attr from "./product/attr"
import * as spu from "./product/spu"
import * as sku from "./product/sku"

// 对外暴露
export default {
  tradeMark,
  sku,
  attr,
  spu
}
