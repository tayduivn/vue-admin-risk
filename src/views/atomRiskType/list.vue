<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="风控项名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastModifiedDate }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { findList } from '@/api/table'

export default {
  data() {
    return {
      total: '',
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const url = '/atomRiskType/findList'
      return new Promise((resolve, reject) => {
        findList(url, {}).then(response => {
          this.list = response.data.items
          this.listLoading = false
          this.total = response.data.total
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
</script>
