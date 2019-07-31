<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="loginRules" label-width="200px">
      <el-form-item label="信任源风控服务名称" prop="name">
        <el-input v-model="form.name" name="name" />
      </el-form-item>
      <el-form-item label="信任源风控服务url" prop="url">
        <el-input v-model="form.url" name="url" />
      </el-form-item>
      <el-form-item label="接口账号" prop="appId">
        <el-input v-model="form.appId" name="appId" />
      </el-form-item>
      <el-form-item label="接口密钥" prop="secretKey">
        <el-input :key="passwordType" v-model="form.secretKey" :type="passwordType" name="secretKey" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateParaNotNull, validateParaGtZero, validateParamDouble } from '@/utils/validate'
import { insert, findList } from '@/api/table'

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
      form: {
        name: '',
        price: '',
        url: '',
        sourceRiskConfigId: '',
        appId: '',
        secretKey: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateParamString }],
        price: [{ required: true, trigger: 'blur', validator: validateParamPrice }],
        url: [{ required: true, trigger: 'blur', validator: validateParamString }],
        sourceRiskConfigId: [{ required: true, trigger: 'blur', validator: validateParamSelect }],
        appId: [{ required: true, trigger: 'blur', validator: validateParamString }],
        secretKey: [{ required: true, trigger: 'blur', validator: validateParamString }]
      },
      passwordType: 'password'
    }
  },
  mounted() {
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
    onSubmit() {
      // this.$message('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const url = 'sourceRiskProduct/insert'
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
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
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
.show-pwd {
  position: absolute;
  right: 20px;
  top: 2px;
  font-size: 16px
}
</style>

