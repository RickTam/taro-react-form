import { useMemo } from 'react'
import useSystemInfo from './useSystemInfo'

type SafeTopReturnType = {
  /** 状态栏高度 */
  safeTop: number
  /** 导航栏高度 */
  statusBarHeight: number
  safeAreaPadding: {
    paddingTop: string
  }
  safeAreaMargin: {
    marginTop: string
  }
}

const useSafeTop = (): SafeTopReturnType => {
  const systemInfo = useSystemInfo()
  return useMemo(() => {
    let safeAreaPadding = { paddingTop: '0px' }
    let safeAreaMargin = { marginTop: '0px' }
    let safeTop = 0
    let barHeight = 0
    if (systemInfo) {
      const { safeArea, statusBarHeight } = systemInfo
      if (statusBarHeight) barHeight = statusBarHeight
      if (safeArea) {
        const { top } = safeArea
        safeTop = top
        safeAreaPadding.paddingTop = `${safeTop}px`
        safeAreaMargin.marginTop = `${safeTop}px`
      }
    }
    return {
      safeTop,
      statusBarHeight: barHeight,
      safeAreaPadding,
      safeAreaMargin,
    }
  }, [systemInfo])
}

export default useSafeTop
