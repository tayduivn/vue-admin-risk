<template>
  <div class="app-container">
    <el-form ref="data">
      <el-form-item label="记录编号：" label-width="20%">
        {{ apiAccessRecord.id }}
      </el-form-item>
      <el-form-item label="风控项：" label-width="20%">
        {{ atomRiskType.name }}
      </el-form-item>
      <el-form-item label="调用结果：" label-width="20%">
        <el-tag class="el-tag-c" :type="apiAccessRecord.successful | successfulFilter">{{ apiAccessRecord.successful=='0'?'成功':'失败' }}
        </el-tag>
      </el-form-item>
      <el-form-item style="margin-left: 16%;">
        <el-timeline>
          <el-timeline-item
            placement="top"
            color="#67C23A"
            type="primary"
            size="large"
            icon="el-icon-caret-right"
            :timestamp="apiAccessRecord.createTime"
          >
            <el-card class="box-card json-viewer-el-card">
              <h3>API调用记录&nbsp;&nbsp;<i v-show="apiAccessRecord.successful=='0'" class="el-icon-success" /><i v-show="apiAccessRecord.successful!='0'" class="el-icon-warning" /></h3>
              <div v-show="apiAccessRecord.apiRequest!=null">
                <h4>请求：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="apiAccessRecord.apiRequest"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
              <div v-show="apiAccessRecord.apiResult!=null">
                <h4>返回：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="apiAccessRecord.apiResult"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
              <div v-show="apiAccessRecord.errorMessage!=null">
                <h4>错误信息：</h4>
                <div class="clearfix">
                  <json-viewer
                    :value="apiAccessRecord.errorMessage"
                    :expand-depth="6"
                    copyable
                    sort
                  />
                </div>
              </div>
            </el-card>
          </el-timeline-item>

          <el-timeline>
            <el-timeline-item
              v-for="(aar, index2) in atomAccessRecordList"
              :key="index2"
              placement="top"
              color="#409EFF"
              type="primary"
              size="large"
              icon="el-icon-arrow-right"
              :timestamp="aar.createTime"
            >
              <el-card class="box-card json-viewer-el-card">
                <h3>原子风控服务[{{ aar.atomRiskProductId | atomRiskProductFilter }}]&nbsp;&nbsp;<i v-show="aar.successful=='0'" class="el-icon-success" /><i v-show="aar.successful!='0'" class="el-icon-warning" /></h3>
                <div v-show="aar.errorMessage!=null">
                  <h4>错误信息：</h4>
                  <div class="clearfix">
                    <json-viewer
                      :value="aar.errorMessage"
                      :expand-depth="6"
                      copyable
                      sort
                    />
                  </div>
                </div>
              </el-card>

              <el-timeline>
                <el-timeline-item
                  v-for="(sar, index3) in aar.sourceAccessRecordList"
                  :key="index3"
                  placement="top"
                  color="#E6A23C"
                  type="primary"
                  size="large"
                  icon="el-icon-d-arrow-right"
                  :timestamp="sar.createTime"
                >
                  <el-card class="box-card json-viewer-el-card">
                    <h3>数据源风控服务[{{ sar.sourceRiskProductId | sourceRiskProductFilter }}]&nbsp;&nbsp;<i v-show="sar.successful=='0'" class="el-icon-success" /><i v-show="sar.successful!='0'" class="el-icon-warning" /></h3>
                    <div v-show="sar.baseParameter!=null">
                      <h4>请求：</h4>
                      <div class="clearfix">
                        <json-viewer
                          :value="sar.baseParameter"
                          :expand-depth="6"
                          copyable
                          sort
                        />
                      </div>
                    </div>
                    <div v-show="sar.baseResult!=null">
                      <h4>返回：</h4>
                      <div class="clearfix">
                        <json-viewer
                          :value="sar.baseResult"
                          :expand-depth="6"
                          copyable
                          sort
                        />
                      </div>
                    </div>
                    <div v-show="sar.errorMessage!=null">
                      <h4>错误信息：</h4>
                      <div class="clearfix">
                        <json-viewer
                          :value="sar.errorMessage"
                          :expand-depth="6"
                          copyable
                          sort
                        />
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>

            </el-timeline-item>
          </el-timeline>

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
      atomRiskProductList: [],
      atomRiskType: {
        name: '',
        type: ''
      },
      atomAccessRecordList: [],
      apiAccessRecord: {
        id: '',
        apiRequest: {},
        apiResult: {},
        successful: '',
        errorMessage: '',
        createTime: ''
      }
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id) {
      return new Promise((resolve, reject) => {
        // 获取ApiAccessRecord
        const findByIdUrl = 'apiAccessRecord/findDetailByApiAccessRecordId/' + id
        find(findByIdUrl).then(response => {
          this.apiAccessRecord = response.data.apiAccessRecord
          this.atomAccessRecordList = response.data.atomAccessRecordList
          this.atomRiskType = response.data.atomRiskType
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })

        // 获取风控产品列表
        const atomRiskProductListUrl = 'atomRiskProduct/findList'
        findList(atomRiskProductListUrl, {}).then(response => {
          this.atomRiskProductList = response.data.items
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })

        // 获取数据源风控产品列表
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
      this.$router.push({ path: this.redirect || '/statistics/apiAccessRecordList' })
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
  .el-timeline-item{
    margin-top: 15px;
  }
</style>
