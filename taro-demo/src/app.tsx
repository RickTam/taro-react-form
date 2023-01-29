import { ConfigProvider } from 'taro-react-form'
import 'taro-react-form/styles/index.less'
import './app.less'

const App = (props) => {
  return <ConfigProvider>{props.children}</ConfigProvider>
}

export default App
