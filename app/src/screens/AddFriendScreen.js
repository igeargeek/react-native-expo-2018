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
    selectedTab: 'home',
  }

  render() {
    return (
      <Container>
        <View style={{ width: '100%', height: '100%' }}>
          <TabNavigator>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'home'}
              title="Home"
              renderIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/logo.png')} />}
              renderSelectedIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/logo.png')} />}
              onPress={() => this.setState({ selectedTab: 'home' })}>
              <CameraScanner onChangePage={() => this.props.navigation.replace('ChatRoom') }/>
            </TabNavigator.Item>
            <TabNavigator.Item
              selected={this.state.selectedTab === 'profile'}
              title="Profile"
              renderIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/logo.png')} />}
              renderSelectedIcon={() => <Image style={{width: 25, height: 25}} source={require('../../assets/logo.png')} />}
              onPress={() => this.setState({ selectedTab: 'profile' })}>
              <MyQrCode />
            </TabNavigator.Item>
          </TabNavigator>
        </View>
      </Container>
    )
  }
}

export default AddFriendScreen
