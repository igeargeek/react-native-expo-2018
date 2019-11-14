import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import setDatabase from '../libs/firebase/setDatabase'
import getFirebaseClient from '../libs/firebase/getClient'
import getOnce from '../libs/firebase/getOnce'

export default class CameraScanner extends Component {
    state = {
        hasCameraPermission: null,
        scanned: false,
    };

    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    };

    render() {
        const { hasCameraPermission, scanned } = this.state;
        if (hasCameraPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        }
        return (
        <View
            style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />

            {scanned && (
                <Button title={'Tap to Scan Again'} onPress={() => this.setState({ scanned: false })} />
            )}
        </View>
        );
    }

    handleBarCodeScanned = ({ type, data }) => {
        const { firebase } = getFirebaseClient()
        let user = firebase.auth().currentUser;

        getOnce(`friends/${user.uid}/${data}`).once('value').then(function(snapshot) {
            console.log('snapshot: ', snapshot);

            if(snapshot && snapshot.chatRoomID) {
                alert(`Already friends!`);
            } else {
                let timestamp = Date.now()
                setDatabase(`friends/${user.uid}/${data}`, {
                    chatRoomID: timestamp,
                })
                setDatabase(`friends/${data}/${user.uid}`, {
                    chatRoomID: timestamp,
                })
            }
        });
        
        this.setState({ scanned: true });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
});