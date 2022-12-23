import { useState, useMemo } from 'react'

export interface Actions {
  setTrue: () => void
  setFalse: () => void
  set: (value: boolean) => void
  toggle: () => void
}

const useBoolean = (defaultValue = false): [boolean, Actions] => {
  const [state, setState] = useState(defaultValue)

  const actions: Actions = useMemo(() => {
    const setTrue = () => setState(true)
    const setFalse = () => setState(false)
    const toggle = () => setState(!state)
    return {
      toggle,
      set: (v) => setState(!!v),
      setTrue,
      setFalse,
    }
  }, [state])

  return [state, actions]
}

export default useBoolean
