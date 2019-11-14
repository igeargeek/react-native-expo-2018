import React from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import Container from '../components/Container'
import pushDatabase from '../libs/firebase/pushDatabase'
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'
import getFirebaseClient from '../libs/firebase/getClient'

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
  }

  componentWillMount = () => {
    const { initFirebase } = getFirebaseClient()
    const database = initFirebase.database()
    this.setState({ database })
    this.getUser()
  }

  getMessage = (timestamp = new Date().getTime()) => {
    const { database } = this.state
    const chatId = this.props.navigation.getParam('chatId', '')
    this.setState({ chatId })
    const doc = `chats/${chatId}`
    database.ref(doc).orderByChild('timestamp').endAt(timestamp).limitToLast(10).once('value')
      .then(async (snapshot) => {
        await this.setState({ messagesTemp: snapshot.val() })
        this.appendMessage()
        this.watchMessage()
      })
    this.setState({ loading: false })
  }

  getUser = () => {
    onAuthStateChanged()
      .then(async (user) => {
        if (user) {
          await this.setState({ user })
          this.getMessage()
        } else {
          this.props.navigation.replace('Login')
        }
      })
  }

  appendMessage = () => {
    const { messagesTemp, user } = this.state
    const msgTemp = []
    if (messagesTemp) {
      Object.keys(messagesTemp).forEach((key) => {
        msgTemp.push(messagesTemp[key])
      })
    }
    const messages = msgTemp.map(el => ({
      _id: el.timestamp,
      text: el.message,
      createdAt: new Date(el.timestamp),
      user: {
        _id: user.uid === el.uid ? 1 : 2,
        avatar: 'https://placeimg.com/140/140/any',
      }
    }))
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  watchMessage = () => {
    const { database, chatId, user } = this.state
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
              avatar: 'https://placeimg.com/140/140/any',
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
    const doc = `chats/${this.state.chatId}`
    const { database } = this.state
    let sort = 0
    await database.ref(doc).limitToLast(5).once('child_added')
      .then((snapshot) => {
        const data = snapshot.val()
        sort = data.sort
      })
    const [msg] = messages
    const { user } = this.state
    const timestamp = new Date().getTime()
    const data = {
      timestamp,
      message: msg.text,
      type: 'text',
      uid: user.uid,
      sort: sort - 1,
      name: user.displayName || user.email,
      avatar: user.photoURL || 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
    }
    await pushDatabase(doc, data)
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
