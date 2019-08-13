<template>
  <div class="app-container">
    <el-form ref="data" label-width="30%">
      <el-form-item label="原子风控服务编号：" prop="name">
        {{ data.id }}
      </el-form-item>
      <el-form-item label="原子风控服务名称：" prop="name">
        {{ data.name }}
      </el-form-item>
      <el-form-item label="风控类型：" prop="appId">
        {{ data.types | typesFilter }}
      </el-form-item>
      <el-form-item label="所属风控项：" prop="appId">
        {{ data.atomRiskTypeId | atomRiskTypeFilter }}
      </el-form-item>
      <el-form-item label="信任源风控服务：" prop="name">
        <el-tag
          v-for="item in sourceRiskProductList"
          :key="item.id"
          class="el-tag-c"
        >{{ item.name }}</el-tag>
      </el-form-item>
      <el-form-item label="信任源服务实现：" prop="appId">
        {{ data.caller | callerFilter }}
      </el-form-item>
      <el-form-item label="同风控项优先级：" prop="appId">
        {{ data.level }}
      </el-form-item>
      <el-form-item label="信任源状态：" prop="name">
        {{ data.status=="0" ? "启用" : "已禁用" }}
      </el-form-item>
      <el-form-item label="创建时间：" prop="name">
        {{ data.createTime }}
      </el-form-item>
      <el-form-item label="最新更新时间：" prop="name">
        {{ data.lastModifiedDate }}
      </el-form-item>
      <el-form-item>
        <el-button @click="onBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { find, findList } from '@/api/table'

let vm = {}
export default {
  filters: {
    sourceRiskProductFilter() {
      let products = ''
      for (const sourceRiskProduct of vm.sourceRiskProductList) {
        products += sourceRiskProduct.name
      }
      return products
    },
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
    },
    callerFilter(impl) {
      for (const caller of vm.callerList) {
        if (caller.impl === impl) {
          return caller.name
        }
      }
    }
  },
  data() {
    vm = this
    return {
      sourceRiskProductList: [],
      atomRiskTypeList: [],
      callerList: [],
      data: {}
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id) {
      return new Promise((resolve, reject) => {
        const findByIdUrl = 'atomRiskProduct/findById/' + id
        find(findByIdUrl).then(response => {
          this.data = response.data
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })
        const atomRiskTypeListUrl = 'atomRiskType/findList'
        findList(atomRiskTypeListUrl, {}).then(response => {
          this.atomRiskTypeList = response.data.items
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })
        const findByAtomRiskProductIdUrl = 'sourceRiskProduct/findByAtomRiskProductId/' + id
        find(findByAtomRiskProductIdUrl).then(response => {
          this.sourceRiskProductList = response.data.items
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })
        const callerListUrl = 'atomRiskProduct/findCallerList'
        findList(callerListUrl, {}).then(response => {
          this.callerList = response.data.items
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })
    } else {
      this.onBack()
    }
  },
  methods: {
    onBack() {
      this.$router.push({ path: this.redirect || '/atomRiskProduct/list' })
      this.loading = false
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-tag-c {
    margin-right: 7px;
    top: 2px;
    font-size: 14px
}
</style>
