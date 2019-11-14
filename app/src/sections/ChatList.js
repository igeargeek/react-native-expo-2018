import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

export default class FlatListBasics extends Component {
    render() {
        const { navigate } = this.props.navigation
        return (
            <View style={styles.container}>
                <FlatList
                    data={[
                        { key: 'Devin' },
                        { key: 'Jackson' },
                        { key: 'James' },
                        { key: 'Joel' },
                        { key: 'John' },
                        { key: 'Jillian' },
                        { key: 'Jimmy' },
                        { key: 'Julie' },
                    ]}
                    renderItem={({ item }) =>
                        <TouchableHighlight onPress={() => {
                            navigate('Chat', {
                                chatId: 'dhjpNUeSAvMREHAT5hu45P612jf',
                                uid: 'PoDYlOmraAXDHdpW6li8X7aJHdj2',
                                avatar: 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png',
                                name: 'Bot'
                            })
                        }} style={{ borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                            <Text style={styles.item}>{item.key}</Text>
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