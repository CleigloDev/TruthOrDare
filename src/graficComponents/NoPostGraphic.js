import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';

export default function NoPost(props) {
    return (
        <View style={styles.viewText}>
            <Text style={styles.textNoPost}>
                {props.text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    viewText:{
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
    },
    textNoPost: {
        fontSize: 25, 
        flexShrink: 1 
    }
});