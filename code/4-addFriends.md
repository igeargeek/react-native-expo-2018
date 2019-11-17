# Add friends

4.1. สร้างไฟล์ `/src/screens/AddFriendScreen.js`

``` js
import React from 'react'
import { View, Text, Image } from 'react-native'
// 4.3 import react-native-tab-navigator และ components Container
// 4.10 import MyQrCode จาก section ที่สร้าง
// 4.20 import CameraScanner จาก section ที่สร้าง

class AddFriendScreen extends React.Component {
  static navigationOptions = {
    title: 'Add friend',
  }

  // 4.4 เพิ่ม state 

  render() {
    return (
        // 4.5 เพิ่ม container view
    )
  }
}

export default AddFriendScreen
```

4.2 npm install react-native-tab-navigator --save

4.3 แก้โค้ดที่ไฟล์ `AddFriendScreen.js`
```js
import TabNavigator from 'react-native-tab-navigator';
import Container from '../components/Container'
```

4.4 เพิ่ม state 
```js
  state = {
    selectedTab: 'Scan',
  }
```

4.5 แก้โค้ดส่วน render 
```js
<Container>
    <View style={{ width: '100%', height: '100%' }}>
        <TabNavigator>
        <TabNavigator.Item
            selected={this.state.selectedTab === 'Scan'}
            title="Scan"
            renderIcon={() => <Image style={{width: 25, height: 25}} source={require('...')} />}
            renderSelectedIcon={() => <Image style={{width: 25, height: 25}} source={require('...')} />}
            onPress={() => this.setState({ selectedTab: 'Scan' })}>
            <CameraScanner onChangePage={() => ..... }/> // change to chatlist page
        </TabNavigator.Item>
        <TabNavigator.Item
            selected={this.state.selectedTab === 'myQrCode'}
            title="My QR Code"
            renderIcon={() => <Image style={{width: 25, height: 25}} source={require('...')} />}
            renderSelectedIcon={() => <Image style={{width: 25, height: 25}} source={require('...')} />}
            onPress={() => this.setState({ selectedTab: 'myQrCode' })}>
            <MyQrCode />
        </TabNavigator.Item>
        </TabNavigator>
    </View>
</Container>
```

4.6 สร้างไฟล์ `/src/sections/MyQrCode.js`
```js
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import getFirebaseClient from '../libs/firebase/getClient'

export default class MyQrCode extends Component {
  // 4.7 เพิ่ม state

  // 4.8 เพิ่ม componentDidMount

    render() {
        return (
            // 4.9 เพิ่ม render view
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
```

4.7 แก้ไขไฟล์ `/src/sections/MyQrCode.js` เพิ่ม state
```js
  state = {
      uid: '',
  }
```

4.8 เพิ่ม componentDidMount
```js
  componentDidMount = () => {
    const { firebase } = getFirebaseClient()
    let user = firebase.auth().currentUser;
    this.setState({ .... }) // set state uid
  }
```

4.9 เพิ่ม render view
```js
<View style={styles.container}>
    <Image 
        style={{width: 300, height: 300}} 
        source={{uri: `http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=${this.state.uid}&chld=H|0`}} 
    />
    <Text>My QR Code</Text>
</View>
```

4.10 แก้โค้ดที่ไฟล์ `AddFriendScreen.js` import MyQrCode

4.11 expo install expo-barcode-scanner

4.12 สร้างไฟล์ `/src/sections/CameraScanner.js`
```js
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
// 4.13 import expo permissions และ expo-barcode-scanner
// 4.18 เพิ่ม import firebase

export default class CameraScanner extends Component {
    // 4.14 เพิ่ม stage 

    // 4.15 เพิ่ม componentDidMount และ getPermissionsAsync

    // 4.17 เพิ่ม handleBarCodeScanned

    render() {
      // 4.16 เพิ่ม render 
    }
}

const styles = StyleSheet.create({
    container: {
        // set conponent center
    },
});
```
4.13 import expo permissions และ expo-barcode-scanner
```js
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
```

4.14 เพิ่ม stage 
```js
  state = {
    hasCameraPermission: null,
    scanned: false,
  };
```

4.15 เพิ่ม componentDidMount และ getPermissionsAsync
```js
   async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    };
```

4.16 เพิ่ม render 
```js
    const { hasCameraPermission, scanned } = this.state;
    if (hasCameraPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
    <View
        style={styles.container}>
        <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
        />

        {scanned && (
            <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
        )}
    </View>
    );
```

4.17 เพิ่ม handleBarCodeScanned
```js
handleBarCodeScanned = ({ type, data }) => {
    const { firebase } = getFirebaseClient()
    let user = firebase.auth().currentUser;

    getOnce(`friends/${user.uid}/${data}`).once('value').then(snapshot => {
        if(snapshot.val()) {
            Alert.alert(
                'Sorry',
                'Your are both already friends!',
                [
                  {text: 'OK', onPress: () => .... }, // call props to change page
                ],
              );
        } else {
            let timestamp = Date.now()
            setDatabase(`.....`, { // path firebase to create friends database
                chatRoomID: timestamp,
            })
            setDatabase(`.....`, { // path firebase to create friends database
                chatRoomID: timestamp,
            })
            this.props.onChangePage()
        }
    });
    
    this.setState({ scanned: true });
}
```

4.18 เพิ่ม import firebase
```js
import setDatabase from '../libs/firebase/setDatabase'
import getFirebaseClient from '../libs/firebase/getClient'
import getOnce from '../libs/firebase/getOnce'
```

4.19 สร้างไฟล์ `../libs/firebase/getOnce`
```js
import getFirebaseClient from './getClient'

const getOnce = (doc) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  return database.ref(doc)
}

export default getOnce
```

4.20 แก้โค้ดที่ไฟล์ `AddFriendScreen.js` import CameraScanner
