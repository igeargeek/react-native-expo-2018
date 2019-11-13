import React from 'react'
import { View, Text } from 'react-native'
import Container from '../components/Container'

class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <Container>
        <View style={{ width: '100%', height: '100%' }}>
          <Text>Register</Text>
        </View>
      </Container>
    )
  }
}

export default RegisterScreen
