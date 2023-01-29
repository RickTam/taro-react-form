import { FC, useEffect, useState, useCallback, useMemo } from 'react'
import { View, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { isArray } from '../../utils/is'
import Popup from '../popup'
import type { Props as PopupProps } from '../popup'

type CascaderOptionType = {
  label?
  value?
  children?
  [key: string]: any
}

export interface CascaderProps
  extends Omit<PopupProps, 'placement' | 'existSafeArea' | 'width' | 'height'> {
  value?: (string | number)[]
  className?: string
  options: CascaderOptionType[]
  fieldMaps?: CascaderOptionType
  autoClose?: boolean
  poppable?: boolean
  onChange?: (
    value: (string | number)[] | undefined,
    selectedOptions: CascaderOptionType[],
    currentOption: Object,
  ) => void
}

const Cascader: FC<CascaderProps> = (props) => {
  const {
    value,
    className,
    options,
    fieldMaps,
    poppable = true,
    autoClose = false,
    visible,
    onClose,
    onChange,
  } = props
  const [selected, setSeleted] = useState<CascaderOptionType[] | undefined>(undefined)
  const [renderOptions, setRenderOptions] = useState<CascaderOptionType[]>([])
  const [hasChild, setHasChild] = useState<boolean>(true)

  const mergedFieldMaps = useMemo(() => {
    return {
      label: 'label',
      value: 'value',
      children: 'children',
      ...fieldMaps,
    }
  }, [])

  useEffect(() => {
    if (visible) {
      if (value?.length && value.every((v) => v)) {
        const selectedOpts = getSelected(value, options)
        setRenderOptions(selectedOpts[selectedOpts.length - 2][mergedFieldMaps.children])
        setSeleted(selectedOpts)
        setHasChild(false)
      } else {
        setRenderOptions(options)
        setHasChild(true)
        setSeleted(undefined)
      }
    }
  }, [visible, value])

  const getSelected = useCallback((val, data) => {
    let arr: any = []
    val?.forEach((el) => {
      let option = data.find((item) => item[mergedFieldMaps.value] === el)
      if (option) {
        arr.push(option)
        if (option[mergedFieldMaps.children]) data = option[mergedFieldMaps.children]
      }
    })
    return arr
  }, [])

  useEffect(() => {
    setRenderOptions(options)
  }, [])

  const onClick = useCallback(
    (item) => {
      let selectedOpts = selected || []
      const children = item[mergedFieldMaps.children]
      if (children && isArray(children) && children.length) {
        setRenderOptions(children)
        setHasChild(true)
        selectedOpts = selectedOpts.concat([item])
      } else {
        let lastIndex = selectedOpts.length - 1
        let lastEl = selectedOpts[lastIndex]
        let lastChildren = lastEl[mergedFieldMaps.children]
        if (lastChildren && isArray(lastChildren) && lastChildren.length) {
          selectedOpts = selectedOpts?.concat([item])
        } else {
          selectedOpts.splice(lastIndex, 1, item)
        }
        setHasChild(false)
        const val = selectedOpts.map((e) => e[mergedFieldMaps.value])
        onChange?.(val, selectedOpts, item)
        autoClose && onClose?.()
      }
      setSeleted(selectedOpts)
    },
    [onChange, selected, autoClose],
  )

  const onTabClick = useCallback(
    (index) => {
      if (index === 0) {
        setRenderOptions(options)
        setSeleted(undefined)
        setHasChild(true)
      } else {
        // @ts-ignore
        const children = selected[index - 1][mergedFieldMaps.children]
        setRenderOptions(children as CascaderOptionType[])
        setSeleted(selected?.splice(0, index))
        setHasChild(true)
      }
    },
    [options, selected],
  )

  const cascaderClassName = useMemo(() => classnames('ygp-cascader', className), [className])

  const renderChild = useMemo(() => {
    return (
      <View className={cascaderClassName}>
        <View className='ygp-cascader__tab'>
          {selected?.map((item, index) => {
            return (
              <View
                key={item[mergedFieldMaps.value]}
                className={classnames('ygp-cascader__tab-item', {
                  active: !hasChild && selected.length - 1 === index,
                })}
                onClick={() => onTabClick(index)}
              >
                {item[mergedFieldMaps.label]}
              </View>
            )
          })}
          {hasChild && <View className='ygp-cascader__tab-item active'>请选择</View>}
        </View>
        <View className='ygp-cascader__panel'>
          <ScrollView style={{ height: '300px' }} scrollY>
            {renderOptions.map((item) => {
              return (
                <View
                  key={item[mergedFieldMaps.value]}
                  className='ygp-cascader__panel-option'
                  onClick={() => onClick(item)}
                >
                  {item[mergedFieldMaps.label]}
                </View>
              )
            })}
          </ScrollView>
        </View>
      </View>
    )
  }, [selected, mergedFieldMaps, hasChild, renderOptions])

  return poppable ? (
    <Popup {...props} visible={visible} height='auto'>
      {renderChild}
    </Popup>
  ) : (
    renderChild
  )
}
Cascader.displayName = 'Cascader'

export default Cascader
