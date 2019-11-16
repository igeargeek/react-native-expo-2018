import React from 'react'
import { View, SafeAreaView, StyleSheet, TextInput, Button } from 'react-native'
import Container from '../components/Container'
import register from '../libs/firebase/register'
import setDatabase from '../libs/firebase/setDatabase'

class RegisterScreen extends React.Component {
  static navigationOptions = {
    title: 'Register',
  }

  state = {
    name: '',
    email: '',
    password: '',
  }

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

  render() {
    return (
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
