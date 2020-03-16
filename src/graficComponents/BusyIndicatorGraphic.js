import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';

export default function Post(props) {
    return (
        <View style={styles.busyIndicator}>
            <ActivityIndicator animating={props.showBusy} size="large"/>
            <Text>{props.text ? props.text : ""}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    busyIndicator:{
        flex: 1,
        backgroundColor: "white",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});