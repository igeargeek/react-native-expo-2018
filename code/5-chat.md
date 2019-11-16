# Chat

5.1. สร้างไฟล์ `/src/screens/ChatScreen.js`
``` js
import React from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
// 5.3 Import Container component
// 5.6 Import Firebase
// 5.14 Import push database to firebase
// 5.10 Import GiftedChat

class ChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Chat',
  }

  // 5.4 เพิ่ม state

  // 5.7 รับข้อมูล user จาก chat room

  //  5.20 component will unmount

  //  5.19 clear connection

  // 5.8 ดึงข้อมูล user

  // 5.12 ส่ง message

  // 5.17 เพิ่ม watch database

  render() {
    return (
      null // 5.5 ใช้ Container
    );
  }
}

export default ChatScreen
```

5.2 แก้ไฟล์ `/App.js` เพิ่ม navigation stack


5.3 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
  import Container from '../components/Container'
```

5.4 เพิ่ม state ที่ไฟล์ `/src/screens/ChatScreen.js`
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

5.5 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
<Container loading={this.state.loading} >
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 100}>
      { 
        // 5.11
      }
  </KeyboardAvoidingView>
</Container>
```

5.6 แก้ไฟล์​ `/src/screens/ChatScreen.js`
``` js
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'
import getFirebaseClient from '../libs/firebase/getClient'
```

5.7 แก้ไฟล์ `/src/screens/ChatScreen.js` ดึงข้อมูลที่ส่งมาจากหน้า Chat Room
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

5.8 แก้ไฟล์​ `/src/screens/ChatScreen.js` ฟังก์ชันดึงข้อมูล user
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
            // 5.18 เรียกฟังก์ชัน watch database
          })
      } else {
        this.props.navigation.replace('Login')
      }
    })
}
```

5.9 install react-native-gifted-chat
``` js
npm install react-native-gifted-chat
```

5.10 แก้ไฟล์​ `/src/screens/ChatScreen.js`
``` js
import { GiftedChat } from 'react-native-gifted-chat'
```

5.11 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
<GiftedChat
  messages={this.state.messages}
  onSend={messages => this.onSend(messages)}
  user={{
    _id: this.state.user ? this.state.user.uid : '',
  }}
/>
```

5.12 แก้ไฟล์ `/src/screens/ChatScreen.js` เพิ่ม function  ส่ง message
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
  // 5.15 เพิ่มข้อมูลเข้า database
}
```

5.13 สร้างไฟล์ `/src/libs/firebase/pushDatabase.js`
``` js
import getFirebaseClient from './getClient'

const pushDatabase = async (doc, data) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  await database.ref(doc).push(data)
}

export default pushDatabase
```

5.14 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
import pushDatabase from '../libs/firebase/pushDatabase'
```

5.15 แก้ไฟล์ `/src/screens/ChatScreen.js` เพิ่มข้อมูลเข้า database
``` js
pushDatabase(doc, data)
```

5.16 เช็คข้อมูลที่ Firebase realtime database

5.17 แก้ไฟล์ `/src/screens/ChatScreen.js` เพิ่มฟังก์ชัน watch database
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

5.18 แก้ไฟล์ `/src/screens/ChatScreen.js` เรียกฟังก์ชัน watch message
``` js
this.watchMessage()
```

5.19 แก้ไฟล์ `/src/screens/ChatScreen.js` สร้างฟังก์ชัน clear connection
``` js
  clearConnection = () => {
    const { database, chatId } = this.state
    const doc = `chats/${chatId}`
    database.ref(doc).off()
  }
```

5.20 แก้ไฟล์ `/src/screens/ChatScreen.js`
``` js
  componentWillUnmount = () => {
    this.clearConnection()
  }
```