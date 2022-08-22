<template>
  <div>
    <el-card>
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!--展示平台属性-->
        <el-table
          :data="attrList"
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="200">
          </el-table-column>
          <el-table-column
            prop="address"
            label="属性值列表"
            width="width">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin:0 15px">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            width="200">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--添加属性或者修改属性时的结构-->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
        </el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%;margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template slot-scope="{row,$index}">
              <!--这里是input和span切换-->
              <el-input placeholder="请输入属性值名称" v-model="row.valueName" size="mini"
                        v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)">
              </el-input>
              <span v-else @click="row.flag=true" style="display: block;height: 30px">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入 lodash 中的深拷贝
import cloneDeep from "lodash/cloneDeep"

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [], // 接收平台属性
      isShowTable: true, // 控制表格显示和隐藏
      // 收集新增属性或者修改属性字段
      attrInfo: {
        "attrName": "", // 属性名
        "attrValueList": [  // 属性值数组

        ],
        "categoryId": 0, //  商品id
        "categoryLevel": 0, //  几级的id
      },
    }
  },
  methods: {
    // 子给父用自定义事件传数据
    getCategoryId({categoryId, level}) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level === 3) {
        // 代表有三级分类 id 可以发请求了
        this.category3Id = categoryId
        this.getAttrList()
      }
    },
    // 获取平台属性管理的数据
    async getAttrList() {
      const {category1Id, category2Id, category3Id} = this
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // 向属性值数组添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 修改的时候应该把原来的id带上,添加时就是 undefined
        valueName: '',      // 属性值名称
        flag:true,  // 给每个属性添加一个 flag 用于切换查看和编辑模式
      })
    },
    // 添加属性按钮的钩子
    addAttr() {
      this.isShowTable = false
      // 清除数据
      // 收集三级分类的 id
      this.attrInfo = {
        "attrName": "", // 属性名
        "attrValueList": [  // 属性值数组

        ],
        "categoryId": this.category3Id, //  商品id
        "categoryLevel": 3, //  几级的id
      }
    },
    // 修改某个属性
    updateAttr(row) {
      this.isShowTable = false
      // 把选中的属性赋值给 attrInfo 因为数据结构中有对象中有数组,数组里又有对象,浅拷贝不能解决问题,这里用lodash的深拷贝
      this.attrInfo = cloneDeep(row)
    },
    // 失去焦点的钩子,切换为查看模式展示span
    toLook(row){
      row.flag = false
    }
  }
}
</script>

<style scoped>

</style>
