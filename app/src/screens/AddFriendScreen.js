import React from 'react'
import { View, Text, Image } from 'react-native'
import TabNavigator from 'react-native-tab-navigator';
import Container from '../components/Container'
import MyQrCode from '../sections/MyQrCode'
import CameraScanner from '../sections/CameraScanner'

class AddFriendScreen extends React.Component {
  static navigationOptions = {
    title: 'Add friend',
  }

  state = {
    selectedTab: 'Scan',
  }

  render() {
    return (
      <Container>
        <View style={{ width: '100%', height: '100%' }}>
          <TabNavigator>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'Scan'}
              title="Scan"
              renderIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/camera.png')} />}
              renderSelectedIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/camera.png')} />}
              onPress={() => this.setState({ selectedTab: 'Scan' })}>
              <CameraScanner onChangePage={() => this.props.navigation.replace('ChatRoom') }/>
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'myQrCode'}
              title="My QR Code"
              renderIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/QRcode.png')} />}
              renderSelectedIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/QRcode.png')} />}
              onPress={() => this.setState({ selectedTab: 'myQrCode' })}>
              <MyQrCode />
            </TabNavigator.Item>
          </TabNavigator>
        </View>
      </Container>
    )
  }
}

export default AddFriendScreen
