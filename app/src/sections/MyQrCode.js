import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import getFirebaseClient from '../libs/firebase/getClient'

export default class MyQrCode extends Component {
    state = {
        uid: '',
    }
    componentDidMount = () => {
        const { firebase } = getFirebaseClient()
        let user = firebase.auth().currentUser;
        this.setState({ uid: user.uid })
    }
    render() {
        return (
            <View style={styles.container}>
                <Image 
                    style={{width: 300, height: 300}} 
                    source={{uri: `http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=${this.state.uid}&chld=H|0`}} 
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