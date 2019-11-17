import React, { Component } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default class CameraScreen extends Component {
  state = {
    hasCameraPermission: false,
    type: Camera.Constants.Type.back
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const statusCamera = await Permissions.askAsync(Permissions.CAMERA);
    if (statusCamera.status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    this.setState({ hasCameraPermission: true });
  };

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      const { navigation } = this.props;
      navigation.goBack();
      console.log(navigation.state.params);
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
          type={this.state.type}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                margin: 15
              }}
              onPress={() => {
                this.setState({
                  type:
                    this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                });
              }}
            >
              <Ionicons name="md-reverse-camera" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </Camera>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TouchableOpacity title="Open Camera" onPress={this.snap}>
            <View
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#606060",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 30,
                margin: 10
              }}
            >
              <Ionicons name="md-camera" size={32} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
