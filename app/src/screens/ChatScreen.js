import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Container from '../components/Container'
import pushDatabase from '../libs/firebase/pushDatabase'
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'
import getFirebaseClient from '../libs/firebase/getClient'
import { sendPushNotification } from '../libs/notification'

let isFirst = true

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  }

  state = {
    database: null,
    loading: true,
    messages: [],
    messagesTemp: null,
    chatId: '',
    user: null,
    friend: null
  }

  componentWillMount = async () => {
    const chatId = this.props.navigation.getParam('chatId', '')
    const friend = {
      uid: this.props.navigation.getParam('uid', ''),
      avatar: this.props.navigation.getParam('avatar', ''),
      name: this.props.navigation.getParam('name', ''),
    }
    const { initFirebase } = getFirebaseClient()
    const database = initFirebase.database()
    await this.setState({ database, chatId, friend })
    this.getUser()
  }

  getMessage = () => {
    const { database, chatId } = this.state
    const doc = `chats/${chatId}`
    database.ref(doc).limitToLast(50).once('value')
      .then(async (snapshot) => {
        await this.setState({ messagesTemp: snapshot.val() })
        this.appendMessage()
        this.watchMessage()
      })
    this.setState({ loading: false })
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

  appendMessage = () => {
    const { messagesTemp, user, friend } = this.state
    const msgTemp = []
    if (messagesTemp) {
      Object.keys(messagesTemp).forEach((key) => {
        msgTemp.push(messagesTemp[key])
      })
    }
    msgTemp.reverse()
    const messages = msgTemp.map(el => ({
      _id: el.timestamp,
      text: el.message,
      createdAt: new Date(el.timestamp),
      user: {
        _id: user.uid === el.uid ? 1 : 2,
        avatar: user.uid === el.uid ? user.avatar : friend.avatar,
      }
    }))
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  watchMessage = () => {
    const { database, chatId, user, friend } = this.state
    const doc = `chats/${chatId}`
    database.ref(doc).limitToLast(1).on('child_added', (snapshot) => {
      if (isFirst) {
        isFirst = false
      } else {
        const msg = snapshot.val()
        if (msg.uid !== user.uid) {
          const messages = [{
            _id: msg.timestamp,
            text: msg.message,
            createdAt: new Date(msg.timestamp),
            user: {
              _id: 2,
              avatar: friend.avatar,
            }
          }]
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
          }))
        }
      }
    })
  }

  addMessageToDatabase = async (messages) => {
    const { user, chatId } = this.state
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
    await sendPushNotification('{{friend token}}', 'ข้อความใหม่ส่งถึงคุณ!', msg.text)
  }

  onSend = (messages = []) => {
    this.addMessageToDatabase(messages)
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <Container loading={this.state.loading} >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default ChatScreen
