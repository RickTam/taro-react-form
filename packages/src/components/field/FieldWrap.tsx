import {
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  isValidElement,
  cloneElement,
  useState,
} from 'react'
import { View, Label, Image } from '@tarojs/components'
import classNames from 'classnames'
import { isArray, isFunction, isDate, isNullOrUnDef } from '../../utils/is'
import { FieldProps } from './Field'
import Utils from '../../utils/date'

interface FieldWrapType extends Omit<FieldProps, 'onChange' | 'type'> {
  options?: any[]
  renderLinkChild?: boolean
  onChange?: Function
  [key: string]: any
}

const FieldWrap: FC<FieldWrapType> = (props) => {
  const {
    value,
    label,
    className,
    required,
    readonly,
    labelWidth = 80,
    isLink,
    error,
    errorMsg,
    placeholder,
    labelSlot,
    rightSlot,
    valueSlot,
    style,
    layout = 'horizontal',
    labelAlign = 'left',
    valueAlign = layout === 'horizontal' ? 'right' : 'left',
    clickHover = true,
    hoverClass,
    hoverSustainTime = 300,
    children,
    clear = true,
    onChange,
    onClear,
    onClick,
    // picker相关
    options,
    renderLinkChild,
    fieldMaps,
    mode,
    gap,
    ...restFieldProps
  } = props

  const [visible, setVisible] = useState(false)

  const mergedFieldMaps = useMemo(() => {
    return {
      label: 'label',
      value: 'value',
      children: 'children',
      ...fieldMaps,
    }
  }, [fieldMaps])

  const fieldClassName = useMemo(() => {
    return classNames(
      'ygp-field',
      {
        'ygp-field-error': error,
        'ygp-field-required': required,
        'ygp-field-gap': gap,
      },
      className,
    )
  }, [className, error, required])

  const labelStyle = useMemo(() => {
    return {
      width: `${labelWidth}px`,
      textAlign: labelAlign,
    }
  }, [labelAlign, labelWidth])

  const valueStyle = useMemo(() => {
    return {
      textAlign: valueAlign,
    }
  }, [valueAlign])

  const rightContent = useMemo(() => {
    if (!rightSlot) {
      return false
    }
    if (isFunction(rightSlot)) {
      return rightSlot()
    }
    return rightSlot
  }, [rightSlot])

  const valueContent = useMemo(() => {
    if (valueSlot) {
      if (isFunction(valueSlot)) {
        return valueSlot(value)
      } else {
        return valueSlot
      }
    } else {
      return false
    }
  }, [valueSlot, value])

  const labelCotent = useMemo(() => {
    if (labelSlot) {
      if (isFunction(labelSlot)) {
        return labelSlot()
      } else {
        return labelSlot
      }
    } else {
      return label
    }
  }, [label, labelSlot])

  const handleClick = useCallback(
    (e) => {
      if (!readonly) {
        onClick?.(e)
        setVisible(true)
      }
    },
    [readonly, children],
  )

  const handleClear = useCallback((e) => {
    // @ts-ignore
    onChange?.(undefined)
    onClear?.(e)
  }, [])

  const getCascaderValue = useCallback((val, data) => {
    let text = ''
    isArray(val) &&
      val?.forEach((el) => {
        let option = data.find((item) => item[mergedFieldMaps.value] === el)
        if (option) {
          text += option[mergedFieldMaps.label]
          if (option[mergedFieldMaps.children]) data = option[mergedFieldMaps.children]
        }
      })
    return text
  }, [])

  const getValue = useCallback(() => {
    let val: any = value
    // 如果有options,匹配name
    if (!isNullOrUnDef(val)) {
      // @ts-ignore
      switch (children.type.displayName) {
        case 'Cascader':
          val = getCascaderValue(value, options)
          break
        case 'Picker':
          let option = options?.find((item) => item[mergedFieldMaps.value] === value)
          val = option?.[mergedFieldMaps.label]
          break
        case 'DatePicker':
          // 时间范围选择
          if (mode === 'range') {
            let start = val[0]
            let end = val[1]
            val = [
              isDate(start) ? Utils.date2Str(start) : start,
              isDate(end) ? Utils.date2Str(end) : end,
            ].join('~')
          } else {
            // 判断是否是日期类型， 如果是日期类型转为字符串
            if (isDate(value)) {
              val = Utils.date2Str(value)
            }
          }
          break
      }
    }
    return readonly ? val : val || placeholder
  }, [readonly, options, value, mode])

  const renderLink = useCallback<() => ReactNode>(
    () => (
      <View className='ygp-field-content__value-inner__control-link'>
        <View
          className={classNames('ygp-field-content__value-inner__control-link-content', {
            placeholder: isNullOrUnDef(value),
          })}
        >
          {getValue()}
        </View>
        {!readonly && (
          <Image
            className='ygp-field-content__value-inner__control-link-arrow'
            src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/arrow-right.png'
          ></Image>
        )}
      </View>
    ),
    [value, placeholder, readonly, renderLinkChild, visible, options],
  )

  const renderChild = () => {
    const childProps = {
      value,
      placeholder,
      readonly,
      onChange,
      options,
      visible,
      onClose: () => {
        setVisible(false)
      },
      fieldMaps,
      mode,
      ...restFieldProps,
    }
    if (isFunction(children)) {
      return children(childProps)
    } else if (isValidElement(children)) {
      return cloneElement(children as ReactElement, { ...childProps, ...children.props })
    } else {
      console.warn('children of FieldWrap is not valid ReactElement.')
    }
  }

  const renderFieldContent = () => {
    let childNode: ReactNode
    // 如果是link状态， 直接渲染link样式
    if (isLink) {
      childNode = renderLink()
    } else {
      childNode = renderChild()
    }
    return childNode
  }

  return (
    <View
      className={fieldClassName}
      hoverClass={clickHover ? (hoverClass ? hoverClass : 'hoverClass') : 'none'}
      hoverStayTime={hoverSustainTime}
      style={{
        transition: hoverSustainTime / 2 + 'ms',
        ...style,
      }}
    >
      <View className={classNames('ygp-field-content', `ygp-field-content-${layout}`)}>
        <View className='ygp-field-content__label' style={labelStyle}>
          <Label>{labelCotent}</Label>
        </View>
        <View className='ygp-field-content__value' style={valueStyle}>
          <View className='ygp-field-content__value-inner'>
            <View
              className={classNames(
                'ygp-field-content__value-inner__control',
                `ygp-field-content__value-inner__control-${valueAlign}`,
              )}
              onClick={handleClick}
            >
              {valueContent ? valueContent : renderFieldContent()}
            </View>
            {clear && !readonly && !isNullOrUnDef(value) && (
              <Image
                className='ygp-field-content__value-inner__control-clear'
                src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/close.png'
                onClick={handleClear}
              />
            )}
            {rightContent && (
              <View className='ygp-field-content__value-inner__right'>{rightContent}</View>
            )}
          </View>
          {error && <View className='ygp-field-content__value-error'>{errorMsg || ''}</View>}
        </View>
      </View>
      {renderLinkChild && renderChild()}
    </View>
  )
}

export default FieldWrap
