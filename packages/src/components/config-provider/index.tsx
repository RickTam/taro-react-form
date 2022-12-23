import { createContext, FC } from 'react'

export type ConfigProviderProps = {
  uploadOptions?: {
    getTokens?: <T = any>(...arg) => Promise<T>
    getPrivateUrls?: <T = any>(...arg) => Promise<T>
    getBciscmPrivateUrl?: <T = any>(...arg) => Promise<T>
  }
  [key: string]: any
}

export const ConfigContext = createContext<ConfigProviderProps>({})

ConfigContext.displayName = 'ConfigContext'

const ConfigProvider: FC<ConfigProviderProps> = (props) => {
  const { children, ...rest } = props
  return <ConfigContext.Provider value={rest}>{children}</ConfigContext.Provider>
}

export default ConfigProvider
