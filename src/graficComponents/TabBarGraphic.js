import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function busyIndicator(props) {
    return (
        <>
            <View style={styles.mainView}>
                <View style={styles.viewWrapper}>
                    <TouchableOpacity onPress={props.leftAction} style={styles.buttonAdd}>
                        <Ionicons name="logo-snapchat" size={30}/>
                        <Text>Ghost Chat</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewWrapper}>
                    <TouchableOpacity style={styles.buttonAdd} onPress={props.centerAction}>
                        <MaterialIcons style={styles.iconAdd} name="add-circle-outline" size={70}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewWrapper}>
                    <TouchableOpacity onPress={props.rightAction} style={styles.alignCenter}>
                        <MaterialIcons name="favorite-border" size={30}/>  
                        <Text style={{fontSize: 15}}>Post Salvati</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row', 
        flex: 1,
        justifyContent: 'space-between'
    },
    viewWrapper: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    alignCenter: {
        backgroundColor: 'white',
        alignItems: 'center', 
        justifyContent: 'center'
    },
    buttonAdd: {
        borderRadius: 30,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconAdd: {
        backgroundColor: 'transparent',
        color: "#d1d1d1",
        paddingBottom: 100
    }
});