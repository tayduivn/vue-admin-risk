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
      <el-table-column label="原子风控服务名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属风控项" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.atomRiskTypeId | atomRiskTypeFilter }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status?"启用":"禁用" }}</el-tag> -->
          {{ scope.row.status == "0"?"启用":"已禁用" }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="$router.push({ name: 'atomRiskProductDetail', params: { id: scope.row.id }})">查看</el-button>
          <!-- <el-button v-show="!scope.row.edit" type="primary" size="small" @click="$set(scope.row,'edit',true)">编辑</el-button> -->
          <!-- <el-button v-show="scope.row.edit" type="success" size="small" @click="updateData(scope.row)">保存</el-button> -->
          <el-button type="primary" size="small" @click="$router.push({ name: 'atomRiskProductUpdate', params: { id: scope.row.id }})">编辑</el-button>
          <el-button v-show="scope.row.status != 0" type="success" size="small" @click="enableData(scope.row)">启用</el-button>
          <el-button v-show="scope.row.status == 0" type="warning" size="small" @click="disableData(scope.row)">禁用</el-button>
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
import { findPage, update, deleteById, enable, disable, findList } from '@/api/table'
import { MessageBox } from 'element-ui'

let vm = {}
export default {
  filters: {
    atomRiskTypeFilter(id) {
      for (const atomRiskType of vm.atomRiskTypeList) {
        if (atomRiskType.id === id) {
          return atomRiskType.name
        }
      }
    },
    typesFilter(value) {
      const typesMap = {
        'personal': '个人',
        'enterprise': '企业'
      }
      return typesMap[value]
    }
  },
  data() {
    vm = this
    return {
      atomRiskTypeList: [],
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
      const atomRiskTypeListUrl = 'atomRiskType/findList'
      findList(atomRiskTypeListUrl, {}).then(response => {
        this.atomRiskTypeList = response.data.items
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
      const url = '/atomRiskProduct/findPage'
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
    enableData(row) {
      const url = '/atomRiskProduct/enable/' + row.id
      return new Promise((resolve, reject) => {
        enable(url).then(response => {
          row.status = response.data.status
          row.lastModifiedDate = response.data.lastModifiedDate
          this.$message({
            message: '启用成功!',
            type: 'success'
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    disableData(row) {
      const url = '/atomRiskProduct/disable/' + row.id
      return new Promise((resolve, reject) => {
        disable(url).then(response => {
          row.status = response.data.status
          row.lastModifiedDate = response.data.lastModifiedDate
          this.$message({
            message: '禁用成功!',
            type: 'success'
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    updateData(row) {
      const url = '/atomRiskProduct/update'
      return new Promise((resolve, reject) => {
        update(url, row).then(response => {
          row.name = response.data.name
          row.status = response.data.status
          row.lastModifiedDate = response.data.lastModifiedDate
          this.$set(row, 'edit', false)
          this.$message({
            message: '更新成功!',
            type: 'success'
          })
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
        const url = 'atomRiskProduct/deleteById/' + row.id
        return new Promise((resolve, reject) => {
          deleteById(url).then(response => {
            list.splice(index, 1)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      })
    }
  }
}
</script>
