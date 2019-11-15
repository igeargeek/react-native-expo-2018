import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import logout from '../libs/firebase/logout'

class ChatRoomScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Chat room',
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
    })

    render() {
        return (
            <View>
                <Text>Welcome to I Gear Geek</Text>
            </View>
        )
    }
}

export default ChatRoomScreen