import React, { Component } from 'react'
import { Text, View, Button, TouchableOpacity } from 'react-native'
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default class CameraScreen extends Component {
    state = {
        hasCameraPermission: false,
        type: Camera.Constants.Type.back,
    };

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const statusCamera = await Permissions.askAsync(Permissions.CAMERA);
        if (statusCamera.status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
        this.setState({ hasCameraPermission: true });
    }

    snap = async () => {
        if (this.camera) {
            let photo = await this.camera.takePictureAsync();
            const { navigation } = this.props;
            navigation.goBack();
            navigation.state.params.onTakePhoto(photo.uri);
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Camera
                ref={ref => {
                    this.camera = ref;
                }}
                style={{ flex: 2 }} 
                type={this.state.type}>
                <View
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity
                        style={{
                        flex: 0.1,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        }}
                        onPress={() => {
                        this.setState({
                            type:
                            this.state.type === Camera.Constants.Type.back
                                ? Camera.Constants.Type.front
                                : Camera.Constants.Type.back,
                        });
                        }}>
                        <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                    title="shoot"
                    onPress={this.snap}
                />
            </View>
            
        </View>
        )
    }
}