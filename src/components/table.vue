<template>
  <!--组件容器-->
  <div>
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
            {{ scope.row[item.prop] | dateformat('YYYY-MM-DD hh:mm:ss') }}
          </span>
          <span v-else>
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column :fixed="fixed ? 'right' : false" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <div class="buttonLine" />
          <el-button class="text-danger" type="text" @click="remove(scope.row)">删除</el-button>
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
        :total="total">
      </el-pagination>
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
      // 搜索结果数据
      tableData: [],
      // 是否显示加载信息
      loading: false,
      currentRow: null,
      total: 0
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
            vm.tipsMessage(res.msg, 'success')
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
    edit(index, row) {

    },
    // 查看
    look(index, row) {
      this.onLook(index, row);
    },
    remove(index, row) {
      const vm = this;
      this.$confirm('数据删除后将无法恢复，请问确认删除数据？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        //
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
      return this.searchData.pageSize * (this.searchData.pageNo - 1) + index + 1;
    },
    tipsMessage(txt, type) {
      // 消息提示
      this.$message({
        message: txt,
        type: type,
        showClose: true,
        duration: 3 * 1000
      });
    }
  }
};
</script>
