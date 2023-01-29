import { Input, InputProps, CommonEventFunction } from '@tarojs/components'
import { FC } from '@tarojs/taro'
import { CSSProperties, ReactElement, ReactNode } from 'react'
import { FieldLayout, ValueAlign } from '../form/context'
import { isNumber } from '../../utils/is'
import FieldWrap from './FieldWrap'

export interface FieldProps extends InputProps {
  type?: any
  /** 自定义className */
  className?: string
  /** label文案 */
  label?: string
  /** label宽度 */
  labelWidth?: number
  /** label对齐方式 */
  labelAlign?: ValueAlign
  /** value对齐方式 */
  valueAlign?: ValueAlign
  /** 只读状态 */
  readonly?: boolean
  /** 是否需要清除功能 */
  clear?: boolean
  /** 是否必填 */
  required?: boolean
  /** 如果为true，则渲染可点击区域和箭头 */
  isLink?: boolean
  /** 数据是否出错 */
  error?: boolean
  /** 错误文案 */
  errorMsg?: string
  /** label插槽 */
  labelSlot?: ReactNode
  /** 右边插槽 */
  rightSlot?: ReactNode
  /** value区域插槽 */
  valueSlot?: ReactNode
  /** 自定义样式 */
  style?: CSSProperties
  /** 数字精度， type为number或digit时才生效 */
  precision?: number
  /** 最小值， type为number或digit时才生效 */
  min?: number
  /** 最大值， type为number或digit时才生效 */
  max?: number
  /** 布局,默认:horizontal */
  layout?: FieldLayout
  /** 是否需要点击hover,默认:true */
  clickHover?: boolean
  /** 自定义点击hover样式 */
  hoverClass?: string
  /** 点击hover展示到消失的持续时间(单位毫秒),默认600ms*/
  hoverSustainTime?: number
  /** 字段间的下边距， 默认false*/
  gap?: boolean
  /** value改变时的回调 */
  // onChange?: CommonEventFunction<InputProps.inputEventDetail>
  // TODO 根据类型推导 先解决报错 后面再处理
  onChange?: Function
  /** 点击清除按钮的回调 */
  onClear?: CommonEventFunction
  /** 点击field区域的回调 */
  onClick?: CommonEventFunction
}

const Field: FC<FieldProps> = (props): ReactElement => {
  const { type, min, max, precision, readonly } = props
  return (
    <FieldWrap {...props}>
      {(fieldProps) => {
        const { value, onChange, onBlur, ...restFieldProps } = fieldProps
        const handelBlur = (e) => {
          // 如果是数字类型
          if (e.detail.value && (type === 'number' || type === 'digit')) {
            const num = Number(e.detail.value)
            if (Number.isFinite(num)) {
              if (isNumber(min) && num < min) {
                e.detail.value = min + ''
              } else if (isNumber(max) && num > max) {
                e.detail.value = max + ''
              } else {
                if (isNumber(precision)) {
                  e.detail.value = Number(num.toFixed(precision))
                } else {
                  e.detail.value = num
                }
              }
            } else {
              e.detail.value = undefined
            }
            onChange?.(e)
          }
          onBlur?.(e)
        }
        return (
          <>
            {readonly ? (
              value
            ) : (
              <Input
                value={value}
                type={type}
                {...restFieldProps}
                onBlur={handelBlur}
                onInput={onChange}
                style={{ height: '100%', width: '100%' }}
              />
            )}
          </>
        )
      }}
    </FieldWrap>
  )
}

export default Field
