import { ScrollView, Swiper, SwiperItem, View } from '@tarojs/components'
import { CSSProperties, FC, ReactNode, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import useUUID from '../../hooks/useUUID'

export type TabItemType = {
  /** 标题,可自定义节点 */
  label: string | ReactNode
  /** 激活key */
  key: number | string
  /** 展示内容 */
  children: ReactNode
}

type Props = {
  /** 当前激活的key */
  activeKey: number | string
  /** item配置 */
  items: TabItemType[]
  /** tab左边自定义按钮 */
  tabLeftBtn?: ReactNode | string
  /** tab右边自定义按钮 */
  tabRightBtn?: ReactNode | string
  /** tabItme样式 */
  tabItemClass?: string
  /** 由于组件宽度无法确定,需要添加滚动显示向前索引数,如tabItem显示5个,则索引向前2,则当前选择值是第三个则会显示在中间,默认值3 */
  scrollIntoViewNumber?: number
  className?: string
  style?: CSSProperties | string
  onChange: (item: TabItemType) => void
}
const Tabs: FC<Props> = (props) => {
  const {
    activeKey,
    items = [],
    className = '',
    tabItemClass,
    scrollIntoViewNumber = 2,
    style,
    tabLeftBtn,
    tabRightBtn,
    onChange,
  } = props
  const uuid = useUUID()
  const [tabID, setTabID] = useState('T' + uuid + items[0].key)
  const [childIndex, setChildIndex] = useState(0)

  useEffect(() => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.key === activeKey) {
        if (i > scrollIntoViewNumber) {
          setTabID('T' + uuid + items[i - scrollIntoViewNumber].key)
        } else {
          setTabID('T' + uuid + items[0].key)
        }
        setChildIndex(i)
        return
      }
    }
  }, [activeKey, uuid])

  const tabClick = useCallback(
    (key: number | string, index: number) => {
      if (key === activeKey) return
      onChange(items[index])
    },
    [activeKey],
  )

  const onSwiperChange = useCallback(
    (e) => {
      if (items[e.detail.current].key === activeKey) return
      onChange(items[e.detail.current])
    },
    [activeKey],
  )
  return (
    <View className={classNames('ygp-tab', className)} style={style} id={uuid}>
      {/* tab */}
      <View style={{ display: 'flex' }}>
        {tabLeftBtn}
        <ScrollView
          scrollX
          scrollWithAnimation
          enhanced
          showScrollbar={false}
          scrollIntoView={tabID}
          className='ygp-tab-btn'
        >
          <View className='ygp-tab-btn-items'>
            {items.map((item, index) => (
              <View
                id={'T' + uuid + item.key}
                className='ygp-tab-btn-item'
                key={'T' + uuid + item.key}
              >
                <View
                  className={classNames('item-content', {
                    'ygp-tab-btn-underline': item.key === activeKey,
                    tabItemClass,
                  })}
                  style={{ height: '100%' }}
                  onClick={() => tabClick(item.key, index)}
                >
                  {item.label}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {tabRightBtn}
      </View>
      {/* children */}
      <Swiper
        current={childIndex}
        className='ygp-tab-children-scroll-view'
        onChange={onSwiperChange}
      >
        {items.map((item) => (
          <SwiperItem
            className='ygp-tab-children'
            key={'C' + uuid + item.key}
            style={{ overflowY: 'auto' }}
          >
            {item.children}
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}

export default Tabs
