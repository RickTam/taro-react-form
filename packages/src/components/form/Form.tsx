import { forwardRef, ForwardRefRenderFunction, Fragment, useImperativeHandle, useMemo } from 'react'
import RcForm, { FormInstance, useForm } from 'rc-field-form'
import type { FormProps as RcFormProps } from 'rc-field-form/es/Form'
import { FieldProps as RcFieldProps } from 'rc-field-form/es/Field'
import { InputProps } from '@tarojs/components'
import classNames from 'classnames'
import FieldWrap from '../field/FieldWrap'
import FormItem, { FormItemProps } from './FormItem'
import { FieldLayout, FormContext, ValueAlign } from './context'
import Field, { FieldProps } from '../field'
import Textarea, { TextareaProps } from '../textarea'
import Swtich from '../switch'
import Picker, { PickerProps } from '../picker'
import Checkbox, { CheckboxProps } from '../checkbox'
import Cascader, { CascaderProps } from '../cascader'
import DatePicker, { DatePickerProps } from '../date-picker'

export type BaseFormItem = InputProps &
  RcFieldProps &
  FieldProps &
  FormItemProps &
  TextareaProps &
  Partial<PickerProps> &
  Partial<CheckboxProps> &
  Partial<CascaderProps> &
  Partial<DatePickerProps>
export interface FormItemType extends Omit<BaseFormItem, 'type' | 'onChange'> {
  type?:
    | InputProps['type']
    | 'textarea'
    | 'switch'
    | 'upload'
    | 'picker'
    | 'cascader'
    | 'checkbox'
    | 'date'
  //TODO 根据组件类型去推导onChange的类型
  onChange?: Function
}
export interface FormProps<V = any> extends Omit<RcFormProps<V>, 'form'> {
  name?: string
  /** 自定义className */
  className?: string
  /** 只读状态 */
  readonly?: boolean
  /** label宽度 */
  labelWidth?: number
  /** value对齐方式 */
  valueAlign?: ValueAlign
  /** useForm的返回值 */
  form?: FormInstance<V>
  /** 表单配置 */
  items?: FormItemType[]
  /** 布局,默认:horizontal */
  layout?: FieldLayout
  /** 是否需要点击hover,默认:true */
  clickHover?: boolean
  /** 自定义点击hover样式*/
  hoverClass?: string
  /** 点击hover展示到消失的持续时间(单位毫秒),默认600ms*/
  hoverSustainTime?: number
}

const InternalForm: ForwardRefRenderFunction<FormInstance, FormProps> = (props, ref) => {
  const {
    className = '',
    readonly,
    name,
    labelWidth,
    valueAlign,
    layout,
    clickHover,
    hoverClass,
    hoverSustainTime,
    form,
    items,
    children,
    // rc-field-form默认容器是form标签，
    // taro某些环境没有form模版导致form整体渲染失败，具体还不清楚为什么某些环境没有form模版
    // 把容器改为view做兼容处理
    component = 'view',
    ...restFormProps
  } = props

  const [wrapForm] = useForm(form)

  useImperativeHandle(ref, () => wrapForm)

  const formClassName = classNames('ygp-form', className)

  const formContextValue = useMemo(() => {
    return {
      name,
      readonly,
      valueAlign,
      labelWidth,
      form: wrapForm,
      layout,
      clickHover,
      hoverClass,
      hoverSustainTime,
      items,
    }
  }, [
    name,
    readonly,
    layout,
    clickHover,
    hoverClass,
    hoverSustainTime,
    valueAlign,
    labelWidth,
    wrapForm,
    items,
  ])

  // 通过配置渲染表单
  const renderFormItem = () => {
    return (
      <Fragment>
        {items?.map((item) => {
          const {
            name: formItemName,
            type,
            trigger,
            required,
            isLink,
            validateTrigger,
            ...restItemProps
          } = item
          let { rules, placeholder } = item
          let msgPrefix = '请输入'

          switch (type) {
            case 'checkbox':
            case 'switch':
            case 'cascader':
            case 'picker':
            case 'date':
              msgPrefix = '请选择'
              break
            case 'upload':
              msgPrefix = '请上传'
              break
          }

          if (!placeholder) {
            placeholder = msgPrefix
          }

          if (required) {
            if (
              rules &&
              !rules.every(
                (rule) => rule && typeof rule === 'object' && rule.required && !rule.warningOnly,
              )
            ) {
              // @ts-ignore
              rules = rules.concat([{ required: true, message: `${msgPrefix}${item.label || ''}` }])
            } else {
              rules = [{ required: true, message: `${msgPrefix}${item.label || ''}` }]
            }
          }
          let formItemChild
          const formItemChildProp = {
            ...restItemProps,
            placeholder,
            isLink,
            type,
          }

          switch (type) {
            case 'date':
              formItemChild = (
                <FieldWrap {...formItemChildProp} isLink renderLinkChild>
                  {/* @ts-ignore */}
                  <DatePicker autoClose></DatePicker>
                </FieldWrap>
              )
              break
            case 'checkbox':
              formItemChild = (
                <FieldWrap {...formItemChildProp}>
                  {/* @ts-ignore */}
                  <Checkbox></Checkbox>
                </FieldWrap>
              )
              break
            case 'switch':
              formItemChild = (
                <FieldWrap {...formItemChildProp}>
                  {(feildProps) => (
                    <Swtich
                      checked={feildProps.value}
                      disabled={feildProps.readonly}
                      {...feildProps}
                    />
                  )}
                </FieldWrap>
              )
              break
            case 'cascader':
              formItemChild = (
                <FieldWrap {...formItemChildProp} isLink renderLinkChild>
                  {/* @ts-ignore */}
                  <Cascader autoClose></Cascader>
                </FieldWrap>
              )
              break
            case 'picker':
              formItemChild = (
                <FieldWrap {...formItemChildProp} isLink renderLinkChild>
                  {/* @ts-ignore */}
                  <Picker autoClose></Picker>
                </FieldWrap>
              )
              break
            case 'textarea':
              formItemChild = (
                <FieldWrap {...formItemChildProp}>
                  <Textarea />
                </FieldWrap>
              )
              break
            default:
              formItemChild = <Field {...formItemChildProp} />
          }

          return (
            <FormItem
              key={formItemName}
              name={formItemName}
              rules={rules}
              trigger={trigger}
              validateTrigger={validateTrigger}
              required={required}
            >
              {formItemChild}
            </FormItem>
          )
        })}
      </Fragment>
    )
  }

  return (
    <FormContext.Provider value={formContextValue}>
      <RcForm
        id={name}
        component={component}
        {...restFormProps}
        name={name}
        form={wrapForm}
        className={formClassName}
      >
        {items ? renderFormItem() : children}
      </RcForm>
    </FormContext.Provider>
  )
}

const Form = forwardRef<FormInstance, FormProps>(InternalForm)

export { useForm }

export default Form
