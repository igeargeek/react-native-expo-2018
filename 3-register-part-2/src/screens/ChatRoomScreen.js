import React from "react";
import { View, TouchableHighlight, Text, TouchableOpacity } from "react-native";
import logout from "../libs/firebase/logout";
import { Ionicons } from "@expo/vector-icons";

class ChatRoomScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Chat room",
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("AddFriend");
        }}
        style={{ padding: 10 }}
      >
        <Ionicons name="md-person-add" size={32} color="#333" />
      </TouchableOpacity>
    ),
    headerLeft: () => (
      <TouchableHighlight
        onPress={() => {
          logout()
            .then(data => {
              navigation.replace("LoginScreen");
            })
            .catch(error => {
              console.log(error);
              alert("user ไม่ถูกต้อง");
            });
        }}
        style={{ padding: 10 }}
      >
        <Text>Logout</Text>
      </TouchableHighlight>
    )
  });

  render() {
    return (
      <View>
        <Text>Welcome to I Gear Geek</Text>
      </View>
    );
  }
}

export default ChatRoomScreen;
