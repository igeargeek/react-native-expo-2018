# Chat

6.1. สร้างไฟล์ `/src/screens/ChatScreen.js`
``` js
import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
// 6.3 Import Container component
// 6.6 Import Firebase
// 6.14 Import push database to firebase
// 6.10 Import GiftedChat

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  }

  // 6.4 เพิ่ม state

  // 6.7 รับข้อมูล user จาก chat room

  //  6.20 component will unmount

  //  6.19 clear connection

  // 6.8 ดึงข้อมูล user

  // 6.12 ส่ง message

  // 6.17 เพิ่ม watch database

  render() {
    return (
      null // 6.5 ใช้ Container
    );
  }
}

export default ChatScreen
```

6.2 แก้ไฟล์ `/App.js` เพิ่ม navigation stack


6.3 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
  import Container from '../components/Container'
```

6.4 เพิ่ม state ที่ไฟล์ `/src/screens/ChatScreen.js`
``` js
  state = {
    database: null,
    loading: true,
    messages: [],
    chatId: '',
    user: null,
    friend: null
  }
```

6.5 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
<Container loading={this.state.loading} >
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 100}>
      { 
        // 6.11
      }
  </KeyboardAvoidingView>
</Container>
```

6.6 แก้ไฟล์​ `/src/screens/ChatScreen.js`
``` js
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'
import getFirebaseClient from '../libs/firebase/getClient'
```

6.7 แก้ไฟล์ `/src/screens/ChatScreen.js` ดึงข้อมูลที่ส่งมาจากหน้า Chat Room
``` js
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
    this.getUser()
  }
```

6.8 แก้ไฟล์​ `/src/screens/ChatScreen.js` ฟังก์ชันดึงข้อมูล user
``` js
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
            await this.setState({ user, loading: false })
            // 6.18 เรียกฟังก์ชัน watch database
          })
      } else {
        this.props.navigation.replace('Login')
      }
    })
}
```

6.9 install react-native-gifted-chat
``` js
npm install react-native-gifted-chat
```

6.10 แก้ไฟล์​ `/src/screens/ChatScreen.js`
``` js
import { GiftedChat } from 'react-native-gifted-chat'
```

6.11 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
<GiftedChat
  messages={this.state.messages}
  onSend={messages => this.onSend(messages)}
  user={{
    _id: this.state.user ? this.state.user.uid : '',
  }}
/>
```

6.12 แก้ไฟล์ `/src/screens/ChatScreen.js` เพิ่ม function  ส่ง message
``` js
onSend = (messages) => {
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
  // 6.15 เพิ่มข้อมูลเข้า database
}
```

6.13 สร้างไฟล์ `/src/libs/firebase/pushDatabase.js`
``` js
import getFirebaseClient from './getClient'

const pushDatabase = async (doc, data) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  await database.ref(doc).push(data)
}

export default pushDatabase
```

6.14 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
import pushDatabase from '../libs/firebase/pushDatabase'
```

6.15 แก้ไฟล์ `/src/screens/ChatScreen.js` เพิ่มข้อมูลเข้า database
``` js
pushDatabase(doc, data)
```

6.16 เช็คข้อมูลที่ Firebase realtime database

6.17 แก้ไฟล์ `/src/screens/ChatScreen.js` เพิ่มฟังก์ชัน watch database
``` js
  watchMessage = () => {
    const { database, chatId, user, friend } = this.state
    const doc = `chats/${chatId}`
    database.ref(doc).limitToLast(50).on('child_added', (snapshot) => {
      const msg = snapshot.val()
      const messages = [{
        _id: `${msg.timestamp}`,
        text: msg.message,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.uid,
          avatar: msg.uid === user.uid ? user.avatar : friend.avatar,
        }
      }]
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }))
    })
  }
```

6.18 แก้ไฟล์ `/src/screens/ChatScreen.js` เรียกฟังก์ชัน watch message
``` js
this.watchMessage()
```

6.19 แก้ไฟล์ `/src/screens/ChatScreen.js` สร้างฟังก์ชัน clear connection
``` js
  clearConnection = () => {
    const { database, chatId } = this.state
    const doc = `chats/${chatId}`
    database.ref(doc).off()
  }
```

6.20 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
  componentWillUnmount = () => {
    this.clearConnection()
  }
```