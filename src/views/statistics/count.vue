<template>
  <div class="app-container">
    <div>
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
      <el-table-column label="原子风控服务" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功次数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.success }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败次数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.failed }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调用次数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功率" align="center">
        <template slot-scope="scope">
          <span>
            <el-progress :text-inside="true" :stroke-width="25" :percentage="scope.row.successRate" :status="scope.row.successRate | statusFilter" />
          </span>
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
    statusFilter(successRate) {
      if (successRate) {
        if (successRate >= 80) {
          return 'success'
        } if (successRate >= 60 && successRate < 80) {
          return 'warning'
        } else {
          return 'exception'
        }
      } else {
        return 'exception'
      }
    }
  },
  data() {
    return {
      startAndEndDate: [],
      currentPage: 1,
      pageSize: 10,
      atomRiskProductList: [],
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
      }
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
      const url = '/statistics/atomRiskProductStatistics'
      return new Promise((resolve, reject) => {
        if (this.startAndEndDate == null) {
          this.startAndEndDate = []
        }
        findPage(url, {}, { currentPage: this.currentPage - 1, pageSize: this.pageSize, beginCreateTime: this.startAndEndDate[0], endCreateTime: this.startAndEndDate[1] }).then(response => {
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
        successful: '',
        atomRiskProductId: ''
      }
      this.fetchData()
    }
  }
}
</script>
<style>
  .el-progress.is-warning .el-progress-bar__inner {
    background-color: #e6a23c;
  }
</style>
