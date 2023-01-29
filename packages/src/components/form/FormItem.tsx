import { View } from '@tarojs/components'
import classNames from 'classnames'
import { Field as RcField } from 'rc-field-form'
import type { FieldProps } from 'rc-field-form/es/Field'
import { cloneElement, FC, ReactElement, useContext, useMemo } from 'react'
import { FormContext, FormContextProps } from './context'

export interface FormItemProps extends FieldProps {
  label?: string
  className?: string
  required?: boolean
  children?: ReactElement
}

const InternalFormItem: FC<FormItemProps> = (props): ReactElement => {
  const {
    className,
    required,
    children,
    rules,
    trigger = 'onChange',
    label,
    ...formItemProps
  } = props
  const { valueAlign, labelWidth, layout, clickHover, hoverClass, hoverSustainTime, readonly } =
    useContext<FormContextProps>(FormContext)

  const formItemClassName = useMemo(() => classNames('ygp-form-item', className), [className])

  return (
    <RcField trigger={trigger} {...props}>
      {(control, renderMeta, context) => {
        const isRequired =
          required !== undefined
            ? required
            : !!(
                rules &&
                rules.some((rule) => {
                  if (rule && typeof rule === 'object' && rule.required && !rule.warningOnly) {
                    return true
                  }
                  if (typeof rule === 'function') {
                    const ruleEntity = rule(context)
                    return ruleEntity && ruleEntity.required && !ruleEntity.warningOnly
                  }
                  return false
                })
              )

        // 联合onChange事件
        const onChange = (...arg) => {
          control.onChange(...arg)
          children && children.props.onChange && children.props.onChange(...arg)
        }

        if (children) {
          const isError = !!renderMeta.errors.length
          const childProps = {
            ...control,
            ...formItemProps,
            label,
            valueAlign,
            labelWidth,
            readonly,
            layout,
            clickHover,
            hoverClass,
            hoverSustainTime,
            required: isRequired,
            error: isError,
            errorMsg: isError ? renderMeta.errors[0] : '',
            ...children.props, // children.props优先
            onChange,
          }

          return <View className={formItemClassName}>{cloneElement(children, childProps)}</View>
        }
      }}
    </RcField>
  )
}

export default InternalFormItem
