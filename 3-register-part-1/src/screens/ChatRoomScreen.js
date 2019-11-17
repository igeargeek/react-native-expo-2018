import React from 'react'
import { View, TouchableHighlight, Text } from 'react-native'
import logout from '../libs/firebase/logout'

class ChatRoomScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Chat room',
        headerLeft: () => (
            <TouchableHighlight onPress={() => {
                logout().then(() => {
                    navigation.replace('LoginScreen')
                }).catch((error) => {
                    console.log(error)
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