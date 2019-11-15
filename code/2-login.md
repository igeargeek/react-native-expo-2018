# Login

2.1. สร้างไฟล์ `/src/screens/LoginScreen.js`

``` js
import React from 'react'
import { View, Image, Text, StyleSheet, Button, TextInput } from 'react-native'
// 2.5 import container component
// 2.10 import firebase

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  // 2.11 สร้าง state

  // 2.13 สร้าง function login

  // 2.14 เช็ค logged

  render() {
    return (
        null
     // 2.12 เพ่ิม View
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    padding: 20,
    fontSize: 28,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    width: '60%',
    height: 40,
    marginBottom: 10,
  },
  buttonLayout: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

export default LoginScreen
```

2.2 แก้โค้ดที่ไฟล์ `/App.js`
``` js
import LoginScreen from './src/screens/LoginScreen'
```

2.3 แก้โค้ดที่ไฟล์ `/App.js`
``` js
  LoginScreen: { screen: LoginScreen },
```

2.4 สร้างไฟล์ `/src/components/Container.js`

``` js
import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

const Container = ({ children, loading }) => {
  if (loading) {
    return <ActivityIndicator style={styles.container} size="large" color="#0000ff" />
  }
  return children
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Container
```

2.5 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`

``` js
import Container from '../components/Container'
```

2.6 install firebase package
```
npm install firebase
```

2.7 สร้างไฟล์ `/src/libs/firebase/getClient.js`
``` js
import * as firebase from 'firebase';

let initFirebase
const firebaseConfig = {
  apiKey: "xxxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  storageBucket: "xxx"
};

const getClient = () => {
  if (!initFirebase) {
    initFirebase = firebase.initializeApp(firebaseConfig);
  }
  return { initFirebase, firebase }
}

export default getClient
```

2.8 สร้างไฟล์ `/src/libs/firebase/login.js`
``` js
import getFirebaseClient from './getClient'

const login = (email, password) => {
  const { firebase } = getFirebaseClient()
  return firebase.auth().signInWithEmailAndPassword(email, password)
}

export default login
```

2.9 สร้างไฟล์ `/src/libs/firebase/onAuthStateChanged.js`
``` js
import getFirebaseClient from './getClient'

const onAuthStateChanged = (email, password) =>
    new Promise((resolve, reject) => {
        const { firebase } = getFirebaseClient()
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
        })
    })

export default onAuthStateChanged
```

2.10 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`

``` js
import login from '../libs/firebase/login'
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'
```

2.11 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`

``` js
  state = {
    authLoading: false,
    loading: false,
    email: '',
    password: '',
  }
```

2.12 copy รูป logo.png ไว้ที่ assets และแก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`
``` html
 <Container loading={this.state.authLoading} >
    <View style={styles.container} >
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.text}>Chat app</Text>
        <TextInput
        style={styles.input}
        value={this.state.email}
        onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
        style={styles.input}
        value={this.state.password}
        onChangeText={(password) => this.setState({ password })}
        secureTextEntry />
        {this.state.loading ? <Text>Loading...</Text> :
        <View style={styles.buttonLayout} >
            <Button title="Login" onPress={this.login} />
            <View style={{ width: 10 }} />
            <Button title="Register" onPress={() => { this.props.navigation.navigate('Register') }} />
        </View>
        }
    </View>
</Container>
```

2.13 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`
``` js
  login = () => {
    this.setState({ loading: true })
    const { email, password } = this.state
    login(email, password)
      .then((data) => {
        this.props.navigation.replace('ChatRoom')
      })
      .catch(() => {
        alert('user ไม่ถูกต้อง')
        this.setState({ loading: false })
      })
  }
```

2.14 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`
``` js
componentDidMount = async () => {
    this.setState({ authLoading: true })
    onAuthStateChanged()
      .then((user) => {
        if (user) {
          this.props.navigation.replace('ChatRoom')
        } else {
          this.setState({ authLoading: false })
        }
      })
  }
```

2.15 สร้างไฟล์ `/src/screens/ChatRoomScreen.js`
``` js
import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
// 2.19 import logout

class ChatRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Chat room',
    // 2.20 สร้างปุ่ม logout
  })

  render() {
    return (
      <View>
        <Text>Welcome to I Gear Geek</Text>
      </View>
    )
  }
}

export default ChatRoomScreen
```

2.16 แก้โค้ดที่ไฟล์ `/App.js`
``` js
import ChatRoomScreen from './src/screens/ChatRoomScreen'
```

2.17 แก้โค้ดที่ไฟล์ `/App.js`
``` js
  ChatRoom: { screen: ChatRoomScreen },
```

2.18 สร้างไฟล์ `/src/libs/firebase/logout.js`
``` js
import getFirebaseClient from './getClient'

const logout = () => {
  const { firebase } = getFirebaseClient()
  return firebase.auth().signOut();
}

export default logout
```

2.19 แก้โค้ดที่ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js
import logout from '../libs/firebase/logout'
```

2.20 แก้โค้ดที่ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js
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
```