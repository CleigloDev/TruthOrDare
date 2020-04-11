import React from 'react';
import {StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Platform} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TabBar(props) {
    return (
        <>
            <View style={styles.mainView}>
                <View style={styles.viewWrapper}>
                    <TouchableOpacity onPress={props.leftAction} style={styles.buttonAdd}>
                        {props.showNotificationLeft ?
                            <View style={styles.newMessageView}/> : <></>}
                        <Ionicons name="logo-snapchat" size={30} color="#d1d1d1"/>
                        <Text style={{fontSize: 15, color: "#d1d1d1"}}>Ghost Chat</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewWrapper}>
                    <TouchableOpacity style={styles.buttonAdd} onPress={props.centerAction}>
                        <MaterialIcons style={styles.iconAdd} name="add-circle-outline" size={70}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.viewWrapper}>
                    <TouchableOpacity onPress={props.rightAction} style={styles.alignCenter}>
                        <MaterialIcons name="favorite-border" size={30} color="#d1d1d1"/>  
                        <Text style={{fontSize: 15, color: "#d1d1d1"}}>Post Salvati</Text>
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
        backgroundColor: '#252c38',
        alignItems: 'center', 
        justifyContent: 'center'
    },
    buttonAdd: {
        borderRadius: 30,
        backgroundColor: '#252c38',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconAdd: {
        backgroundColor: 'transparent',
        color: "#d1d1d1",
        paddingBottom: Platform.OS === 'ios' ? 100 : 30
    },
    newMessageView: {
        backgroundColor: '#f28d07', 
        height: 10, 
        width: 10, 
        position: 'absolute',
        left: 20,
        bottom: 45, 
        borderRadius: 30
    }
});