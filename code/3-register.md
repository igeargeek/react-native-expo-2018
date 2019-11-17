3.1. สร้างไฟล์ `/src/screens/RegisterScreen.js`

``` js

import React from 'react'
import { View, SafeAreaView, StyleSheet, TextInput, Button } from 'react-native'

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register',
  }

  render() {
    return (
      null
    )
  }
}
const styles = StyleSheet.create({
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    paddingVertical: 8,
    width: '60%',
    height: 50,
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18
  },
  text: {
    paddingBottom: 3,
    fontSize: 13,
  },
})


export default RegisterScreen

```

3.2 แก้โค้ดที่ไฟล์ `/src/screens/LoginScreen.js`

``` js

import Container from '../components/Container'

```

3.3 แก้โค้ดที่ไฟล์ `/App.js`
``` js

import RegisterScreen from './src/screens/RegisterScreen'

```

3.4 แก้โค้ดที่ไฟล์ `/App.js`
``` js

  Register: { screen: RegisterScreen },

```

3.5 สร้างไฟล์ `/src/libs/firebase/register.js`
``` js

import getFirebaseClient from './getClient'

const register = (email, password) => {
  const { firebase } = getFirebaseClient()
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export default register

```

3.6 สร้างไฟล์ `/src/libs/firebase/setDatabase.js`
``` js

import getFirebaseClient from './getClient'

const setDatabase = async (doc, data) => {
  const { initFirebase } = getFirebaseClient()
  const database = initFirebase.database()
  await database.ref(doc).set(data)
}

export default setDatabase

```

3.7 เพิ่ม state ในไฟล์ `/src/screens/RegisterScreen.js`
``` js

state = {
    name: '',
    email: '',
    password: '',
  }

```


3.8 เพิ่ม import ในไฟล์ `/src/screens/RegisterScreen.js`
``` js

import register from '../libs/firebase/register'
import setDatabase from '../libs/firebase/setDatabase'

```

3.9 เพิ่ม function ในไฟล์ `/src/screens/RegisterScreen.js`
``` js

register = () => {
    const { name, email, password } = this.state

    register(email, password)
      .then((data) => {
        setDatabase('users/'+data.user.uid, {
          name: name,
        })
        this.props.navigation.navigate({ 
          routeName: 'Profile',
          params: { uid: data.user.uid },
        })
      })
      .catch(() => {
        alert('user ไม่ถูกต้อง')
        this.setState({ loading: false })
      })
  }

```

3.10 เพิ่ม html ในไฟล์ `/src/screens/RegisterScreen.js`
``` html

<Container>
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
        style={styles.input}
        value={this.state.name}
        placeholder='name'
        autoCapitalize='none'
        onChangeText={(name) => this.setState({ name })}
        />
        
        <TextInput
        style={styles.input}
        value={this.state.email}
        placeholder='Email Address'
        autoCapitalize='none'
        onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
        style={styles.input}
        value={this.state.password}
        placeholder='Password'
        autoCapitalize='none'
        secureTextEntry={true}
        onChangeText={(password) => this.setState({ password })}
        />

        <View style={{marginTop: 50}}>
        <Button title="Register" onPress={this.register} />
        </View>
        
    </SafeAreaView>
</Container>

```

3.11 install  package
```
expo install expo-permissions

expo install expo-image-picker

expo install expo-camera

```

3.12 สร้างไฟล์ `/src/screens/ProfileScreen.js`
``` js

import React from 'react'
import { View, Text, SafeAreaView, Image, Button, TouchableOpacity } from 'react-native'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    image: null,
    hasCameraPermission: false,
    userId: null
  }

  render() {
    const { image } = this.state
    return (
      null
    )
  }
}

export default ProfileScreen

```

3.13 แก้โค้ดที่ไฟล์ `/App.js`
``` js

import ProfileScreen from './src/screens/ProfileScreen'

```

3.14 แก้โค้ดที่ไฟล์ `/App.js`
``` js

  Profile: { screen: ProfileScreen },

```

3.15 import expo permission lib `/src/screens/ProfileScreen.js`
``` js

import Container from '../components/Container'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

```

3.16 เพิ่ม function ในไฟล์ `/src/screens/ProfileScreen.js`
``` js

componentDidMount() {
    this.getPermissionAsync();
    const uid = this.props.navigation.getParam('uid');
    this.setState({
        userId: uid
    })
}

getPermissionAsync = async () => {
    const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (cameraRoll.status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
    this.setState({ hasCameraPermission: true });

}

```
3.17  เพิ่ม config firebase `/src/libs/firebase/getClient.js`
``` js

import * as firebase from 'firebase';

let initFirebase
const firebaseConfig = {
  apiKey: "xxxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  storageBucket: "xxx"     <---------------
};

const getClient = () => {
  if (!initFirebase) {
    initFirebase = firebase.initializeApp(firebaseConfig);
  }
  return { initFirebase, firebase }
}

export default getClient

```

3.18  สร้างไฟล์ `/src/libs/firebase/uploadImage.js`
``` js

import getFirebaseClient from './getClient'

const uploadImage = async(uri) => {
    const { firebase } = getFirebaseClient()

    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = firebase.storage().ref().child(`${new Date().getTime()}.jpg`);
    let urlImage
    await ref.put(blob).then(() => {
        urlImage =  ref.getDownloadURL()
    });

    return urlImage

}

export default uploadImage

```

3.19  import uploadImage function ในไฟล์ `/src/screens/ProfileScreen.js`
``` js

import uploadImage from '../libs/firebase/uploadImage'
import setDatabase from '../libs/firebase/setDatabase'
import { Ionicons } from '@expo/vector-icons'

```

3.20  เพิ่ม function ในไฟล์ `/src/screens/ProfileScreen.js`
``` js

_pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1
    });
  
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  }

  onTakePhoto = (data) => {
    this.setState({
      image: data
    });
  };

  saveImage = async () => {
    if (this.state.image == null) {
      alert('please choose a photo')
      return
    }
    const url = await uploadImage(this.state.image)
    setDatabase('users/' + this.state.userId + '/avatar', url)
    this.props.navigation.replace('ChatRoom')
  }

```

3.21 เพิ่ม html ในไฟล์ `/src/screens/ProfileScreen.js`
``` html

<Container>
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, marginTop: 30, marginBottom: 10 }}>เลือกรูปโปรไฟล์</Text>
        <Image
        style={{ width: 250, height: 250, borderRadius: 125, marginVertical: 20 }}
        source={ image == null ? require('../../assets/placeholderAvatar.png') : {uri: image} } /> 

        <View style={{flexDirection: 'row', marginBottom: 50}}>
        <TouchableOpacity
            title="Open Camera Roll"
            onPress={this._pickImage}
        >
            <View style={{width: 60, height: 60, backgroundColor: '#606060', alignItems: 'center', justifyContent: 'center', borderRadius: 30, margin: 10}}>
            <Ionicons name="md-images" size={32} color="#fff" />
            </View>
        </TouchableOpacity>

        <TouchableOpacity
            title="Open Camera"
            onPress={() => this.props.navigation.navigate('Camera', { onTakePhoto: this.onTakePhoto })}
        >
            <View style={{width: 60, height: 60, backgroundColor: '#606060', alignItems: 'center', justifyContent: 'center', borderRadius: 30, margin: 10}}>
            <Ionicons name="md-camera" size={32} color="#fff" />
            </View>
        </TouchableOpacity>
        </View>
        
        <Button title="Register" onPress={this.saveImage} />

    </SafeAreaView>
</Container>

```

3.22 สร้างไฟล์ `/src/screens/CameraScreen.js`

``` js

import React, { Component } from 'react'
import { Text, View, Button, TouchableOpacity } from 'react-native'

export default class CameraScreen extends Component {
    state = {
        hasCameraPermission: false,
        type: Camera.Constants.Type.back,
    };

    render() {
        return (
            null
        )
    }
}

```

3.23 แก้โค้ดที่ไฟล์ `/App.js`
``` js

import CameraScreen from './src/screens/CameraScreen'

```

3.24 แก้โค้ดที่ไฟล์ `/App.js`
``` js

  Camera: { screen: CameraScreen}

```

3.25 เพิ่ม import lib ในไฟล์ `/src/screens/CameraScreen.js`
``` js

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'

```

3.26 เพิ่ม function ในไฟล์ `/src/screens/CameraScreen.js`
``` js
componentDidMount() {
    this.getPermissionAsync();
}

getPermissionAsync = async () => {
    const statusCamera = await Permissions.askAsync(Permissions.CAMERA);
    if (statusCamera.status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
    }
    this.setState({ hasCameraPermission: true });
}

snap = async () => {
    if (this.camera) {
        let photo = await this.camera.takePictureAsync();
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onTakePhoto(photo.uri);
    }
};

```

3.27 เพิ่ม View ในไฟล์ `/src/screens/CameraScreen.js`
``` html

<View style={{ flex: 1 }}>
    <Camera
        ref={ref => {
            this.camera = ref;
        }}
        style={{ flex: 2 }} 
        type={this.state.type}>
        <View
        style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
        }}>
            <TouchableOpacity
                style={{
                    alignSelf: 'flex-end',
                    margin: 15
                }}
                onPress={() => {
                this.setState({
                    type:
                    this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                });
                }}>
                <Ionicons name="md-reverse-camera" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    </Camera>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity
            title="Open Camera"
            onPress={this.snap}
            >
            <View style={{width: 60, height: 60, backgroundColor: '#606060', alignItems: 'center', justifyContent: 'center', borderRadius: 30, margin: 10}}>
                <Ionicons name="md-camera" size={32} color="#fff" />
            </View>
        </TouchableOpacity>
    </View>

</View>

```

3.28 เพิ่ม header right ไฟล์ `/src/screens/ChatRoomScreen.js`
``` js

import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'

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
  }

```













