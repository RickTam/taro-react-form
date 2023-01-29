import Taro from '@tarojs/taro'

export type RequestConfig = {
  loading?: boolean
  isTransformResponse?: boolean
  isReturnNativeResponse?: boolean
}

export interface http {
  /**
   * @description: 请求拦截
   */
  requestInterceptor: (options: Taro.request.Option) => Taro.request.Option
}

export type RequestStatus =
  | 0
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 408
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
