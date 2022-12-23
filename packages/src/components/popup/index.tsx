import { View, Image } from '@tarojs/components'
import { CSSProperties, FC, ReactNode, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import Taro from '@tarojs/taro'

export type Props = {
  /** 头部标题 */
  title?: string
  /** 点击阴影遮罩是否关闭,默认为true */
  closeOnclickOverlay?: boolean
  /** 标题对齐位置, 默认:center*/
  titleAlign?: 'center' | 'left'
  /** 弹框位置:默认为bottom*/
  placement?: 'bottom' | 'right' | 'top'
  /** 是否显示,默认为false */
  visible: boolean
  /** 存在安全区,仅在placement为top时候生效,用于自定义导航头,默认为:false */
  existSafeArea?: boolean
  /** 自定义头部节点 */
  headerSlot?: ReactNode
  /**弹框高度,仅在placement为bottom时生效,默认为 60% */
  height?: string
  /**弹框宽度,仅在placement为right时生效,默认为 80% */
  width?: string
  /** 弹框过度动画时间(单位秒),默认为0.3S */
  transitionTime?: number
  /** 头部左边自定义按钮 */
  headerLeft?: ReactNode
  /** 关闭回调事件 */
  onClose: (...p: any) => any
  style?: CSSProperties
  className?: string
}
const Popup: FC<Props> = (props) => {
  const {
    title,
    closeOnclickOverlay = true,
    titleAlign = 'center',
    className,
    placement = 'bottom',
    height = '60%',
    width = '80%',
    transitionTime = 0.3,
    existSafeArea = false,
    visible,
    headerLeft,
    onClose,
    style = {},
    children,
    headerSlot,
  } = props
  const closeOnclickOverlayClick = useCallback(() => {
    closeOnclickOverlay && onClose && onClose()
  }, [])
  const [popupStyle, setPopupStyle] = useState<CSSProperties>({})
  const [isShow, setIsShow] = useState(false)
  useEffect(() => {
    const pStyle: CSSProperties = { transition: `transform ${transitionTime}s` }
    if (placement === 'top' || placement === 'bottom') {
      pStyle.height = height
    } else if (placement === 'right') {
      pStyle.width = width
    }
    if (visible) {
      setIsShow(visible)
      Taro.nextTick(() => {
        Taro.nextTick(() => {
          pStyle.transform = 'translate(0,0)'
          setPopupStyle(pStyle)
        })
      })
    } else {
      if (placement === 'bottom') {
        pStyle.transform = 'translate(0,100%)'
      } else if (placement === 'top') {
        pStyle.transform = 'translate(0,-100%)'
      } else if (placement == 'right') {
        pStyle.transform = 'translate(100%,0)'
      }
      setPopupStyle(pStyle)
      setTimeout(() => {
        setIsShow(visible)
      }, transitionTime * 1000)
    }
  }, [visible])

  return (
    <View
      className='popup-box'
      style={{ display: isShow ? 'block' : 'none' }}
      // 解决穿透问题
      catchMove
      onClick={closeOnclickOverlayClick}
    >
      <View
        style={{ ...style, ...popupStyle }}
        className={classNames('popup-main', `placement-${placement}`, className)}
        onClick={(e) => e.stopPropagation()}
      >
        {headerSlot || (
          <View className='popup-header'>
            {titleAlign == 'center' && <View className='popup-header-operation'>{headerLeft}</View>}
            <View className='popup-header-title'>{title}</View>
            <View className='popup-header-operation'>
              <Image
                className='close-icon'
                src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/common-close.png'
                onClick={onClose}
              ></Image>
            </View>
          </View>
        )}
        <View className='popup-content'>{children}</View>
      </View>
    </View>
  )
}

export default Popup
