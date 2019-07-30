<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="loginRules" label-width="200px">
      <el-form-item label="信任源风控服务名称" prop="name">
        <el-input v-model="form.name" name="name" />
      </el-form-item>
      <el-form-item label="信任源风控服务url" prop="url">
        <el-input v-model="form.url" name="url" />
      </el-form-item>
      <el-form-item label="信任源风控服务单价" prop="price">
        <el-input v-model="form.price" name="price" placeholder="单位：元" />
      </el-form-item>
      <el-form-item label="所属信任源" prop="sourceRiskConfigId">
        <el-select v-model="form.sourceRiskConfigId" placeholder="选择提供服务的信任源" name="sourceRiskConfigId">
          <el-option
            v-for="item in sourceRiskConfigList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信任源服务实现" prop="caller">
        <el-select v-model="form.caller" placeholder="选择信任源服务实现" name="caller">
          <el-option
            v-for="item in callerList"
            :key="item.impl"
            :label="item.name"
            :value="item.impl"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateParaNotNull, validateParaGtZero, validateParamDouble } from '@/utils/validate'
import { insert, find, findList } from '@/api/table'

export default {
  data() {
    const validateParamString = (rule, value, callback) => {
      if (!validateParaNotNull(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const validateParamSelect = (rule, value, callback) => {
      if (!validateParaGtZero(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const validateParamPrice = (rule, value, callback) => {
      if (!validateParamDouble(value)) {
        callback(new Error('格式有误'))
      } else {
        callback()
      }
    }
    return {
      sourceRiskConfigList: [],
      callerList: [],
      form: {
        id: '',
        name: '',
        price: '',
        url: '',
        caller: '',
        sourceRiskConfigId: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateParamString }],
        price: [{ required: true, trigger: 'blur', validator: validateParamPrice }],
        url: [{ required: true, trigger: 'blur', validator: validateParamString }],
        caller: [{ required: true, trigger: 'blur', validator: validateParamString }],
        sourceRiskConfigId: [{ required: true, trigger: 'blur', validator: validateParamSelect }]
      },
      passwordType: 'password'
    }
  },
  mounted() {
    return new Promise((resolve, reject) => {
      const id = this.$route.params.id
      if (id) {
        const url = 'sourceRiskProduct/findById/' + id
        return new Promise((resolve, reject) => {
        // 获取节点信息
          find(url).then(response => {
            const res = response.data
            this.form.id = id
            this.form.name = res.name
            this.form.price = res.price
            this.form.url = res.url
            this.form.caller = res.caller
            this.form.sourceRiskConfigId = res.sourceRiskConfigId
            resolve()
          }).catch(error => {
            this.loading = false
            reject(error)
          })
          // 获取信任源列表
          const sourceRiskConfigListUrl = 'sourceRiskConfig/findList'
          findList(sourceRiskConfigListUrl, {}).then(response => {
            this.sourceRiskConfigList = response.data.items
            resolve()
          }).catch(error => {
            this.loading = false
            reject(error)
          })
          // 获取信任源实现列表
          const callerListUrl = 'sourceRiskConfig/findCallerList'
          findList(callerListUrl, {}).then(response => {
            this.callerList = response.data.items
            resolve()
          }).catch(error => {
            this.loading = false
            reject(error)
          })
        })
      } else {
        this.onCancel()
      }
    })
  },
  methods: {
    onSubmit() {
      // this.$message('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const url = 'sourceRiskProduct/update'
          const data = this.form
          return new Promise((resolve, reject) => {
            insert(url, data).then(response => {
              this.$router.push({ path: this.redirect || '/sourceRiskProduct/list' })
              this.loading = false
              resolve()
            }).catch(error => {
              this.loading = false
              reject(error)
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.$router.push({ path: this.redirect || '/sourceRiskProduct/list' })
      this.loading = false
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

