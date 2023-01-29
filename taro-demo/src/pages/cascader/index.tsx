import { Cascader } from 'taro-react-form'
import { View } from '@tarojs/components'
import { useCallback, useState } from 'react'

import './index.less'

export default () => {
  const [visible, setVisible] = useState(false)
  const [address, setAddress] = useState([])
  const options = [
    {
      value: 'zhejiang',
      label: '浙江省',
      children: [
        {
          value: 'hangzhou',
          label: '杭州市',
          children: [
            {
              value: 'xihu',
              label: '西湖区',
            },
            {
              value: 'xiasha',
              label: '下沙区',
            },
            {
              value: 'xiasha1',
              label: '下沙区',
            },
            {
              value: 'xiasha2',
              label: '下沙区',
            },
            {
              value: 'xiasha3',
              label: '下沙区',
            },
            {
              value: 'xiasha4',
              label: '下沙区',
            },
            {
              value: 'xiasha5',
              label: '下沙区',
            },
            {
              value: 'xiasha6',
              label: '下沙区',
            },
            {
              value: 'xiasha7',
              label: '下沙区',
            },
            {
              value: 'xiasha8',
              label: '下沙区',
            },
            {
              value: 'xiasha9',
              label: '下沙区',
            },
            {
              value: 'xiasha10',
              label: '下沙区',
            },

            {
              value: 'xiasha11',
              label: '下沙区',
            },
            {
              value: 'xiasha12',
              label: '下沙区',
            },
          ],
        },
      ],
    },
    {
      value: 'guangdong',
      label: '广东省',
      children: [
        {
          value: 'guangzhou',
          label: '广州市',
          children: [
            {
              value: 'haizhu',
              label: '海珠区',
            },
          ],
        },
        {
          value: 'shenzheng',
          label: '深圳市',
          children: [
            {
              value: 'qianhai',
              label: '前海区',
            },
            {
              value: 'baoan',
              label: '宝安区',
            },
          ],
        },
      ],
    },
  ]

  const onClose = useCallback(() => {
    setVisible(false)
  }, [])

  const onChange = useCallback((value, selectedOptions, currentOption) => {
    console.log(value, selectedOptions, currentOption)
    setAddress(value)
  }, [])

  return (
    <View>
      <View onClick={() => setVisible(true)}>点击展示</View>
      <Cascader
        value={address}
        options={options}
        title='测试集联选择'
        titleAlign='center'
        visible={visible}
        autoClose
        onClose={onClose}
        onChange={onChange}
        height='80%'
      ></Cascader>
    </View>
  )
}
