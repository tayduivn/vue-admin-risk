<template>
  <div class="app-container">
    <el-form ref="data">
      <el-form-item label="记录编号：" label-width="20%">
        {{ data.id }}
      </el-form-item>
      <el-form-item label="风控项：" label-width="20%">
        {{ atomRiskTypeName }}
      </el-form-item>
      <el-form-item label="调用结果：" label-width="20%">
        <el-tag class="el-tag-c" :type="data.successful | successfulFilter">{{ data.successful=='0'?'成功':'失败' }}
        </el-tag>
      </el-form-item>
      <el-form-item style="margin-left: 16%;">
        <el-timeline>
          <el-timeline-item
            placement="top"
            icon="el-icon-caret-right"
            type="primary"
            size="large"
            :timestamp="data.createTime"
          >
            <el-card class="box-card json-viewer-el-card">
              <h3>原子风控服务[{{ data.atomRiskProductId | atomRiskProductFilter }}]&nbsp;&nbsp;<i v-show="data.successful=='0'" class="el-icon-success" /><i v-show="data.successful!='0'" class="el-icon-warning" /></h3>
              <div v-show="data.apiRequest!=null">
                <h4>请求：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="data.apiRequest"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
              <div v-show="data.apiResult!=null">
                <h4>返回：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="data.apiResult"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
              <div v-show="data.errorMessage!=null">
                <h4>错误信息：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="data.errorMessage"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            v-for="(record, index) in sourceAccessRecords"
            :key="index"
            placement="top"
            color="#0bbd87"
            type="primary"
            size="large"
            icon="el-icon-d-caret"
            :timestamp="record.createTime"
          >
            <el-card class="box-card json-viewer-el-card">
              <h3>信任源服务[{{ record.sourceRiskProductId | sourceRiskProductFilter }}]&nbsp;&nbsp;<i v-show="record.successful=='0'" class="el-icon-success" /><i v-show="record.successful!='0'" class="el-icon-warning" /></h3>
              <div v-show="record.baseParameter!=null">
                <h4>请求：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="record.baseParameter"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
              <div v-show="record.baseResult!=null">
                <h4>返回：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="record.baseResult"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
              <div v-show="record.errorMessage!=null">
                <h4>错误信息：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="record.errorMessage"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
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
    },
    sourceRiskProductFilter(id) {
      for (const sourceRiskProduct of vm.sourceRiskProductList) {
        if (sourceRiskProduct.id === id) {
          return sourceRiskProduct.name
        }
      }
    }
  },
  data() {
    vm = this
    return {
      sourceRiskProductList: [],
      atomRiskTypeName: '',
      atomRiskProductList: [],
      atomRiskTypeList: [],
      sourceAccessRecords: [{
        baseParameter: {},
        baseResult: {},
        successful: '',
        errorMessage: '',
        createTime: '',
        sourceRiskProductId: ''
      }],
      data: {
        id: '',
        apiRequest: {},
        apiResult: {},
        successful: '',
        errorMessage: '',
        createTime: '',
        atomRiskProductId: ''
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
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })
        const findSourceAccessRecordById = 'apiAccessRecord/findSourceAccessRecord/' + id
        find(findSourceAccessRecordById).then(response => {
          this.sourceAccessRecords = response.data.items
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
        const sourceRiskProductListUrl = 'sourceRiskProduct/findList'
        findList(sourceRiskProductListUrl, {}).then(response => {
          this.sourceRiskProductList = response.data.items
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
  .line {
    text-align: center;
  }

  .el-tag-c {
    margin-right: 10px;
    top: 2px;
    font-size: 14px
  }

  .json-viewer-el-card {
    width: 80%;
    line-height: 1.5;
  }
  .el-icon-success{
    color: #42b983;
  }
  .el-icon-warning{
    color: #F56C6C;
  }
</style>
