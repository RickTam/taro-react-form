import { ScrollView, View } from '@tarojs/components'
import { FC, useCallback, useEffect, useState, useMemo } from 'react'
import classNames from 'classnames'
import Taro from '@tarojs/taro'
import useUUID from '../../hooks/useUUID'
import Popup from '../popup'
import type { Props as PopupProps } from '../popup'

export type PickerOptionType = { label?; value?; [key: string]: any }
export interface PickerProps extends Omit<PopupProps, 'placement' | 'existSafeArea' | 'width'> {
  /** 选中的数据 */
  value: number | string
  options: PickerOptionType[]
  autoClose?: boolean
  /** 字段映射关系, 可部分覆盖 */
  fieldMaps?: Partial<PickerOptionType>
  onChange: (value: string | number, option: PickerOptionType) => void
}

const Picker: FC<PickerProps> = (props) => {
  const { options, value, height = '50%', visible, autoClose, fieldMaps, onClose, onChange } = props

  const uuid = useUUID()
  const [paickerId, setPaickerId] = useState('')

  const mergedFieldMaps = useMemo<PickerOptionType>(() => {
    return {
      label: 'label',
      value: 'value',
      ...fieldMaps,
    }
  }, [fieldMaps])

  useEffect(() => {
    if (visible) {
      Taro.nextTick(() => {
        for (let i = 0; i < options.length; i++) {
          const item = options[i]
          if (process.env.TARO_ENV !== 'h5') {
            if (value || value === 0) {
              if (item[mergedFieldMaps.value] === value) {
                if (i > 1) {
                  setPaickerId('P' + uuid + options[i - 1][mergedFieldMaps.value])
                } else {
                  setPaickerId('P' + uuid + options[0][mergedFieldMaps.value])
                }
              }
            } else {
              setPaickerId('P' + uuid + options[0][mergedFieldMaps.value])
            }
          } else {
            setPaickerId('P' + uuid + value)
          }
        }
      })
    } else {
      setPaickerId('')
    }
  }, [uuid, value, options, visible, mergedFieldMaps])

  const tabClick = useCallback(
    (val: number | string, index: number) => {
      if (val === value) return
      onChange(options[index][mergedFieldMaps.value], options[index])
      autoClose && onClose()
    },
    [value, autoClose, options, mergedFieldMaps],
  )

  return (
    <Popup {...props} height={height}>
      <ScrollView
        scrollY
        scrollWithAnimation
        enhanced
        showScrollbar={false}
        scrollIntoView={paickerId}
        className='ygp-picker'
      >
        <View>
          {options?.map((item, index) => (
            <View
              id={'P' + uuid + item[mergedFieldMaps.value]}
              key={'P' + uuid + item[mergedFieldMaps.value]}
              className={classNames('item-content', {
                'ygp-picker-item-underline': item[mergedFieldMaps.value] === value,
              })}
              onClick={() => tabClick(item[mergedFieldMaps.value], index)}
            >
              <View>{item[mergedFieldMaps.label]}</View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Popup>
  )
}

Picker.displayName = 'Picker'

export default Picker
