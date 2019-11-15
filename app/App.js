import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import LoginScreen from './src/screens/LoginScreen'
import ChatScreen from './src/screens/ChatScreen'
import ChatRoomScreen from './src/screens/ChatRoomScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import AddFriendScreen from './src/screens/AddFriendScreen'
import CameraScreen from './src/screens/CameraScreen'

const MainNavigator = createStackNavigator({
  LoginScreen: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Profile: { screen: ProfileScreen },
  AddFriend: { screen: AddFriendScreen },
  ChatRoom: { screen: ChatRoomScreen },
  Chat: { screen: ChatScreen },
  Camera: { screen: CameraScreen}
});

const App = createAppContainer(MainNavigator);

export default App;