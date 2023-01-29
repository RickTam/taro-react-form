import { Field } from 'taro-react-form'
import { View } from '@tarojs/components'
import { useCallback, useState } from 'react'
import './index.less'

export default () => {
  const [value, setValue] = useState('123')
  const fieldChange = useCallback(
    (e) => {
      setValue(e ? e.detail.value : '')
    },
    [value],
  )
  const clear = useCallback(() => {
    console.log('清除')
  }, [])
  return (
    <View>
      <Field
        label='测试Field'
        value={value}
        onChange={fieldChange}
        onClear={clear}
        holdKeyboard
      ></Field>
    </View>
  )
}
