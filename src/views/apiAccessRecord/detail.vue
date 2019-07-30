<template>
  <div class="app-container">
    <el-form ref="data" label-width="26%">
      <el-form-item label="记录编号：">
        {{ data.id }}
      </el-form-item>
      <el-form-item label="调用原子风控服务：">
        {{ data.atomRiskProductId | atomRiskProductFilter }}
      </el-form-item>
      <el-form-item label="所属风控项：">
        {{ atomRiskTypeName }}
      </el-form-item>
      <el-form-item label="调用时间：">
        {{ data.createTime }}
      </el-form-item>
      <el-form-item label="调用结果：">
        <el-tag class="el-tag-c" :type="data.successful | successfulFilter">{{ data.successful=="0"?"成功":"失败" }}</el-tag>
      </el-form-item>
      <el-form-item label="原子服务请求：">
        <el-card class="box-card json-viewer-el-card">
          <div class="clearfix">
            <json-viewer
              :value="data.apiRequest"
              :expand-depth="6"
              copyable
              sort
            />
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="原子服务返回：">
        <el-card class="box-card json-viewer-el-card">
          <div class="clearfix">
            <json-viewer
              :value="data.apiResult"
              :expand-depth="6"
              copyable
              sort
            />
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="信任源服务请求：">
        <el-card class="box-card json-viewer-el-card">
          <div class="clearfix">
            <json-viewer
              :value="data.baseParameter"
              :expand-depth="6"
              copyable
              sort
            />
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="信任源服务返回：">
        <el-card class="box-card json-viewer-el-card">
          <div class="clearfix">
            <json-viewer
              :value="data.baseResult"
              :expand-depth="6"
              copyable
              sort
            />
          </div>
        </el-card>
      </el-form-item>
      <el-form-item v-show="data.successful=='1'" label="错误信息：">
        <el-card class="box-card json-viewer-el-card">
          <div class="clearfix">
            <json-viewer
              :value="data.errorMessage"
              :expand-depth="6"
              copyable
              sort
            />
          </div>
        </el-card>
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
    successfulFilter(successful) {
      const successfulMap = {
        '0': 'success',
        '1': 'danger'
      }
      return successfulMap[successful]
    },
    atomRiskProductFilter(id) {
      for (const atomRiskProduct of vm.atomRiskProductList) {
        if (atomRiskProduct.id === id) {
          for (const atomRiskType of vm.atomRiskTypeList) {
            if (atomRiskType.id === atomRiskProduct.atomRiskTypeId) {
              vm.atomRiskTypeName = atomRiskType.name
              break
            }
          }
          return atomRiskProduct.name
        }
      }
    }
  },
  data() {
    vm = this
    return {
      atomRiskTypeName: '',
      atomRiskProductList: [],
      atomRiskTypeList: [],
      data: {
        apiRequest: {},
        baseParameter: {},
        baseResult: {},
        apiResult: {},
        errorMessage: {}
      }
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id) {
      return new Promise((resolve, reject) => {
        const findByIdUrl = 'apiAccessRecord/findById/' + id
        find(findByIdUrl).then(response => {
          this.data = response.data
          // this.data.id = id
          // this.data.name = res.name
          // this.data.atomRiskTypeId = res.atomRiskTypeId
          // this.data.level = res.level
          // this.data.status = res.status
          // this.data.createTime = res.createTime
          // this.data.lastModifiedDate = res.lastModifiedDate
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
        const atomRiskProductListUrl = 'atomRiskProduct/findList'
        findList(atomRiskProductListUrl, {}).then(response => {
          this.atomRiskProductList = response.data.items
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
      this.$router.push({ path: this.redirect || '/statistical/apiAccessRecordList' })
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
    margin-right: 10px;
    top: 2px;
    font-size: 14px
}
.json-viewer-el-card{
    width: 80%;
  line-height: 1.5;
}
</style>
