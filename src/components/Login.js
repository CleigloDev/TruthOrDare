import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/messaging';

import fontSize from '../modules/fontSize';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import { UserManager } from '../modules/UserManager.js';

export default function Login({ navigation }) {
    const [showBusy, setShowBusy] = useState(true);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        UserManager.getCurrentUID(navigation)
        .then(() => {
            navigation.navigate("MainStack")
            setShowBusy(false); 
        })
        .catch(() => {
            setShowBusy(false)
        });
    }, []);

    _login = () => {
        setShowBusy(true); 
        firebase.auth()
        .signInAnonymously()
        .then(oUserInfo => {
            AsyncStorage.setItem("UID", oUserInfo.user.uid);
            _saveFirebaseToken(oUserInfo.user.uid).then(() => {
                navigation.navigate("MainStack");
            }).catch(() => {
                alert("Errore durante creazione token notifiche!");
            });
            setShowBusy(false); 
        }).catch((error) => {
            alert(error);
            setShowBusy(false); 
        });
    };

    _saveFirebaseToken = async(sUID) => {
        return new Promise(async(resolve, reject) => {
            firebase.messaging().hasPermission()
            .then(async enabled => {
                if (enabled) {
                    const fcmToken = await firebase.messaging().getToken();
                    if (fcmToken) {
                        firebaseRef.collection("users").doc(sUID).set({token: fcmToken});
                        resolve();
                    } else {
                        reject();
                    }
                } else {
                    reject();
                }
            });
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
        fontSize: fontSize(25), 
        padding: 20, 
        fontWeight: 'bold'
    }
});