<template>
  <div class="stationContainer">
    <el-form ref="ticketForm" :rules="rules" :model="form">
      <el-table :data="stationData">
        <!-- 序号 -->
        <el-table-column
          label="序号"
          :index="indexMethod"
          type="index"
          width="70"/>
        <!-- 循环输出列 -->
        <el-table-column
          v-for="(item , key) in tableCols"
          :label="item.label"
          :width="item.width?item.width:'auto'"
          :prop="item.prop"
          :key="key">
          <template slot-scope="scope">
            <div v-if="isCheck">
              <span v-if="item.time">
                {{ scope.row[item.prop1] +' 至 '+ scope.row[item.prop2] }}
              </span>
              <span v-else-if="item.place">
                {{ scope.row[item.prop1] }}
              </span>
            </div>
            <div v-else>
              <!-- 车站名 -->
              <div v-if="item.place">
                <el-form-item :prop="'OverStations.' + scope.$index + '.place'" :key="'place'+scope.$index" :rules="rules.place">
                  <el-input placeholder="请输入车站名" v-model="scope.row[item.prop]"/>
                </el-form-item>
              </div>
              <!-- 到达时间-发车时间 -->
              <div v-else-if="item.time">
                <el-form-item :prop="'OverStations.' + scope.$index + '.timeRange'" :key="'timeRange'+scope.$index" :rules="rules.timeRange">
                  <el-date-picker
                    v-model="scope.row[item.prop]"
                    type="datetimerange"
                    range-separator="至"
                    placeholder="请选择到达/发车时间"
                    start-placeholder="到达时间"
                    end-placeholder="发车时间">
                  </el-date-picker>
                </el-form-item>
              </div>
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </div>
          </template>
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column
          v-if="!isCheck"
          label="操作"
          width="100px">
          <template slot-scope="scope">
            <el-button class="text-danger" type="text" @click="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div v-if="stationData.length<20&&!isCheck" class="addStation" @click="addStation">
      <i class="el-icon-plus"/>
      添加经停站
    </div>
    <div class="tableTip">
      {{ tableTip }}
    </div>
  </div>
</template>

<script>
export default {
  // 名称
  name: 'ticketStation',
  props: {
    tableCols: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
    },
    stationData: {
      type: Array,
      default: () => []
    },
    // 删除回调函数
    onDelete: {
      type: Function,
      default: null
    },
    // 是否是查看页
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const timeRangeRule = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error('请选择到达/发车时间'));
      }
    };
    return {
      // 错误提示
      tableTip: '',
      rules: {
        place: [
          { required: true, message: '请输入车站名', trigger: 'blur' }
        ],
        timeRange: [
          { required: true, validator:timeRangeRule, trigger: 'change' }
        ]
      }
    }
  },
  // 组件方法
  methods: {
    // 序号
    indexMethod(index) {
      return index + 1;
    },
    // 删除
    remove(index) {
      this.onDelete(index)
    },
    // 添加一行
    addStation(e) {
      e.stopPropagation(); // 阻止点击事件冒泡
      this.$emit('addStation')
    },
    // 验证表格
    validateForm() {
      return new Promise((reslove,reject)=>{
          this.$refs.ticketForm.validate((valid) => {
            if(valid){
              this.tableTip = "";
              reslove(true)
            } else {
              this.tableTip = "请填写好经停站信息";
              reslove(false)
            }
        })
      })
    },
    resetFields(){
      this.$refs.ticketForm.resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
  .stationContainer{
    .addStation{
      width:100%;
      cursor: pointer;
      text-align:center;
      color:#1788FF;
      border:1px dashed #ccc;
      height:40px;
      line-height: 40px;
      margin-bottom:20px;
      font-weight:400;
      &:hover {
        border-color: #b9dbff;
        background-color: #e8f3ff;
      }
    }
    .tableTip{
      color: #ed3a3e;
      font-size: 12px;
      margin: 25px 0px;
    }
  }
</style>
<style>
  .stationContainer .el-form .el-form-item {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .stationContainer .el-date-editor--datetimerange.el-input {
    width: 100% !important;
  }
</style>