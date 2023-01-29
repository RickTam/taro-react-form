import { Popup } from 'taro-react-form'
import { View } from '@tarojs/components'
import { useCallback, useState } from 'react'
import './index.less'

export default () => {
  const [visible, setVisible] = useState(false)
  const onClose = useCallback(() => {
    setVisible(false)
  }, [visible])
  return (
    <View>
      <View onClick={() => setVisible(true)}>点击展示</View>
      <Popup
        placement='top'
        title='测试popup'
        titleAlign='center'
        visible={visible}
        onClose={onClose}
        headerLeft='我靠靠'
      >
        <View style={{ height: '100px' }}>内容</View>
        <View style={{ height: '100px' }}>内容</View>
        <View style={{ height: '100px' }}>内容</View>
        <View style={{ height: '100px' }}>内容</View>
        <View style={{ height: '100px' }}>内容</View>
        <View style={{ height: '100px' }}>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
        <View>内容</View>
      </Popup>
    </View>
  )
}
