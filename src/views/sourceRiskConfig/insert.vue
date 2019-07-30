<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="loginRules" label-width="150px">
      <el-form-item label="信任源名称" prop="name">
        <el-input v-model="form.name" name="name" />
      </el-form-item>
      <el-form-item label="接口密钥" prop="appId">
        <el-input v-model="form.appId" name="appId" />
      </el-form-item>
      <el-form-item label="接口密钥" prop="secretKey">
        <el-input :key="passwordType" v-model="form.secretKey" :type="passwordType" name="secretKey" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateParaNotNull } from '@/utils/validate'
import { insert } from '@/api/table'

export default {
  data() {
    const validateParamString = (rule, value, callback) => {
      if (!validateParaNotNull(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        appId: '',
        secretKey: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateParamString }],
        appId: [{ required: true, trigger: 'blur', validator: validateParamString }],
        secretKey: [{ required: true, trigger: 'blur', validator: validateParamString }]
      },
      passwordType: 'password'
    }
  },
  methods: {
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
    onSubmit() {
      // this.$message('submit!')
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const url = 'sourceRiskConfig/insert'
          const data = { name: this.form.name, appId: this.form.appId, secretKey: this.form.secretKey }
          return new Promise((resolve, reject) => {
            insert(url, data).then(response => {
              this.$router.push({ path: this.redirect || '/sourceRiskConfig/list' })
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
      this.$router.push({ path: this.redirect || '/sourceRiskConfig/list' })
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

