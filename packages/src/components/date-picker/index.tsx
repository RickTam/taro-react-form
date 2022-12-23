import Taro from '@tarojs/taro'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import { FC, useCallback, useEffect, useState, useMemo } from 'react'
import Button from '../button'
import FooterArea from '../footer-area'
import Popup from '../popup'
import Tabs, { TabItemType } from '../tabs'
import Utils from '../../utils/date'
import type { Props as PopupProps } from '../popup'
import { isNumber } from '../../utils/is'

type dateType = string | Date

export interface DatePickerProps extends Omit<PopupProps, 'placement' | 'existSafeArea' | 'width'> {
  /** 选中的数据 */
  value?: dateType | dateType[]
  /** 是否数据改变自动关闭弹窗 */
  autoClose?: boolean
  /** 时间选择的类型，单选或范围选择, 默认为单个 */
  mode?: 'one' | 'range'
  /** 数据改变的回调 */
  onChange?: (date: string | string[]) => void
  /** 点击确认的回调事件 */
  onConfirm?: (date: string | string[]) => void
}

enum RangeDateEnum {
  start,
  end,
}

const DatePicker: FC<DatePickerProps> = (props) => {
  const { value, height = '50%', mode = 'one', autoClose, onClose, onConfirm, onChange } = props
  const [date, setDate] = useState<number[] | number[][] | undefined>(undefined)
  const [activeKey, setActivekey] = useState(RangeDateEnum.start)

  const years = useMemo(() => {
    const years: number[] = []
    // 获取当前年份
    let currentYear = new Date().getFullYear()
    // 十年前
    let minYear = currentYear - 10
    // 十年后
    let maxYear = currentYear + 10
    while (minYear < maxYear) {
      years.push(minYear)
      minYear++
    }
    return years
  }, [])

  const months = useMemo(() => Array.from({ length: 12 }).map((_, index) => index + 1), [])

  const getDays = useCallback(
    (type?) => {
      let curYear
      let curMonth
      if (mode === 'range') {
        if (date?.[type]) {
          curYear = years[date[type][0]]
          curMonth = months[date[type][1]]
        } else {
          curYear = years[0]
          curMonth = months[0]
        }
      } else {
        if (date) {
          curYear = years[(date as number[])[0]]
          curMonth = months[(date as number[])[1]]
        } else {
          curYear = years[0]
          curMonth = months[0]
        }
      }

      const monthDay = Utils.getMonthDays(curYear + '', curMonth + '')
      return Array.from({ length: monthDay }).map((_, index) => index + 1)
    },
    [date],
  )

  useEffect(() => {
    if (value) {
      if (mode === 'range') {
        let start = date2Index(value[RangeDateEnum.start])
        let end = date2Index(value[RangeDateEnum.end])
        setDate([start, end])
        setActivekey(RangeDateEnum.start)
      } else {
        setDate(date2Index(value))
      }
    } else {
      setDate(undefined)
      setActivekey(RangeDateEnum.start)
    }
  }, [value])

  const date2Index = useCallback((date) => {
    const newDate = new Date(date)
    const yearIdx = years.findIndex((item) => item === newDate.getFullYear())
    const monthIdx = months.findIndex((item) => item === newDate.getMonth() + 1)
    const dayIdx = getDays().findIndex((item) => item === newDate.getDate())
    return [yearIdx, monthIdx, dayIdx]
  }, [])

  const index2Str = useCallback((index: number[], type?) => {
    return `${years[index[0]]}-${Utils.getNumTwoBit(months[index[1]])}-${Utils.getNumTwoBit(
      getDays(type)[index[2]],
    )}`
  }, [])

  const confirm = useCallback(() => {
    let datestr
    if (date) {
      datestr = index2Str(date as number[])
    } else {
      datestr = date
    }
    onConfirm?.(datestr)
    onChange?.(datestr)
    autoClose && onClose?.()
  }, [date])

  const rangeConfirm = useCallback(() => {
    if (activeKey === RangeDateEnum.start) {
      if (date?.[RangeDateEnum.start]) {
        setActivekey(RangeDateEnum.end)
      } else {
        Taro.showToast({
          title: '请选择开始时间',
          icon: 'none',
        })
      }
    } else {
      // 如果没选择开始时间， 回到选择开始时间
      if (!date?.[RangeDateEnum.start]) {
        setActivekey(RangeDateEnum.start)
        return
      }
      if (date?.[RangeDateEnum.end]) {
        let startDate = index2Str(date[RangeDateEnum.start] as number[], RangeDateEnum.start)
        let endDate = index2Str(date[RangeDateEnum.end] as number[], RangeDateEnum.end)
        if (new Date(startDate).valueOf() > new Date(endDate).valueOf()) {
          Taro.showToast({
            title: '结束时间不能小于开始时间',
            icon: 'none',
          })
        } else {
          onConfirm?.([startDate, endDate])
          onChange?.([startDate, endDate])
          autoClose && onClose?.()
        }
      } else {
        Taro.showToast({
          title: '请选择结束时间',
          icon: 'none',
        })
      }
    }
  }, [date, activeKey])

  const onPickerChange = useCallback(
    (e, type) => {
      if (isNumber(type)) {
        if (type === RangeDateEnum.start) {
          setDate([e.detail.value])
        }
        if (type === RangeDateEnum.end) {
          setDate([date?.[RangeDateEnum.start], e.detail.value])
        }
      } else {
        setDate(e.detail.value)
      }
    },
    [date],
  )

  const renderPickerView = useCallback(
    (type?) => {
      const value = (mode === 'one' ? date : date?.[type]) as number[]
      const days = getDays(type)
      return (
        <View className='ygp-date-picker'>
          <PickerView
            value={value}
            indicatorClass='picker-column'
            className='ygp-picker-view'
            onChange={(e) => {
              onPickerChange(e, type)
            }}
          >
            <>
              {/* 年 */}
              <PickerViewColumn>
                {years?.map((item) => (
                  <View key={item} className='ygp-picker-item'>
                    {item}年
                  </View>
                ))}
              </PickerViewColumn>
              {/* 月 */}
              <PickerViewColumn>
                {months?.map((item) => (
                  <View key={item} className='ygp-picker-item'>
                    {item}月
                  </View>
                ))}
              </PickerViewColumn>
              <PickerViewColumn>
                {days?.map((item) => (
                  <View key={item} className='ygp-picker-item'>
                    {item}日
                  </View>
                ))}
              </PickerViewColumn>
            </>
          </PickerView>
        </View>
      )
    },
    [years, months, date],
  )

  const tabItems: TabItemType[] = useMemo(() => {
    return [
      {
        label: date?.[RangeDateEnum.start]
          ? index2Str(date?.[RangeDateEnum.start] as number[], RangeDateEnum.start)
          : '开始时间',
        key: RangeDateEnum.start,
        children: renderPickerView(RangeDateEnum.start),
      },
      {
        label: date?.[RangeDateEnum.end]
          ? index2Str(date?.[RangeDateEnum.end] as number[], RangeDateEnum.end)
          : '结束时间',
        key: RangeDateEnum.end,
        children: renderPickerView(RangeDateEnum.end),
      },
    ]
  }, [date])

  const onTabChange = useCallback((e) => {
    setActivekey(e.key)
  }, [])

  return (
    <Popup {...props} height={height}>
      <View>
        {mode === 'one' ? (
          renderPickerView()
        ) : (
          <Tabs
            activeKey={activeKey}
            items={tabItems}
            onChange={onTabChange}
            // 先把逻辑写了吧， 高度问题后面再处理
            style={{ height: '440px' }}
          ></Tabs>
        )}

        <FooterArea>
          {mode === 'one' && (
            <Button type='primary' full onClick={confirm}>
              确定
            </Button>
          )}
          {mode === 'range' && (
            <Button type='primary' full onClick={rangeConfirm}>
              {activeKey === RangeDateEnum.start ? '选择开始时间' : '确定'}
            </Button>
          )}
        </FooterArea>
      </View>
    </Popup>
  )
}

DatePicker.displayName = 'DatePicker'

export default DatePicker
