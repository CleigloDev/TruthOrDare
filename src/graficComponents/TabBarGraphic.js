import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function busyIndicator(props) {
    return (
        <>
            <View style={styles.buttonLeft}>
                <TouchableOpacity onPress={props.leftAction} style={styles.alignCenter}>
                    <Ionicons name="logo-snapchat" size={30}/>
                    <Text>Ghost Chat</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonRight}>
                <TouchableOpacity onPress={props.rightAction} style={styles.alignCenter}>
                    <MaterialIcons name="favorite-border" size={30}/>  
                    <Text style={{fontSize: 15}}>Post Salvati</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    buttonLeft: {
        position: 'absolute',
        left: 60,
        bottom: 30,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonRight: {
        position: 'absolute',
        right: 35,
        bottom: 30,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    alignCenter: {
        backgroundColor: 'white',
        alignItems: 'center', 
        justifyContent: 'center'
    }
});