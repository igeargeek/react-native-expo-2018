import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
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

    // 4.15 เพิ่ม componentDidMount และ getPermissionsAsync
    async componentDidMount() {
        this.getPermissionsAsync();
    }

    getPermissionsAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    };

    // 4.17 เพิ่ม handleBarCodeScanned
    handleBarCodeScanned = ({ type, data }) => {
        const { firebase } = getFirebaseClient()
        let user = firebase.auth().currentUser;
    
        getOnce(`friends/${user.uid}/${data}`).once('value').then(snapshot => {
            if(snapshot.val()) {
                Alert.alert(
                    'Sorry',
                    'Your are both already friends!',
                    [
                      {text: 'OK', onPress: () => this.props.onChangePage() }, // call props to change page
                    ],
                  );
            } else {
                let timestamp = Date.now()
                setDatabase(`friends/${user.uid}/${data}`, { // path firebase to create friends database
                    chatRoomID: timestamp,
                })
                setDatabase(`friends/${data}/${user.uid}`, { // path firebase to create friends database
                    chatRoomID: timestamp,
                })
                this.props.onChangePage()
            }
        });
        
        this.setState({ scanned: true });
    }

    render() {
      // 4.16 เพิ่ม render 
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
});