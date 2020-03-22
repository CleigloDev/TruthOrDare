import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import fontSize from '../modules/fontSize';

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
        fontSize: fontSize(20), 
        flexShrink: 1 
    }
});