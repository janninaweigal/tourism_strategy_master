<template>
  <div class="seatsContainer">
    <el-form ref="seatsForm" :rules="rules" :model="form">
      <el-table :data="seatsData">
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
              <span v-if="item.type">
                {{ getType(scope.row[item.prop]) }}
              </span>
              <span v-else>
                {{ scope.row[item.prop] }}
              </span>
            </div>
            <div v-else>
              <!-- 类型 -->
              <div v-if="item.type">
                <el-form-item :prop="'Seats.' + scope.$index + '.Type'" :key="'type'+scope.$index" :rules="rules.type">
                  <el-select v-model="scope.row[item.prop]" placeholder="请选择类型">
                    <el-option
                      v-for="(item,key) in seatTypes"
                      :key="key"
                      :label="item"
                      :value="parseInt(key)">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <!-- 价格 -->
              <div v-else-if="item.price">
                <el-form-item :prop="'Seats.' + scope.$index + '.Price'" :key="'price'+scope.$index" :rules="rules.price">
                  <el-input placeholder="请输入价格" v-model.number="scope.row[item.prop]"/>
                </el-form-item>
              </div>
              <!-- 数量 -->
              <div v-else-if="item.quantity">
                <el-form-item :prop="'Seats.' + scope.$index + '.Quantity'" :key="'quantity'+scope.$index" :rules="rules.quantity">
                  <el-input-number v-model="scope.row[item.prop]" :min="1" label="请输入数量"></el-input-number>
                </el-form-item>
              </div>
              <div v-else>
                {{ scope.row[item.prop] }}
              </div>
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
    <div v-if="seatsData.length<20&&!isCheck" class="addSeats" @click="addSeats">
      <i class="el-icon-plus"/>
      添加列车座位
    </div>
    <div class="tableTip">
      {{ tableTip }}
    </div>
  </div>
</template>

<script>
export default {
  // 名称
  name: 'ticketSeats',
  props: {
    tableCols: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
    },
    seatTypes: {
      type: Object,
      default: () => {}
    },
    seatsData: {
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
    return {
      // 错误提示
      tableTip: '',
      rules: {
        type: [
          { type: 'number',required: true, message: '请选择类型', trigger: 'blur' }
        ],
        price: [
          { type: 'number', required: true, message: '请输入价格', trigger: 'blur' }
        ],
        quantity: [
          { type: 'number', required: true, message: '请输入数量', trigger: 'blur' }
        ]
      }
    }
  },
  // 组件方法
  methods: {
    getType(value){
      for(const item of this.seatTypes){
        if(item.value==value){
          return item.lable
        }
      }
      return ''
    },
    // 序号
    indexMethod(index) {
      return index + 1;
    },
    // 删除
    remove(index) {
      this.onDelete(index)
    },
    // 添加一行
    addSeats(e) {
      e.stopPropagation(); // 阻止点击事件冒泡
      this.$emit('addSeats')
    },
    // 验证表格
    validateForm() {
      return new Promise((reslove,reject)=>{
          this.$refs.seatsForm.validate((valid) => {
            if(valid&&this.seatsData.length>=1){
              this.tableTip = ""
              reslove(true)
            } else {
              this.tableTip = "请处理错误并且至少得填写一行";
              reslove(false)
            }
        })
      })
    },
    resetFields(){
      this.$refs.seatsForm.resetFields();
    }
  }
}
</script>
<style lang="less" scoped>
  .seatsContainer{
    .addSeats{
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
  .seatsContainer .el-form .el-form-item {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .seatsContainer .el-date-editor--datetimerange.el-input {
    width: 100% !important;
  }
</style>