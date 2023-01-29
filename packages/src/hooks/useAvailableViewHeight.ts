import Taro from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import useSystemInfo from './useSystemInfo'

export type DeepArray<T> = Array<T | DeepArray<T>>
/**
 * 返回排除了传入查询节点后的视窗可用高度
 * @param arg 多维字符串数组,最大深度为10
 * @returns number
 */
const useAvailableViewHeight = (...arg: DeepArray<string>) => {
  const systemInfo = useSystemInfo()
  const [extraHeight, setExtraHeight] = useState(0)
  useEffect(() => {
    Taro.nextTick(() => {
      const query = Taro.createSelectorQuery()
      arg.flat(10).forEach((item) => {
        if (item instanceof Array) {
          throw Error(
            'The useAvailableViewHeight parameter is incorrect, the array depth cannot be greater than 10',
          )
        } else {
          query.select(item).boundingClientRect()
        }
      })

      query.exec((res) => {
        res.length &&
          setExtraHeight(res.map((dom) => (dom ? dom.height : 0)).reduce((a, b) => a + b))
      })
    })
  }, [arg])

  return useMemo(() => {
    return systemInfo ? systemInfo.windowHeight - extraHeight : 0
  }, [systemInfo, extraHeight])
}

export default useAvailableViewHeight
