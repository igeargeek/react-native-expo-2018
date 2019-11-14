import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';

export default class FlatListBasics extends Component {
    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.chatData}
                    keyExtractor={item => item.chatId}
                    renderItem={({ item }) =>
                        <TouchableHighlight onPress={() => {
                            navigate('Chat', item)
                        }} style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                            <View style={{flexDirection: 'row', marginHorizontal: 10, marginVertical: 5, alignItems: 'flex-start'}}>
                                <Image source={{uri: item.avatar}} style={{width: 60, height: 60, borderRadius: 30}} />
                                <Text style={styles.item}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});