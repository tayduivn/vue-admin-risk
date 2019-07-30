<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="loginRules" label-width="150px">
      <el-form-item label="信任源名称" prop="name">
        <el-input v-model="form.name" name="name" />
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
import { find, update } from '@/api/table'

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
        id: '',
        name: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateParamString }]
      },
      passwordType: 'password'
    }
  },
  mounted() {
    const id = this.$route.params.id
    if (id) {
      const url = 'sourceRiskConfig/findById/' + id
      return new Promise((resolve, reject) => {
        find(url).then(response => {
          const res = response.data
          this.form.id = id
          this.form.name = res.name
          resolve()
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })
    } else {
      this.onCancel()
    }
  },
  methods: {
    onCancel() {
      this.$router.push({ path: this.redirect || '/sourceRiskConfig/list' })
      this.loading = false
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const url = 'sourceRiskConfig/update'
          // const data = { id: this.form.id, name: this.form.name, appId: this.form.appId, secretKey: this.form.secretKey }
          const data = this.form
          return new Promise((resolve, reject) => {
            update(url, data).then(response => {
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
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

