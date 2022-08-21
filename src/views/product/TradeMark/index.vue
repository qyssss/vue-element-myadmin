<template>
  <div>
    <!--按钮-->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0" @click="showDialog">添加</el-button>
    <el-dialog></el-dialog>
    <!--
    表格组件
    table组件展示的数据以一列展示
    -->
    <el-table style="width:100%" border :data="list">
      <!-- 表格中的列头 type="index"展示序号-->
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center">
      </el-table-column>
      <el-table-column label="品牌logo" width="width" align="center">
        <template slot-scope="{row,$index}">
          <!-- 作用域插槽,未解构时是scope属性接收了子组件传来的值,用scope.row得到当前行(列以确定为第三列)-->
          <img :src="row.logoUrl" style="width:100px; height:100px"/>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{row,$index}">
          <!-- row 代表作用域插槽回传的数据-->
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
    分页器
      pager-count 可设置连续页码数
      @size-change="handleSizeChange" 分页器展示条数变化触发
      @current-change="handleCurrentChange" 当前页变化触发
    -->
    <el-pagination
      style="margin-top:20px;text-align: center"
      :current-page="page"
      :page-sizes="[3,5,10]"
      :page-size="limit"
      :pager-count="7"
      layout="prev, pager, next, jumper,->,sizes,total "
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="tmForm.id? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form style="width:80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <!--
          上传图片
            :on-success="handleAvatarSuccess" 上传成功的回调
            :before-upload="beforeAvatarUpload" 上传之前的回调
          -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/goods/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1, // 当前页码
      limit: 3, // 当前页展示数据条数
      total: 0, // 总共数据条数
      list: [], // 列表数据
      dialogFormVisible: false, // 控制对话框隐藏和显示
      tmForm:{  // 收集品牌信息 这里根据文档写属性
        "logoUrl": '',
        "tmName": '',
      },
    }
  },
  methods: {
    // 获取列表数据的方法
    async getPageList(pager) {
      const {page, limit} = this
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // 会传进当前点击的页码
    handleCurrentChange(pager = 1) {
      // 修改参数
      this.page = pager
      this.getPageList()
    },
    // 会传进当前每页展示数量
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌的按钮 显示对话框
    showDialog(){
      this.dialogFormVisible = true
      this.tmForm = {tmName: '',logoUrl: ''} // 数据置空
    },
    // 修改产品
    updateTradeMark(row){
      // row 是当前用户选中的品牌信息
      // 如果这样写this.tmForm = row, tmForm存储的就是服务器返回的品牌信息,这里会导致tmForm直接操作服务器数据(是深拷贝)
      // 使用浅拷贝 {...row} 或者 Object.assign({},row)
      this.tmForm = {...row}
      this.dialogFormVisible = true
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res 是上传成功后返回给前端的数据 file是一些信息
      this.tmForm.logoUrl = res.data
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 添加按钮的钩子 (添加或者修改品牌)
    async addOrUpdateTradeMark(){
      this.dialogFormVisible = false
      // 发请求
      let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
      if(result.code === 200){
        // 弹出信息 添加成功或者修改成功
        this.$message.success(this.tmForm.id ? "修改品牌成功" : "添加品牌成功")
        // 重新发请求,如果修改就停在当前页,增加就到最后一页
        this.handleCurrentChange(this.tmForm.id ? this.page : parseInt(this.total/this.limit + 1))
      }
    }
  },
  mounted() {
    this.getPageList()
  },

}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
