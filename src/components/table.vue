<template>
  <!--组件容器-->
  <div class="tableContainer margin-top-20">
    <!-- 表格 -->
    <el-table v-loading="loading" :data="tableData" element-loading-text="加载中" highlight-current-row>
      <!-- 序号 -->
      <el-table-column label="序号" :index="indexMethod" type="index" width="80" />
      <!-- 循环输出列 -->
      <el-table-column v-for="(item , key) in tableCols" :fixed="item.fixed" :label="item.label" :prop="item.prop" :key="key" :width="item.width === undefined ? 'auto' : item.width">
        <template slot-scope="scope">
          <span v-if="item.formDate">
            {{ scope.row[item.prop] | dateformat('YYYY-MM-DD') }}
          </span>
          <span v-else-if="item.formMinutes">
            {{ scope.row[item.prop] | dateformat('YYYY-MM-DD HH:mm:ss') }}
          </span>
          <span v-else-if="item.isAvatar">
            <img :src="imgUrl + scope.row[item.prop]" width="40px" height="40px"/>
          </span>
          <span v-else-if="item.pictures">
            <img v-for="item in JSON.parse(scope.row[item.prop]).pictures" style="cursor:pointer;margin-right:5px;margin-bottom:5px;" :src="imgUrl+item.url" @click="preview(imgUrl+item.url)" width="40px" height="40px"/>
          </span>
          <span v-else-if="item.goodType">
            {{scope.row[item.prop]===1?'自营':'非自营'}}
          </span>
          <span v-else-if="item.bedType">
            {{scope.row[item.prop]===1?'单人床':'双人床'}}
          </span>
          <span v-else-if="item.isSwitch" :style="{'color':scope.row[item.prop]===1?'#00ff89':'red'}">
            {{scope.row[item.prop]===1?'是':'否'}}
          </span>
          <span v-else-if="item.goodStatus">
            {{handleGoodsStatus(scope.row[item.prop])}}
          </span>
          <span v-else-if="item.isTrainCode">
            {{trainTypes[scope.row[item.prop1]]+"-"+scope.row[item.prop2]}}
          </span>
          <span v-else-if="item.isAdmin">
            <el-tooltip :content="scope.row[item.prop]==1?'管理员':'普通用户'" placement="top">
              <el-switch
                :value="scope.row[item.prop]== 1"
                disabled>
              </el-switch>
            </el-tooltip>
          </span>
          <div v-else v-html="scope.row[item.prop]"></div>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column :fixed="fixed ? 'right' : false" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <div class="buttonLine" />
          <el-button class="text-danger" type="text" @click="remove(scope.row)">删除</el-button>
          <div v-show="isCheck">
            <div class="buttonLine" />
            <el-button type="info" @click="checkInfo(scope.row)">查看详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div style="text-align: right;margin-top: 10px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchData.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, prev, pager, next"
        prev-text="上一页"
        next-text="下一页"
        :total="total">
      </el-pagination>
      <div v-show="isCheckImg">
        <el-dialog :visible.sync="dialogVisible">
          <img :src="dialogImageUrl" width="100%" alt="">
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
const api = require('@/api/getData')
export default {
  // 名称
  name: 'CustomTable',
  props: {
    // 是否需要固定列
    fixed: {
      type: Boolean,
      default: false
    },
    trainTypes: {
      type: Object,
      default: () => {}
    },
    isCheck:{
      type: Boolean,
      default: false
    },
    isCheckImg:{
      type: Boolean,
      default: false
    },
    // 搜索条件
    searchData: {
      type: Object,
      default: () => {
        return {
          pageNo: 1,
          pageSize: 10
        }
      }
    },
    tableCols: {
      type: Array,
      default: () => []
    },
    // 搜索方法
    searchMethod: {
      type: String,
      default: ''
    },
    // 删除方法
    deleteMethod: {
      type: String,
      default: ''
    },
    // 搜索后回调函数
    onSearch: {
      type: Function,
      default: null
    },
    // 删除回调函数
    onDelete: {
      type: Function,
      default: null
    },
    // 查看回调函数
    onLook: {
      type: Function,
      default: null
    },
    // 编辑回调函数
    onEdit: {
      type: Function,
      default: null
    },
    // 分页回调函数
    changePage: {
      type: Function,
      default: null
    },
    // 点击单行回调函数
    onClick: {
      type: Function,
      default: null
    }
  },
  // 引入组件
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible:false,
      // 搜索结果数据
      tableData: [],
      // 是否显示加载信息
      loading: false,
      currentRow: null,
      total: 0,
      imgUrl: process.env.imgUrl
    };
  },
  created(){
    this.search()
  },
  // 组件方法
  methods: {
    /**
     * 搜索
     */
    search() {
      const vm = this;
      const method = vm.searchMethod
      if (method) {
        vm.loading = true;
        api[method](vm.searchData).then(res=>{
          vm.loading = false;
          if(res.code == 1){
            vm.tableData = res.data.list
            vm.total = res.data.total
            // vm.tipsMessage(res.msg, 'success')
          } else {
            vm.tipsMessage(res.msg, 'error')
          }
        }).catch(()=>{
          vm.loading = false;
          vm.tipsMessage('获取数据失败', 'error')
        })
      }
    },
    /**
     * 编辑
     */
    edit(row) {
      this.onEdit(row)
    },
    // 查看
    look(index, row) {
      this.onLook(index, row);
    },
    remove(row) {
      const vm = this;
      vm.$confirm('数据删除后将无法恢复，请问确认删除数据？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        if(vm.deleteMethod){
          vm.loading = true;
          api[vm.deleteMethod]({id:row.Id}).then(res=>{
            vm.loading = false;
            if(res.code == 1){
              vm.tipsMessage(res.msg, 'success')
              vm.search();
            } else {
              vm.tipsMessage(res.msg, 'error')
            }
          }).catch(()=>{
            vm.loading = false;
            vm.tipsMessage('删除失败', 'error')
          })
        }
      }).catch(() => { });
    },
    /**
     * 改变每页显示条数
     */
    handleSizeChange(val) {
      this.searchData.pageSize = val;
      this.searchData.pageNo = 1;
      if (this.changePage) {
        this.changePage(val);
      }
      this.search();
    },
    /**
     * 改变当前页数
     */
    handleCurrentChange(val) {
      this.searchData.pageNo = val;
      if (this.changePage) {
        this.changePage(val);
      }
      this.search();
    },
    /**
     * 自定义序号
     */
    indexMethod(index) {
      return (index + 1) + (this.searchData.pageNo - 1) * this.searchData.pageSize;
    },
    tipsMessage(txt, type) {
      // 消息提示
      this.$message({
        message: txt,
        type: type,
        showClose: true,
        duration: 3 * 1000
      });
    },
    preview(url){
      this.dialogImageUrl = url;
      this.dialogVisible = true
    },
    checkInfo(row){
      this.onLook(row)
    },
    handleGoodsStatus(status){
      let result = '默认'
      switch(status){
        case 1:
          result = '上架';
          break;
        case 2:
          result = '销售';
          break;
        case 3:
          result = '下架';
          break;
      }
      return result
    }
  }
};
</script>

<style>
  .tableContainer .el-switch.is-checked .el-switch__core {
    border-color: #20a0ff !important;
    background-color: #20a0ff !important;
  }
</style>
