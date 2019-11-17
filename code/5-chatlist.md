5.1 สร้างไฟล์ `/src/libs/firebase/getDatabase.js`
``` js

import getFirebaseClient from './getClient'

const getDatabase = (doc, callback) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  database.ref(doc).on('value', (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback(data)
    }
  })
}

export default getDatabase

```

5.2 สร้างไฟล์ `/src/sections/ChatList.js`
``` js

import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';

export default class FlatListBasics extends Component {
    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.chatData}
                    keyExtractor={item => `${item.chatId}`}
                    renderItem={({ item }) =>
                        <TouchableHighlight onPress={() => {
                            navigate('Chat', item)
                        }} style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                            <View style={{flexDirection: 'row', marginHorizontal: 10, marginVertical: 5, alignItems: 'flex-start'}}>
                                <Image source={{uri: item.avatar}} style={{width: 60, height: 60, borderRadius: 30}} />
                                <Text style={styles.item}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});

```

5.3 สร้างไฟล์ `/src/libs/firebase/getUserInfo.js`
``` js

import getFirebaseClient from './getClient'

const { firebase } = getFirebaseClient()

export default firebase.auth();

```

5.4 เพิ่ม import ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js

import { Ionicons } from '@expo/vector-icons'
import getDatabase from '../libs/firebase/getDatabase'
import ChatList from '../sections/ChatList'
import user from '../libs/firebase/getUserInfo'

```

5.5 สร้าง state ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js

state = {
    userInfo: {},
    chatData: []
  }

```

5.6 เพิ่ม function get user ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js

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

```

5.7 แก้ return ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js

render() {
    const { navigation } = this.props;
    return (
        <View style={{ width: '100%', height: '100%' }}>
        <ChatList navigation={navigation} chatData={this.state.chatData} />
        </View>
    )
}

```



