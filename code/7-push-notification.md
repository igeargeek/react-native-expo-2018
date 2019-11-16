# Push notification

7.1. ติดตั้ง `expo-constants` และ `expo-permissions`

7.2. สร้างไฟล์ `/src/libs/notification.js`

``` js
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'

// 7.3 ส่วนของการตรวจสอบ Notification

// 7.8 ส่วนของการส่ง Push notification
```

7.3 แก้โค้ดที่ไฟล์ `/src/libs/notification.js`
``` js
export const pushNotificationToken = async () => {
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    )
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      )
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return ''
    }
    let token = await Notifications.getExpoPushTokenAsync()
    return token
  }
  return ''
}
```

7.4 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`
``` js
import { pushNotificationToken } from '../libs/notification'
```

7.5 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`
``` js
  login = async () => {
    const token = await pushNotificationToken() // เพิ่มตรงนี้
    this.setState({ loading: true })
    const { email, password } = this.state
    login(email, password)
      .then((data) => {
        setDatabase('users/' + data.uid + '/pushToken', token) // เพิ่มตรงนี้
        this.props.navigation.replace('ChatRoom')
      })
      .catch(() => {
        alert('user ไม่ถูกต้อง')
        this.setState({ loading: false })
      })
  }
```

7.6 แก้โค้ดที่ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js
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
              pushToken: friend.pushToken,  // เพิ่มตรงนี้
            })
          })
        })
      })
      Promise.all(promise).then((chatData) => {
        this.setState({ chatData })
      })
    })
  }
```

7.7 แก้โค้ดที่ไฟล์ `/src/screens/ChatScreen.js`
``` js
  componentDidMount = async () => {
    const chatId = this.props.navigation.getParam('chatId', '')
    const friend = {
      uid: this.props.navigation.getParam('uid', ''),
      avatar: this.props.navigation.getParam('avatar', ''),
      name: this.props.navigation.getParam('name', ''),
      pushToken: this.props.navigation.getParam('pushToken', ''),  // เพิ่มตรงนี้
    }
    const { initFirebase } = getFirebaseClient()
    const database = initFirebase.database()
    await this.setState({ database, chatId, friend })
    this.getUser()
  }
```

7.8 แก้โค้ดที่ไฟล์ `/src/libs/notification.js`
``` js
export const sendPushNotification = async (token, title, text) => {
  const message = {
    to: token,
    sound: 'default',
    title: title,
    body: text,
    data: { data: text },
  }
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  return response
};
```

7.9 แก้โค้ดที่ไฟล์ `/src/screens/ChatScreen.js`
``` js
import { sendPushNotification } from '../libs/notification'
```

7.10 แก้โค้ดที่ไฟล์ `/src/screens/ChatScreen.js`
``` js
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
```