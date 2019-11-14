import React from 'react'
import { View, Text, SafeAreaView, Image, Button } from 'react-native'
import Container from '../components/Container'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import uploadImage from '../libs/firebase/uploadImage'
import setDatabase from '../libs/firebase/setDatabase'

class ProfileScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    image: null,
    hasCameraPermission: null,
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
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { statusCamera } = await Permissions.askAsync(Permissions.CAMERA);

    if (status !== 'granted' && statusCamera !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
    this.setState({ hasCameraPermission: status === 'granted' });

  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1
    });
  
    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      const url = await uploadImage(result.uri)
      setDatabase('users/' + this.state.userId + '/avatar', url)
      this.props.navigation.replace('ChatRoom')
    }
  };


  render() {
    const { image } = this.state
    return (
      <Container>
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginVertical: 10 }}>เลือกรูปโปรไฟล์</Text>
          <Image
            style={{ width: 250, height: 250, borderRadius: 125, marginVertical: 20 }}
            source={ image == null ? require('../../assets/placeholderAvatar.png') : {uri: image} } /> 

          <Button
            title="Pick an image from camera roll"
            onPress={this._pickImage}
          />
        </SafeAreaView>
      </Container>
    )
  }
}

export default ProfileScreen
