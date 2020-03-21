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
        alignItems: 'center',
        justifyContent: 'center'
    },
    textNoPost: {
        fontSize: 20, 
        flexShrink: 1 
    }
});