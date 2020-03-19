import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import { UserManager } from '../modules/UserManager.js';

export default function Login({ navigation }) {
    const [showBusy, setShowBusy] = useState(true);

    useEffect(() => {
        UserManager.getCurrentUID(navigation)
        .then(() => {
            setShowBusy(false); 
            navigation.navigate("MainStack")
        })
        .catch(() => {
            setShowBusy(false)
        });
    }, []);

    _login = () => {
        firebase.auth()
        .signInAnonymously()
        .then(oUserInfo => {
            AsyncStorage.setItem("UID", oUserInfo.user.uid);
            navigation.navigate("MainStack");
        }).catch((error) => {
            alert(error);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.iconLogin}>
            <TouchableOpacity style={styles.wrapper} onPress={_login}>
                <Image source={require('../icons/iconLogin.png')} style={styles.image}/>
                <Text style={styles.text}>Login Anonimo</Text>
            </TouchableOpacity>
            </View>
            {showBusy && <BusyIndicator text={"Avvio l'app.."} showBusy={showBusy}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    iconLogin:{
        flex: 1,
        backgroundColor: "white",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {
        alignItems: "center"
    },
    image: {
        height: 100, 
        width: 100
    },
    text: {
        fontSize: 25, 
        padding: 20, 
        fontWeight: 'bold'
    }
});