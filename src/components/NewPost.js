import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Entypo from 'react-native-vector-icons/Entypo';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

import fontSize from '../modules/fontSize';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import { UserManager } from '../modules/UserManager.js';

export default function Post({ navigation }) {
    const [newPost, setNewPost] = useState("");
    const [showBusy, setShowBusy] = useState(false);
    const firebaseRef = firebase.firestore();

    useEffect(() => {

    }, []);

    _createPost = () => {
        setShowBusy(true);
        Promise.all([
            _getCurrentCity(),
            UserManager.getCurrentUID(navigation)
        ])
        .then(aResults => {
            const sUID = aResults[1];
            const city = aResults[0];
            firebaseRef.collection("posts").add({
                date: new Date(),
                text: newPost,
                deleted: 0,
                uid: sUID,
                location: city,
                comments: [],
                userSaved: []
            }).then(() => {
                setShowBusy(false);
                navigation.navigate("Home");
            }).catch((err) => {
                alert("Creazione post fallita! Riprovare..")
                setShowBusy(false);
            });
        }).catch(() => {
            setShowBusy(false);
        });
    };

    _getCurrentCity = () => {
        return new Promise((resolve) => {
            Geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                fetch("https://geocode.xyz/"+lat+","+long+"?geoit=json&auth=218202394355746891371x5162")
                    .then(res => res.json())
                    .then(response => {
                        resolve(response.city);
                    })
                    .catch(err => {
                        alert("Ops! Non siamo riusciti ad identificare la tua posizione 😥");
                        resolve("Unknown!Si vergogna 🤣");
                    });
            }, (error) => {
                alert("Errore!\nPost creato senza posizione");
                resolve("Unknown!Si vergogna 🤣");
            }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.viewTextInput}>
                <TextInput style={styles.textInput}
                    placeholder={"Scrivi qualcosa di carino.."}
                    value={newPost}
                    onChangeText={setNewPost}
                    autoFocus={true}
                    multiline={true}
                />
            </View>
            <TouchableOpacity style={styles.alignEnd} onPress={_createPost}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Entypo style={styles.iconAdd} name="new-message" size={30}/>
                    <Text style={styles.textButton}>Crea</Text>
                </View>
            </TouchableOpacity>
            {showBusy && <BusyIndicator text={"Creazione post..."} showBusy={showBusy}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    alignEnd: {
        alignItems: "flex-end",
        padding: 10
    },
    iconAdd: {
        color: "#d1d1d1"
    },
    textInput: {
        padding: 10, 
        paddingTop: 30, 
        fontSize: fontSize(30)
    },
    viewTextInput: {
        flex: 7, 
        paddingLeft: 5, 
        paddingRight: 5
    },
    textButton: {
        fontSize: fontSize(20), 
        marginBottom: 3, 
        paddingLeft: 5
    }
});