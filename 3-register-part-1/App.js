import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './src/screens/LoginScreen'
import ChatRoomScreen from './src/screens/ChatRoomScreen'
import RegisterScreen from './src/screens/RegisterScreen'


const MainNavigator = createStackNavigator({
  LoginScreen: { screen: LoginScreen },
  ChatRoom: { screen: ChatRoomScreen },
  Register: { screen: RegisterScreen },
});

const App = createAppContainer(MainNavigator);

export default App;