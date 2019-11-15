import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Container from '../components/Container'
import pushDatabase from '../libs/firebase/pushDatabase'
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'
import getFirebaseClient from '../libs/firebase/getClient'
import { sendPushNotification } from '../libs/notification'

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  }

  state = {
    database: null,
    loading: true,
    messages: [],
    chatId: '',
    user: null,
    friend: null
  }

  componentDidMount = async () => {
    const chatId = this.props.navigation.getParam('chatId', '')
    const friend = {
      uid: this.props.navigation.getParam('uid', ''),
      avatar: this.props.navigation.getParam('avatar', ''),
      name: this.props.navigation.getParam('name', ''),
      pushToken: this.props.navigation.getParam('pushToken', ''),
    }
    const { initFirebase } = getFirebaseClient()
    const database = initFirebase.database()
    await this.setState({ database, chatId, friend })
    this.watchMessage()
    this.getUser()
  }

  getUser = () => {
    const { database } = this.state
    onAuthStateChanged()
      .then(async (userTemp) => {
        if (userTemp) {
          const doc = `users/${userTemp.uid}`
          database.ref(doc).once('value')
            .then(async (snapshot) => {
              const temp = snapshot.val()
              const user = {
                uid: userTemp.uid,
                ...temp,
              }
              await this.setState({ user })
              this.getMessage()
            })
        } else {
          this.props.navigation.replace('Login')
        }
      })
  }

  watchMessage = () => {
    const { database, chatId, user, friend } = this.state
    const doc = `chats/${chatId}`
    database.ref(doc).limitToLast(50).on('child_added', (snapshot) => {
      const msg = snapshot.val()
      console.log('msg',msg)
      // if (msg.uid !== user.uid) {
        const messages = [{
          _id: `${msg.timestamp}`,
          text: msg.message,
          createdAt: new Date(msg.timestamp),
          user: {
            _id: friend.uid,
            avatar: friend.avatar,
          }
        }]
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
      // }
    })
  }

  addMessageToDatabase = async (messages) => {
    const { user, chatId, friend } = this.state
    const doc = `chats/${chatId}`
    const [msg] = messages
    const timestamp = new Date().getTime()
    const data = {
      timestamp,
      message: msg.text,
      type: 'text',
      uid: user.uid,
    }
    await pushDatabase(doc, data)
    await sendPushNotification(friend.pushToken, 'ข้อความใหม่ส่งถึงคุณ!', msg.text)
  }

  onSend = (messages = []) => {
    this.addMessageToDatabase(messages)
  }

  render() {
    const { user } = this.state
    return (
      <Container loading={this.state.loading} >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 100}>
          {
            user ?
              <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                  _id: user.uid,
                }}
              />
              : null
          }
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default ChatScreen
