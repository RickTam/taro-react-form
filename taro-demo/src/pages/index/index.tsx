import Taro from '@tarojs/taro'
import { useCallback } from 'react'
import { View } from '@tarojs/components'
import { Cell } from 'taro-react-form'

import './index.less'

const routes = [
  {
    title: 'Form',
    url: '/pages/form/index',
  },
  {
    title: 'Checkbox',
    url: '/pages/checkbox/index',
  },
  {
    title: 'Field',
    url: '/pages/field/index',
  },
  {
    title: 'Textarea',
    url: '/pages/textarea/index',
  },
  {
    title: 'Switch',
    url: '/pages/switch/index',
  },
  {
    title: 'Picker',
    url: '/pages/picker/index',
  },
  {
    title: 'Cascader',
    url: '/pages/cascader/index',
  },
  {
    title: 'DatePicker',
    url: '/pages/date-picker/index',
  },
]

export default () => {
  const push = useCallback((url) => {
    Taro.navigateTo({ url })
  }, [])

  return (
    <View>
      {routes.map((r, index) => {
        return (
          <Cell
            key={index}
            title={r.title}
            border
            onClick={() => {
              push(r.url)
            }}
          ></Cell>
        )
      })}
    </View>
  )
}
