import { FC, useState, useEffect, useMemo } from 'react'
import { ITouchEvent, View } from '@tarojs/components'
import classNames from 'classnames'

export interface SwitchProps {
  checked: boolean
  disabled: boolean
  className: string
  onChange: (val: boolean, event: ITouchEvent) => void
}

const Switch: FC<Partial<SwitchProps>> = (props) => {
  const { checked = false, disabled = false, onChange, className } = props
  const [value, setValue] = useState(false)

  useEffect(() => {
    setValue(checked)
  }, [checked])

  const SwitchClassName = useMemo(
    () =>
      classNames('ygp-switch ygp-switch-base', className, {
        'switch-open': value,
        'switch-close': !value,
        'ygp-switch-disabled': disabled,
      }),
    [value],
  )

  const onClick = (event: ITouchEvent) => {
    if (disabled) return
    onChange?.(!value, event)
  }
  return (
    <View className={SwitchClassName} onClick={onClick}>
      <View className='switch-button'></View>
    </View>
  )
}

export default Switch
