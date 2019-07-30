<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="loginRules" label-width="200px">
      <el-form-item label="原子风控服务名称" prop="name">
        <el-input v-model="form.name" name="name" />
      </el-form-item>
      <el-form-item label="信任源风控服务" prop="sourceRiskProductChoose">
        <el-select v-model="form.sourceRiskProductChoose" class="show-half" multiple placeholder="可选择一项或多项" name="sourceRiskProductChoose">
          <el-option
            v-for="item in sourceRiskProductList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属风控项" prop="atomRiskTypeId">
        <el-select v-model="form.atomRiskTypeId" placeholder="请选择风控项" name="atomRiskTypeId" class="show-half">
          <el-option
            v-for="item in atomRiskTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="风控类型" prop="types">
        <el-select v-model="form.types" placeholder="请选择风控类型" name="types" class="show-half">
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="信任源服务实现" prop="caller">
        <el-select v-model="form.caller" placeholder="选择信任源服务实现" name="caller" class="show-half">
          <el-option
            v-for="item in callerList"
            :key="item.impl"
            :label="item.name"
            :value="item.impl"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="同风控项优先级" prop="url">
        <el-slider
          v-model="form.level"
          class="show-half"
          show-input
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateParaNotNull, validateParaGtZero, validateArrayNotNull } from '@/utils/validate'
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
    const validateSelectArray = (rule, value, callback) => {
      if (!validateArrayNotNull(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      sourceRiskProductList: [],
      atomRiskTypeList: [],
      callerList: [],
      types: [{
        value: 'personal',
        label: '个人'
      }, {
        value: 'enterprise',
        label: '企业'
      }],
      form: {
        types: '',
        sourceRiskProductChoose: [],
        name: '',
        level: 50,
        caller: '',
        atomRiskTypeId: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateParamString }],
        atomRiskTypeId: [{ required: true, trigger: 'blur', validator: validateParamSelect }],
        sourceRiskProductChoose: [{ required: true, trigger: 'blur', validator: validateSelectArray }],
        caller: [{ required: true, trigger: 'blur', validator: validateParamString }],
        types: [{ required: true, trigger: 'blur', validator: validateParamString }]
      },
      passwordType: 'password'
    }
  },
  mounted() {
    return new Promise((resolve, reject) => {
      const sourceRiskProductListUrl = 'sourceRiskProduct/findList'
      findList(sourceRiskProductListUrl, {}).then(response => {
        this.sourceRiskProductList = response.data.items
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
      const callerListUrl = 'atomRiskProduct/findCallerList'
      findList(callerListUrl, {}).then(response => {
        this.callerList = response.data.items
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
          const url = 'atomRiskProduct/insert'
          const data = { name: this.form.name, level: this.form.level, atomRiskTypeId: this.form.atomRiskTypeId, types: this.form.types, caller: this.form.caller }
          return new Promise((resolve, reject) => {
            insert(url, { entity: data, spare: this.form.sourceRiskProductChoose }).then(response => {
              this.$router.push({ path: this.redirect || '/atomRiskProduct/list' })
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
.show-half {
    width: 40%;
}
</style>

