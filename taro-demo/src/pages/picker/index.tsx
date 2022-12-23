import { Picker } from 'taro-react-form'
import { View } from '@tarojs/components'
import { useCallback, useEffect, useState } from 'react'
import './index.less'

export default () => {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('004')
  const [options, setOptions] = useState<any>([])
  const onClose = useCallback(() => {
    setVisible(false)
  }, [visible])

  useEffect(() => {
    setTimeout(() => {
      console.log('执行了')
      setOptions([
        { label: '测试1', value: 1 },
        { label: '测试2', value: 2 },
        { label: '测试3', value: 3 },
        { label: '测试4', value: '4' },
        { label: '测试5', value: '5' },
        { label: '测试6', value: '6' },
        { label: '测试7', value: '7' },
        { label: '测试8', value: '8' },
        { label: '测试9', value: '9' },
        { label: '测试10', value: '10' },
      ])
    }, 1000)
  }, [])

  const onChange = useCallback(
    (val) => {
      console.log(val)
      setValue(val)
    },
    [value],
  )
  return (
    <View>
      <View onClick={() => setVisible(true)}>点击展示</View>
      <Picker
        value={value}
        options={options}
        title='测试的picker'
        titleAlign='center'
        visible={visible}
        onClose={onClose}
        onChange={onChange}
      ></Picker>
    </View>
  )
}
