<template>
  <div class="app-container">
    <div>
      <el-input v-model="entity.id" placeholder="记录编号" style="width:15%" />
      <el-select v-model="entity.successful" clearable placeholder="请选择调用结果">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="startAndEndDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        :default-time="['00:00:00', '23:59:59']"
        value-format="yyyy-MM-dd HH:mm:ss"
        class="el-date-picker-search"
      />
      <el-button type="primary" plain @click="fetchData">&nbsp;搜索记录&nbsp;</el-button>
      <span />
      <el-button type="primary" plain @click="clearUp">&nbsp;清空条件&nbsp;</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      fit
      highlight-current-row
    >
      <el-table-column label="记录编号" align="center">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="调用结果" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.successful | successfulFilter">{{ scope.row.successful=="0"?"成功":"失败" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="调用时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="$router.push({ name: 'apiAccessRecordDetail', params: { id: scope.row.id }})">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { findPage } from '@/api/table'

export default {
  filters: {
    successfulFilter(successful) {
      const successfulMap = {
        '0': 'success',
        '1': 'danger'
      }
      return successfulMap[successful]
    }
  },
  data() {
    return {
      startAndEndDate: [],
      entity: {
        id: '',
        successful: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: null,
      listLoading: true,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date(new Date().toLocaleDateString())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      options: [{
        value: '0',
        label: '成功'
      }, {
        value: '1',
        label: '失败'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
      console.log(`当前页: ${val}`)
    },
    fetchData() {
      this.listLoading = true
      const url = '/apiAccessRecord/findPage'
      return new Promise((resolve, reject) => {
        if (this.startAndEndDate == null) {
          this.startAndEndDate = []
        }
        findPage(url, this.entity, { currentPage: this.currentPage - 1, pageSize: this.pageSize, beginCreateTime: this.startAndEndDate[0], endCreateTime: this.startAndEndDate[1] }).then(response => {
          this.list = response.data.items
          this.listLoading = false
          this.total = response.data.total
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    clearUp() {
      this.startAndEndDate = []
      this.entity = {
        id: '',
        successful: ''
      }
      this.fetchData()
    }
  }
}
</script>
