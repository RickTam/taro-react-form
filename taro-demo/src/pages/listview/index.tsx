import { View } from '@tarojs/components'
import { ListView } from 'taro-react-form'

import './index.less'

const data = Array(100).fill({})

const fetcher = async (params) => {
  console.log('params', params)
  const { page, limit } = params
  let arr = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.slice((page - 1) * limit, page * limit))
    }, 1000)
  })
  console.log('arr', arr)
  return { list: arr, total: 111 }
}

export default () => {
  const { listData, listViewProps } = ListView.useListView(fetcher as any, {
    selector: '#fltter',
    limit: 50,
  })

  return (
    <View>
      <View id='fltter' style={{ height: '100px', background: 'red', margin: '10px' }}></View>
      total：{listViewProps.pagination.total}
      <ListView {...listViewProps}>
        {listData.map((_, index) => (
          <View
            key={index}
            style={{
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {index}
          </View>
        ))}
      </ListView>
    </View>
  )
}
