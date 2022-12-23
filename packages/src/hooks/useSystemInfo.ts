import { getSystemInfo } from '@tarojs/taro'
import { useCallback, useEffect, useState } from 'react'

export type Result = Taro.getSystemInfo.Result | undefined

function useSystemInfo(): Result {
  const [systemInfo, setSystemInfo] = useState<Result>()

  const getSystemInfoSync = useCallback(() => {
    try {
      getSystemInfo({
        success: setSystemInfo,
        fail: () => console.error({ errMsg: 'getSystemInfo: fail' }),
      })
    } catch (e) {
      console.error({ errMsg: 'getSystemInfo: fail', data: e })
    }
  }, [])

  useEffect(() => {
    getSystemInfoSync()
  }, [])

  return systemInfo
}

export default useSystemInfo
