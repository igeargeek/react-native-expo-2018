import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, TextInput, Button } from 'react-native'
import Container from '../components/Container'
import register from '../libs/firebase/register'
import setDatabase from '../libs/firebase/setDatabase'

class RegisterScreen extends React.Component {
  static navigationOptions = {
    header: null,
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
        <Text style={styles.text}>name</Text>
        <TextInput
            style={styles.input}
            value={this.state.name}
            placeholder='please input your name'
            autoCapitalize='none'
            onChangeText={(name) => this.setState({ name })}
          />
        <Text style={styles.text}>email</Text>
        <TextInput
            style={styles.input}
            value={this.state.email}
            placeholder='please input the email'
            autoCapitalize='none'
            onChangeText={(email) => this.setState({ email })}
          />
        <Text style={styles.text}>password</Text>
        <TextInput
          style={styles.input}
          value={this.state.password}
          placeholder='please input the password'
          autoCapitalize='none'
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <View>
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
    padding: 5,
    width: '60%',
    height: 40,
    marginBottom: 10,
  },
  text: {
    paddingVertical: 3,
    fontSize: 18,
  },
})


export default RegisterScreen
