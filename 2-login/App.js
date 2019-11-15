import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './src/screens/LoginScreen'
import ChatRoomScreen from './src/screens/ChatRoomScreen'

const MainNavigator = createStackNavigator({
  LoginScreen: { screen: LoginScreen },
  ChatRoom: { screen: ChatRoomScreen },
});

const App = createAppContainer(MainNavigator);

export default App;