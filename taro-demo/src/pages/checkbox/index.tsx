import { Checkbox, CheckOptionType } from 'taro-react-form'
import { View } from '@tarojs/components'
import { useCallback, useState } from 'react'
import './index.less'

export default () => {
  const [value, setValue] = useState<number[]>([])
  const [activeKeysT, setActiveKeysT] = useState<number[]>([])

  const options: CheckOptionType[] = [
    { label: '报价中', value: '1' },
    { label: '报价完成', value: '2' },
    { label: '待确认', value: '3' },
    { label: '内部完善中', value: '4' },
  ]

  const checkOnChange = useCallback((activeKey, item) => {
    console.log('item', item)
    setValue(activeKey)
  }, [])

  const checkOnChangeT = useCallback((activeKey, item) => {
    console.log('item', item)
    setActiveKeysT(activeKey)
  }, [])

  return (
    <View>
      单选
      <Checkbox value={value} options={options} columnNum={3} onChange={checkOnChange}></Checkbox>
      多选
      <Checkbox
        isMultiple
        value={activeKeysT}
        options={options}
        onChange={checkOnChangeT}
      ></Checkbox>
    </View>
  )
}
