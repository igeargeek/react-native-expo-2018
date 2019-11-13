import React from 'react'
import { View, Image, Text, StyleSheet, Button, TextInput } from 'react-native'
import Container from '../components/Container'
import login from '../libs/firebase/login'
import onAuthStateChanged from '../libs/firebase/onAuthStateChanged'

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    authLoading: true,
    loading: false,
    email: '',
    password: '',
  }

  componentWillMount = () => {
    onAuthStateChanged()
      .then((user) => {
        if (user) {
          this.props.navigation.replace('ChatRoom')
        } else {
          this.setState({ authLoading: false })
        }
      })
  }

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

  render() {
    return (
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
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
