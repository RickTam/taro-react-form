import {
  View,
  Textarea as TaroTextarea,
  TextareaProps as TaroTextareaProps,
  CommonEventFunction,
} from '@tarojs/components'
import classNames from 'classnames'
import { FC, useCallback } from 'react'

export interface TextareaProps extends TaroTextareaProps {
  className?: string
  showCount?: boolean
  readonly?: boolean
  onChange?: CommonEventFunction<TaroTextareaProps.onInputEventDetail>
}

const Textarea: FC<TextareaProps> = (props) => {
  const { value, maxlength = 140, className, showCount, readonly = false, onChange } = props

  const TextareaClassname = classNames('ygp-textarea', className)

  const handleInput = useCallback((e) => {
    onChange?.(e)
  }, [])

  return readonly ? (
    <View>{value}</View>
  ) : (
    <View className={TextareaClassname}>
      <TaroTextarea onInput={handleInput} {...props}></TaroTextarea>
      {showCount && (
        <View className='ygp-textarea-count'>
          {value ? value.length : 0}/{maxlength}
        </View>
      )}
    </View>
  )
}

export default Textarea
