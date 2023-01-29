import Taro from '@tarojs/taro'
import { RequestConfig, RequestStatus } from './types'

class httpRequest {
  private readonly defaultConfig

  constructor(conf: RequestConfig) {
    this.defaultConfig = conf
  }
  get<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>(options, config)
  }
  post<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>({ ...options, method: 'POST' }, config)
  }
  put<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>({ ...options, method: 'PUT' }, config)
  }
  delete<T = any>(options: Taro.request.Option, config?: RequestConfig) {
    return this.request<T>({ ...options, method: 'DELETE' }, config)
  }
  request<T = any>(options: Taro.request.Option, config?: RequestConfig): Promise<T> {
    const conf = Object.assign({}, this.defaultConfig, config)
    if (conf.loading) {
      Taro.showLoading()
    }
    const opt = requestInterceptor(options)
    return new Promise<T>((resolve) => {
      Taro.request({
        timeout: 8000,
        ...opt,
        success(res) {
          if (conf.loading) Taro.hideLoading()
          const ret = transformResponse(res, conf)
          resolve(ret)
        },
        fail(err) {
          if (conf.loading) Taro.hideLoading()
          responseInterceptorsCatch(err)
        },
      })
    })
  }
}

/**
 * @description: 请求拦截
 */
function requestInterceptor(options: Taro.request.Option): Taro.request.Option {
  const { header } = options
  const token = ''
  // 设置token、appName
  options.header = {
    ...header,
    token,
  }
  return options
}

function transformResponse(res, config) {
  const { isTransformResponse, isReturnNativeResponse } = config
  if (isReturnNativeResponse) {
    return res
  }

  if (!isTransformResponse) {
    return res.data
  }

  const { data } = res
  if (!data) {
    Taro.showToast({
      title: '请求出错，请稍候重试',
      icon: 'none',
    })
  }

  const { code, data: result } = data
  if (code === 0) {
    return result
  }
  return responseInterceptorsCatch(res)
}

/**
 * @description: 响应错误处理
 */
function responseInterceptorsCatch(error: any) {
  const { data } = error || {}
  const msg: string = data?.msg ?? ''
  const err: string = error?.errMsg?.toString?.() ?? ''
  let errMessage = ''
  try {
    if (err?.includes('request:fail')) {
      errMessage = '请求出错，请稍后重试'
    }
    if (err?.includes('request:fail timeout')) {
      errMessage = '网络异常，请检查您的网络连接是否正常!'
    }
    if (errMessage) {
      Taro.showToast({
        title: errMessage,
        icon: 'none',
      })
      return Promise.reject(error)
    }
  } catch (captureErr) {
    throw new Error(captureErr as unknown as string)
  }
  checkStatus(data?.code || error?.statusCode, msg)
  return Promise.reject(error)
}

function checkStatus(status: RequestStatus, msg: string): void {
  let errMessage = ''

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    // 401: 无接口权限
    case 401:
      errMessage = msg || '没有权限访问'
      break
    // 403 一般为token过期出现
    case 403:
      errMessage = msg || '登录过期,请重新登录！'
      break
    // 404请求不存在
    case 404:
      errMessage = msg || '网络请求错误,未找到该资源!'
      break
    case 405:
      errMessage = msg || '网络请求错误,请求方法未允许!'
      break
    case 408:
      errMessage = msg || '网络请求超时!'
      break
    case 500:
      errMessage = msg || '服务器错误,请联系管理员!'
      break
    case 501:
      errMessage = msg || '网络未实现!'
      break
    case 502:
      errMessage = msg || '网络错误!'
      break
    case 503:
      errMessage = msg || '服务不可用，服务器暂时过载或维护!'
      break
    case 504:
      errMessage = msg || '网络超时!'
      break
    case 505:
      errMessage = msg || 'http版本不支持该请求!'
      break
    default:
      errMessage = msg || '请求出错，请稍候重试'
  }
  Taro.showToast({
    title: errMessage,
    icon: 'none',
  })
}

function createHttpRequest() {
  return new httpRequest({
    loading: true,
    isTransformResponse: true,
    isReturnNativeResponse: false,
  })
}

export default createHttpRequest()
