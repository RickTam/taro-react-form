import { createContext } from 'react'
import { FormInstance } from 'rc-field-form'

export type ValueAlign = 'left' | 'right'

export type FieldLayout = 'vertical' | 'horizontal'
export interface FormContextProps {
  name?: string
  valueAlign?: ValueAlign
  labelWidth?: number
  readonly?: boolean
  form?: FormInstance
  /** 布局,默认:horizontal */
  layout?: FieldLayout
  /** 是否需要点击hover,默认:true */
  clickHover?: boolean
  /** 自定义点击hover样式 */
  hoverClass?: string
  /** 点击hover展示到消失的持续时间(单位毫秒),默认600ms*/
  hoverSustainTime?: number
}

export const FormContext = createContext<FormContextProps>({
  valueAlign: 'right',
  labelWidth: 80,
})
