import { CSSProperties, FC, useMemo } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { useSafeBottom } from '../../hooks'

type FooterButton = {
  // id
  id?: string
  // 自定义class
  className?: string
  // 背景是否透明, 默认false
  transparent?: boolean
  // 自定义style
  style?: CSSProperties
}

const FooterArea: FC<FooterButton> = (props) => {
  const { children, className, transparent = false, style, id } = props
  const { safeAreaPadding: paddingBottom, safeBottom } = useSafeBottom()

  const classes = useMemo(
    () =>
      classNames('ygp-footer-area', {
        'ygp-footer-area-transparent': transparent,
      }),
    [transparent],
  )

  const fixedClasses = useMemo(() => classNames('ygp-footer-area-fixed', className), [])

  return (
    <View className={classes} style={{ ...(safeBottom ? paddingBottom : null) }}>
      <View
        id={id}
        className={fixedClasses}
        style={{ ...(safeBottom ? paddingBottom : null), ...style }}
      >
        {children}
      </View>
    </View>
  )
}

export default FooterArea
