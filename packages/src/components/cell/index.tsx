import { View, Image } from '@tarojs/components'
import { FC, useCallback, useMemo } from 'react'
import { ITouchEvent } from '@tarojs/components/types/common'
import classNames from 'classnames'

export type CellProps = {
  className?: string
  title?: string
  desc?: string
  arrow?: boolean
  border?: boolean
  onClick?: (event: ITouchEvent) => void
}

const Cell: FC<CellProps> = (props) => {
  const { children, className = '', title, desc, border = false, arrow = true, onClick } = props
  const cellClassName = useMemo(
    () =>
      classNames(
        'ygp-cell',

        className,
      ),
    [className],
  )

  const handleClick = useCallback(
    (event: ITouchEvent) => {
      onClick?.(event)
    },
    [onClick],
  )

  return (
    <View className={cellClassName} onClick={handleClick} hoverClass='hoverClass'>
      <View
        className={classNames('ygp-cell__container', {
          'ygp-cell-border': border,
        })}
      >
        <View className='ygp-cell__content'>
          <View className='ygp-cell__content-info'>
            <View className='ygp-cell__content-info__title'>{title}</View>
          </View>
        </View>
        <View className='ygp-cell__extra'>
          <View className='ygp-cell__extra-info'>{children ? children : desc}</View>
          {arrow ? (
            <Image
              className='ygp-cell__extra-icon'
              src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/arrow-right.png'
            ></Image>
          ) : null}
        </View>
      </View>
    </View>
  )
}

export default Cell
