import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';

export default function Post({ navigation }) {
    const [newPost, setNewPost] = useState("");
    const [showBusy, setShowBusy] = useState(false);
    const firebaseRef = firebase.firestore();

    useEffect(() => {

    }, []);

    _createPost = () => {
        setShowBusy(true);
        firebaseRef.collection("posts").add({
            date: new Date(),
            text: newPost,
            deleted: 0
        }).then(() => {
            setShowBusy(false);
            navigation.navigate("Home");
        }).catch((err) => {
            alert("Creazione post fallita! Riprovare..")
            setShowBusy(false);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.viewTextInput}>
                <TextInput style={styles.textInput}
                    placeholder={"Scrivi qualcosa di carino.."}
                    value={newPost}
                    onChangeText={setNewPost}
                    multiline={true}
                />
            </View>
            <TouchableOpacity style={styles.alignEnd} onPress={_createPost}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Entypo style={styles.iconAdd} name="new-message" size={30}/>
                    <Text style={styles.textButton}>Crea</Text>
                </View>
            </TouchableOpacity>
            {showBusy && <BusyIndicator text={"Creazione commento..."} showBusy={showBusy}/>}
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
        fontSize: 30
    },
    viewTextInput: {
        flex: 7, 
        paddingLeft: 5, 
        paddingRight: 5
    },
    textButton: {
        fontSize: 20, 
        marginBottom: 3, 
        paddingLeft: 5
    }
});