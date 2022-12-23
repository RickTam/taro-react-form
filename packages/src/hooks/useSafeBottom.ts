import { useMemo } from 'react'
import useSystemInfo from './useSystemInfo'

type SafeBottomReturnType = {
  safeBottom: number
  safeAreaPadding: {
    paddingBottom: string
  }
  safeAreaMargin: {
    marginBottom: string
  }
}

const useSafeBottom = (height = 0): SafeBottomReturnType => {
  const systemInfo = useSystemInfo()
  return useMemo(() => {
    let safeAreaPadding = { paddingBottom: '0px' }
    let safeAreaMargin = { marginBottom: '0px' }
    let safeBottom = 0
    if (systemInfo) {
      const { safeArea, screenHeight } = systemInfo
      if (safeArea) {
        const { bottom } = safeArea
        safeBottom = screenHeight - bottom
        safeAreaPadding.paddingBottom = `${safeBottom + height}px`
        safeAreaMargin.marginBottom = `${safeBottom + height}px`
      }
    }
    return { safeBottom, safeAreaPadding, safeAreaMargin }
  }, [systemInfo])
}

export default useSafeBottom
