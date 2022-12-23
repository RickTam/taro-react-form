import InternalForm, { useForm } from './Form'
import InternalFormItem from './FormItem'

type InternalFormType = typeof InternalForm
type InternalFormItemType = typeof InternalFormItem
interface FormInterface extends InternalFormType {
  useForm: typeof useForm
  Item: InternalFormItemType
}

const Form = InternalForm as FormInterface

Form.useForm = useForm
Form.Item = InternalFormItem

export default Form
