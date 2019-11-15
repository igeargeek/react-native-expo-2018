import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import getDatabase from '../libs/firebase/getDatabase'
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

  getChatData = async () => {
    await getDatabase(`friends/${user.currentUser.uid}`, (data) => {
      const promise = Object.keys(data).map((friendId) => {
        return new Promise((resolve) => {
          getDatabase(`users/${friendId}`, (friend) => {
            resolve({
              chatId: data[friendId].chatRoomID,
              uid: friend.uid,
              name: friend.name,
              avatar: friend.avatar,
              pushToken: friend.pushToken,
            })
          })
        })
      })
      Promise.all(promise).then((chatData) => {
        this.setState({ chatData })
      })
    })
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <ChatList navigation={navigation} chatData={this.state.chatData} />
      </View>
    )
  }
}

export default ChatRoomScreen
