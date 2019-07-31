<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="信任源风控服务url">
              <span>{{ props.row.url }}</span>
            </el-form-item>
            <el-form-item label="接口账号">
              <span>{{ props.row.appId }}</span>
            </el-form-item>
            <el-form-item label="最后更新时间">
              <i class="el-icon-time" />
              <span>{{ props.row.lastModifiedDate }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="信任源风控服务名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务单价（元）">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属信任源" align="center">
        <template slot-scope="scope">
          {{ scope.row.sourceRiskConfigId | sourceRiskConfigFilter }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="success" size="small" @click="$router.push({ name: 'sourceRiskProductDetail', params: { id: scope.row.id }})">查看</el-button> -->
          <el-button type="primary" size="small" @click="$router.push({ name: 'sourceRiskProductUpdate', params: { id: scope.row.id }})">编辑</el-button>
          <el-button type="danger" size="small" @click.native.prevent="deleteData(scope.$index, list, scope.row)">删除</el-button>
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
import { findPage, deleteById, findList } from '@/api/table'
import { MessageBox } from 'element-ui'

let vm = {}
export default {
  filters: {
    sourceRiskConfigFilter(id) {
      for (const sourceRiskConfig of vm.sourceRiskConfigList) {
        if (sourceRiskConfig.id === id) {
          return sourceRiskConfig.name
        }
      }
    }
  },
  data() {
    vm = this
    return {
      sourceRiskConfigList: [],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
    return new Promise((resolve, reject) => {
      const sourceRiskConfigListUrl = 'sourceRiskConfig/findList'
      findList(sourceRiskConfigListUrl, {}).then(response => {
        this.sourceRiskConfigList = response.data.items
        resolve()
      }).catch(error => {
        this.loading = false
        reject(error)
      })
    })
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
      const url = '/sourceRiskProduct/findPage'
      return new Promise((resolve, reject) => {
        findPage(url, {}, { currentPage: this.currentPage - 1, pageSize: this.pageSize }).then(response => {
          this.list = response.data.items
          this.listLoading = false
          this.total = response.data.total
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    deleteData(index, list, row) {
      MessageBox.confirm('您将删除一条记录', '请确认：', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = 'sourceRiskProduct/deleteById/' + row.id
        return new Promise((resolve, reject) => {
          deleteById(url).then(response => {
            list.splice(index, 1)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
        // location.reload()
      })
    }
  }
}
</script>
