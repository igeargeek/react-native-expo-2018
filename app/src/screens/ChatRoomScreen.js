import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import getDatabase from '../libs/firebase/getDatabase'
import setDatabase from '../libs/firebase/setDatabase'
import ChatList from '../sections/ChatList'
import logout from '../libs/firebase/logout'
import user from '../libs/firebase/getUserInfo'

class ChatRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chat room',
    headerRight: () => (
      <TouchableHighlight onPress={() => {
        navigation.navigate('AddFriend')
      }} style={{ padding: 10 }} >
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
        }} style={{ padding: 10 }} >
        <Text>Logout</Text>
      </TouchableHighlight>
    ),
  })

  state = { 
    userInfo: {},
    chatData: []
  }

  componentDidMount() {
    this.getUserData()
    this.getChatData()
  }

  getUserData = () => {
    getDatabase(`users/${user.currentUser.uid}`, (data) => {
      this.setState({
        userInfo: data
      })
    })
  }

  getChatData = () => {
    getDatabase(`chatRooms/${user.currentUser.uid}`, (data) => {
      let result = Object.keys(data).map(function(key) {
        return {...data[key], chatId: key};
      });

      this.setState({
        chatData: result
      })
    })
  }

  addData = () => {
    setDatabase('users/4', {
      username: 'karn99',
      email: 'karn5@mail.com',
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      // <Button title="Go to Jane's profile" onPress={() => navigate('ChatRoom', { name: 'Jane' })} />
      <View style={{ width: '100%', height: '100%' }}>
        {/* <Button title="Add user" onPress={this.addData} /> */}
        <ChatList navigation={navigation} chatData={this.state.chatData} />
      </View>
    )
  }
}

export default ChatRoomScreen
