import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import getFirebaseClient from '../libs/firebase/getClient'

export default class MyQrCode extends Component {
    componentWillMount = () => {
        const { firebase } = getFirebaseClient()
        let user = firebase.auth().currentUser;
        this.setState({ uid: user.uid })
      }
      state = {
        uid: '',
      }
    render() {
        return (
            <View style={styles.container}>
                <QRCode 
                    size={300}
                    value={this.state.uid }
                />
                <Text>My QR Code</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});