import { View } from '@tarojs/components'
import { Switch } from 'taro-react-form'
import { useState } from 'react'

export default () => {
  const [checked, setChecked] = useState<boolean>(false)
  return (
    <View>
      <Switch checked={checked} onChange={setChecked}></Switch>
    </View>
  )
}
