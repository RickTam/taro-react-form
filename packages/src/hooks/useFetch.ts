/* eslint-disable */
import { useState, useRef, useEffect } from 'react'

type Option = {
  immediate?: boolean
  initParams?: any
  defaultValue?: any
}

export type FunctionArgs<Args extends any[] = any[], Return = any> = (
  ...args: Args
) => Promise<Return>

export type ResolveType<T extends FunctionArgs> = Awaited<PromiseLike<ReturnType<T>>>

export default function useFetch<T extends FunctionArgs>(
  fn: T,
  opt?: Option,
): [ResolveType<T>, boolean, T]
export default function useFetch(fn, opt?) {
  const option: Option = {
    immediate: true,
    defaultValue: [],
    ...(opt || {}),
  }
  const [data, setData] = useState()
  const loading = useRef<boolean>(false)

  const handle = async (...args: any[]) => {
    if (fn && typeof fn === 'function') {
      loading.current = true
      try {
        const res = await fn(...args)
        if (res === void 0 || res === null) {
          setData(option.defaultValue)
        }
        setData(res)
        return data
      } finally {
        loading.current = false
      }
    }
  }

  useEffect(() => {
    if (option.immediate) {
      handle()
    }
  }, [])

  return [data, loading, handle]
}
