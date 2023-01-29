import { CSSProperties, FC } from 'react'
import Taro from '@tarojs/taro'
import { ButtonProps as TaroButtonProps } from '@tarojs/components/types/Button'
import { View, Button as TaroButton, Form } from '@tarojs/components'
import { BaseEventOrig, CommonEvent, ITouchEvent } from '@tarojs/components/types/common'
import classNames from 'classnames'
import { isFunction } from '../../utils/is'

export interface ButtonProps extends Omit<TaroButtonProps, 'size' | 'type'> {
  /**
   *按钮类型
   * @defalt default
   */
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  /**
   *自定义classname
   */
  className?: string
  /**
   * 是否填充背景
   * @default false
   */
  fill?: boolean
  /**
   * 自动充满父容器
   * @default false
   */
  full?: boolean
  /**
   * 按钮尺寸大小
   */
  size?: 'large' | 'normal' | 'small' | 'mini'
  /**
   * 是否圆角
   * @default normal
   */
  round?: string
  /**
   * 按钮颜色
   */
  color?: string
  /**
   * 按钮填充颜色
   */
  fillColor?: string
  /**
   * 是否使用边框
   */
  border?: boolean
  /**
   * 边框颜色
   */
  borderColor?: string
  /**
   * 按钮自定义圆角
   */
  radius?: number
  /**
   * 自定义样式对象
   */
  style?: CSSProperties
  /**
   * 设置按钮为禁用态（不可点击）
   */
  disabled?: boolean
}

const Button: FC<ButtonProps> = (props) => {
  const isWEB = Taro.getEnv() === Taro.ENV_TYPE.WEB
  const isWEAPP = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

  const {
    type = 'default',
    size = 'normal',
    className,
    radius = 0,
    fill,
    full,
    lang,
    round,
    disabled,
    formType,
    openType,
    color,
    border,
    borderColor,
    fillColor,
    style,
    sessionFrom,
    sendMessageTitle,
    sendMessagePath,
    sendMessageImg,
    showMessageCard,
    appParameter,
  } = props

  const rootClassName = [`ygp-button`, `ygp-button--${type}`]
  const classObject = {
    [`ygp-button--${size}`]: size,
    [`ygp-button--disabled`]: disabled,
    [`ygp-button--full`]: full,
    [`ygp-button--${round}`]: round,
    [`ygp-button--fill`]: fill,
    [`ygp-button--${type}--border`]: border && type,
    // 'slc-button__no-border': (fill || fillColor) && !borderColor,
  }

  const onClick = (event: ITouchEvent) => {
    if (!props.disabled) {
      isFunction(props.onClick) && props.onClick(event)
    }
  }

  const onGetUserInfo = (event: CommonEvent) => {
    isFunction(props.onGetUserInfo) && props.onGetUserInfo(event)
  }

  const onContact = (event: BaseEventOrig<TaroButtonProps.onContactEventDetail>) => {
    isFunction(props.onContact) && props.onContact(event)
  }

  const onGetPhoneNumber = (event: CommonEvent) => {
    isFunction(props.onGetPhoneNumber) && props.onGetPhoneNumber(event)
  }

  const onError = (event: CommonEvent) => {
    isFunction(props.onError) && props.onError(event)
  }

  const onOpenSetting = (event: CommonEvent) => {
    isFunction(props.onOpenSetting) && props.onOpenSetting(event)
  }

  const onSumit = (event: CommonEvent) => {
    if (isWEAPP || isWEB) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      $scope.triggerEvent('submit', event.detail, {
        bubbles: true,
        composed: true,
      })
    }
  }

  const onReset = (event: CommonEvent) => {
    if (isWEAPP || isWEB) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      $scope.triggerEvent('reset', event.detail, {
        bubbles: true,
        composed: true,
      })
    }
  }

  const selfColor: any = { color, borderColor, fillColor }
  if (fillColor && border) {
    selfColor.color = fillColor
    selfColor.borderColor = fillColor
    selfColor.fillColor = 'none'
  }
  if (fillColor && !border) {
    selfColor.color = '#fff'
    selfColor.border = 'none'
  }
  const borderColorObj = selfColor.borderColor ? { 'border-color': selfColor.borderColor } : {}
  const background = selfColor.fillColor ? { background: selfColor.fillColor } : {}
  const mergedStyle = {
    ...style,
    'border-radius': radius,
    color: selfColor.color,
    ...borderColorObj,
    ...background,
  }
  const webButton = <TaroButton className='ygp-button__wxbutton' lang={lang} formType={formType} />

  const button = (
    <TaroButton
      className='ygp-button__wxbutton'
      formType={formType}
      openType={openType}
      lang={lang}
      sessionFrom={sessionFrom}
      sendMessageTitle={sendMessageTitle}
      sendMessagePath={sendMessagePath}
      sendMessageImg={sendMessageImg}
      showMessageCard={showMessageCard}
      appParameter={appParameter}
      onGetUserInfo={onGetUserInfo}
      onGetPhoneNumber={onGetPhoneNumber}
      onOpenSetting={onOpenSetting}
      onError={onError}
      onContact={onContact}
    />
  )

  return (
    <View
      className={classNames(rootClassName, classObject, className)}
      onClick={onClick}
      style={mergedStyle}
    >
      {isWEB && !disabled && webButton}
      {isWEAPP && !disabled && (
        <Form onSubmit={onSumit} onReset={onReset}>
          {button}
        </Form>
      )}
      <View className='ygp-button__text'>{props.children}</View>
    </View>
  )
}

export default Button
