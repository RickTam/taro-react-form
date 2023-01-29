import { DatePicker, Cell } from 'taro-react-form'
import { useState } from 'react'

import './index.less'

export default () => {
  const [value, setValue] = useState('2022-03-09')
  const [value1, setValue1] = useState(['2022-03-09', '2023-01-09'])
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)

  const onChange = (date: string) => {
    setValue(date)
  }

  const onChange1 = (date) => {
    setValue1(date)
  }

  return (
    <>
      <Cell
        title='选择日期'
        desc={value ? value : '请选择'}
        onClick={() => {
          setVisible(true)
        }}
      />
      <Cell
        title='选择日期范围'
        desc={value1 ? value1.join('~') : '请选择'}
        onClick={() => {
          setVisible1(true)
        }}
      />
      <DatePicker
        value={value}
        title='选择日期'
        visible={visible}
        autoClose
        titleAlign='center'
        onChange={onChange}
        onClose={() => setVisible(false)}
      ></DatePicker>
      <DatePicker
        value={value1}
        title='选择日期'
        visible={visible1}
        mode='range'
        autoClose
        titleAlign='center'
        onChange={onChange1}
        onClose={() => setVisible1(false)}
      ></DatePicker>
    </>
  )
}
