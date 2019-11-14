import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import getDatabase from '../libs/firebase/getDatabase'
import setDatabase from '../libs/firebase/setDatabase'
import ChatList from '../sections/ChatList'
import logout from '../libs/firebase/logout'

class ChatRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chat room',
    headerRight: () => (
      <TouchableHighlight onPress={() => {
        navigation.navigate('AddFriend')
      }} style={{ marginLeft: -50 }} >
        <Ionicons name="md-person-add" size={32} color="#333" />
      </TouchableHighlight>
    ),
    headerLeft: () => (
      <TouchableHighlight onPress={() => {
        logout().then((data) => {
          navigation.replace('LoginScreen')
        })
        .catch((error) => {
          console.log(error)
          alert('user ไม่ถูกต้อง')
        })
        }}>
        <Text>Logout</Text>
      </TouchableHighlight>
    ),
  })

  componentWillMount = async () => {
    this.getData()
  }

  getData = () => {
    getDatabase('users/4', (data) => {
      console.log(data)
    })
  }

  addData = () => {
    setDatabase('users/4', {
      username: 'karn99',
      email: 'karn5@mail.com',
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      // <Button title="Go to Jane's profile" onPress={() => navigate('ChatRoom', { name: 'Jane' })} />
      <View style={{ width: '100%', height: '100%' }}>
        {/* <Button title="Add user" onPress={this.addData} /> */}
        <ChatList />
      </View>
    )
  }
}

export default ChatRoomScreen
