import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class CameraScanner extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Camera</Text>
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