import { View } from '@tarojs/components'
import { FormItemType, Form, Button, FooterArea } from 'taro-react-form'

import './index.less'

const items: FormItemType[] = [
  {
    name: 'name',
    label: '姓名',
    type: 'text',
    placeholder: '请输入',
    clear: true,
    required: true,
    onChange: (e) => {
      console.log('e123213', e)
    },
    onFocus: () => {
      console.log('onFocus')
    },
  },
  {
    name: 'number',
    label: '电话',
    required: true,
    validateTrigger: 'onBlur',
    rules: [
      {
        validator(_, value) {
          console.log('value111', value)
          if (value && value.length > 6 && value.length < 20) {
            return Promise.resolve()
          }
          return Promise.reject('长度6到20位')
        },
      },
    ],
    // onClear(){
    //   form.validateFields(['number'])
    // }
  },
  {
    name: 'textarea',
    label: '备注',
    type: 'textarea',
    showCount: true,
  },
  {
    name: 'product',
    labelSlot: <View style={{ fontWeight: 'bold' }}>新增商品</View>,
    label: '新增商品',
    required: true,
    layout: 'vertical',
    valueAlign: 'left',
    type: 'textarea',
    autoHeight: true,
    showCount: true,
    className: 'product',
    gap: true,
  },
  {
    name: 'switch',
    label: '开关',
    valueAlign: 'right',
    type: 'switch',
    required: true,
    clear: false,
  },
  {
    name: 'picker',
    label: '弹窗选择（有默认值）',
    type: 'picker',
    labelWidth: 200,
    required: true,
    title: '弹窗选择',
    options: [
      { name: '测试1', code: 0 },
      { name: '测试2', code: 1 },
      { name: '测试3', code: 2 },
      { name: '测试4', code: 3 },
      { name: '测试5', code: 4 },
      { name: '测试6', code: 5 },
    ],
    fieldMaps: { label: 'name', value: 'code' },
  },
  {
    name: 'picker2',
    label: '弹窗选择2',
    type: 'picker',
    required: true,
    title: '弹窗选择2',
    options: [
      { label: '测试1', value: 1 },
      { label: '测试2', value: 2 },
      { label: '测试3', value: 3 },
      { label: '测试4', value: '4' },
      { label: '测试5', value: '5' },
      { label: '测试6', value: '6' },
      { label: '测试7', value: '7' },
      { label: '测试8', value: '8' },
      { label: '测试9', value: '9' },
      { label: '测试10', value: '10' },
    ],
  },
  {
    name: 'checkbox',
    label: '复选按钮',
    type: 'checkbox',
    required: true,
    layout: 'vertical',
    options: [
      { name: '报价中', code: 0 },
      { name: '报价完成', code: 1 },
      { name: '待确认', code: 2 },
      { name: '内部完善中', code: 3 },
    ],
    fieldMaps: { label: 'name', value: 'code' },
    isMultiple: true,
  },
  {
    name: 'checkbox2',
    label: '复选按钮（默认值）',
    type: 'checkbox',
    required: true,
    columnNum: 3,
    layout: 'vertical',
    options: [
      { label: '报价中', value: 1 },
      { label: '报价完成', value: 2 },
      { label: '待确认', value: 3 },
    ],
    onChange: (e, item) => {
      console.log('e, item', e, item)
    },
    isMultiple: true,
  },
  {
    name: 'cascader',
    label: '地址',
    type: 'cascader',
    title: '选择地址',
    required: true,
    onChange: (value, selectedOptions, currentOption) => {
      console.log('value, selectedOptions, currentOption', value, selectedOptions, currentOption)
    },
    options: [
      {
        value: 'zhejiang',
        label: '浙江省',
        children: [
          {
            value: 'hangzhou',
            label: '杭州市',
            children: [
              {
                value: 'xihu',
                label: '西湖区',
              },
              {
                value: 'xiasha',
                label: '下沙区',
              },
            ],
          },
        ],
      },
      {
        value: 'guangdong',
        label: '广东省',
        children: [
          {
            value: 'guangzhou',
            label: '广州市',
            children: [
              {
                value: 'haizhu',
                label: '海珠区',
              },
            ],
          },
          {
            value: 'shenzheng',
            label: '深圳市',
            children: [
              {
                value: 'qianhai',
                label: '前海区',
              },
              {
                value: 'baoan',
                label: '宝安区',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'date',
    label: '日期',
    type: 'date',
    title: '选择时间',
    required: true,
  },
  {
    name: 'date1',
    label: '日期区间',
    type: 'date',
    mode: 'range',
    title: '选择时间区间',
    required: true,
    gap: true,
  },
  {
    name: 'custom',
    label: '自定义value区域内容',
    type: 'date',
    mode: 'range',
    layout: 'vertical',
    valueAlign: 'left',
    required: true,
    valueSlot: (value) => {
      return (
        <Button
          size='small'
          style={{
            backgroundColor: '#F6F6F6',
            color: '#333',
          }}
        >
          {value ? value.join('~') : '选择时间范围'}
        </Button>
      )
    },
  },
]

export default () => {
  const [form] = Form.useForm()

  return (
    <View>
      <Form
        form={form}
        valueAlign='right'
        initialValues={{
          upload: [
            {
              fileName: 'kskI5n7gNhhI29cb129aa38d139a3a1c14f42487883b.png',
              filePath:
                'https://qiniu-cdn-private-test.yigongpin.net/private/bciFmsCreditPCAccessory/2022-10-28/faf6d73910973c6f8f4467b0e1580883.png',
              fileSize: 907,
              fileType: 'image',
              type: 'image',
            },
          ],
          checkbox2: [1, 2],
          date: '2022-11-11',
        }}
        items={items}
      ></Form>
      <FooterArea>
        <Button
          full
          type='primary'
          onClick={() => {
            console.log('getFieldsValue', form.getFieldsValue())
          }}
        >
          获取数据
        </Button>
        &nbsp;&nbsp;
        <Button
          full
          onClick={async () => {
            console.log('validateFields', await form.validateFields())
          }}
        >
          校验
        </Button>
      </FooterArea>
    </View>
  )
}
