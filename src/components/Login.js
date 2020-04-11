import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import fontSize from '../modules/fontSize';

export default function Login(props) {
    const firebaseRef = firebase.firestore();

    useState(() => {
        //props.setShowBusy(false);
    }, []);

    _login = () => {
        props.setShowBusy(true); 
        firebase.auth()
        .signInAnonymously()
        .then(oUserInfo => {
            const { user } = oUserInfo;
            const { uid } = user;
            AsyncStorage.setItem("UID", uid);
            _saveFirebaseToken(uid).then(() => {
                _redirectToMain(uid);
            }).catch(() => {
                alert("Errore durante creazione token notifiche!");
                _redirectToMain(uid);
            });
        }).catch((error) => {
            alert(error);
            props.setShowBusy(false); 
        });
    };

    _redirectToMain = (uid) => {
        props.setUID(uid);
        props.setShowBusy(false); 
    };

    _saveFirebaseToken = async(sUID) => {
        return new Promise(async(resolve, reject) => {
            firebase.messaging().hasPermission()
            .then(async enabled => {
                if (enabled) {
                    const fcmToken = await firebase.messaging().getToken();
                    if (fcmToken) {
                        firebaseRef.collection("users").doc(sUID).set({token: fcmToken})
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#313a4a"
    },
    iconLogin:{
        flex: 1,
        backgroundColor: "#313a4a",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapper: {
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "white",
        padding: 50
    },
    image: {
        height: 100, 
        width: 100,
    },
    text: {
        fontSize: fontSize(25), 
        fontWeight: 'bold',
        color: "#d1d1d1",
        marginTop: 20,
    }
});