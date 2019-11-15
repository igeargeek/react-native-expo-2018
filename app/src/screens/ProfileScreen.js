import React from 'react'
import { View, Text, SafeAreaView, Image, Button, TouchableOpacity } from 'react-native'
import Container from '../components/Container'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import uploadImage from '../libs/firebase/uploadImage'
import setDatabase from '../libs/firebase/setDatabase'
import { Ionicons } from '@expo/vector-icons'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    image: null,
    hasCameraPermission: false,
    type: Camera.Constants.Type.back,
    userId: null
  }

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


  render() {
    const { image } = this.state
    return (
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
    )
  }
}

export default ProfileScreen
