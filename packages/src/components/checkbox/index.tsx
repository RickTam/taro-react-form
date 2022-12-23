import { View } from '@tarojs/components'
import { CSSProperties, FC, useCallback, useMemo } from 'react'
import classNames from 'classnames'

export type CheckOptionType = { label?; value?; [key: string]: any }

export type CheckboxProps = {
  /** value 选中激活的key */
  value: (string | number)[]
  /** 指定一行几个元素 */
  columnNum?: 2 | 3 | 4
  /** 是否多选,默认:false */
  isMultiple?: boolean
  /** 选项列表 */
  options: CheckOptionType[]
  /** 自定义激活属性 */
  activeStyle?: CSSProperties
  /** 字段映射关系, 可部分覆盖 */
  fieldMaps?: Partial<CheckOptionType>
  /** 选择改变触发方法 */
  onChange: (active?: (number | string)[], option?: CheckOptionType) => void
}
/**
 * 按钮形式的checkbox
 */
const CheckBox: FC<CheckboxProps> = (props) => {
  const {
    isMultiple = false,
    options,
    onChange,
    value = [],
    columnNum = 4,
    activeStyle,
    fieldMaps,
  } = props

  const mergedFieldMaps = useMemo<CheckOptionType>(() => {
    return {
      label: 'label',
      value: 'value',
      ...fieldMaps,
    }
  }, [fieldMaps])

  const itemClick = useCallback(
    (item) => {
      if (!value.some((ac) => ac == item[mergedFieldMaps.value])) {
        if (!isMultiple) {
          onChange([item[mergedFieldMaps.value]], item)
        } else {
          onChange([...value, item[mergedFieldMaps.value]], item)
        }
      } else {
        let arr: (string | number)[] = []
        for (let i = 0; i < value.length; i++) {
          if (value[i] == item[mergedFieldMaps.value]) {
            arr = [...value]
            arr.splice(i, 1)
            break
          }
        }
        onChange(arr, item)
      }
    },
    [value],
  )

  return (
    <View className='btn-check-box'>
      {options?.map((item) => (
        <View
          key={item[mergedFieldMaps.value]}
          style={
            value.length && value.some((ac) => ac == item[mergedFieldMaps.value]) ? activeStyle : ''
          }
          className={classNames('check-item', `check-item-row-${columnNum}`, {
            'item-active': value.length && value.some((ac) => ac == item[mergedFieldMaps.value]),
          })}
          onClick={() => itemClick(item)}
        >
          {item[mergedFieldMaps.label]}
        </View>
      ))}
    </View>
  )
}

export default CheckBox
