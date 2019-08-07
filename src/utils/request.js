import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    // config.headers['Content-Type'] = 'text/plain'
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // code=0为正确，code=-1为异常
    const successCode = 0
    if (res.code !== successCode) {
      let errorMsg = res.msg
      // 110: Illegal token; 50012: Other clients logged in; 111: Token expired;
      if (res.code === 110 || res.code === 111) {
        errorMsg = '当前会话已失效，请重新登录！'
      }
      Message({
        message: errorMsg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(new Error(errorMsg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      // message: error.message,
      message: '网络请求异常!',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
