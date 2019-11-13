import React from 'react'
import { View, Text } from 'react-native'
import Container from '../components/Container'

class AddFriendScreen extends React.Component {
  static navigationOptions = {
    title: 'Add friend',
  }

  render() {
    return (
      <Container>
        <View style={{ width: '100%', height: '100%' }}>
          <Text>Add friend</Text>
        </View>
      </Container>
    )
  }
}

export default AddFriendScreen
