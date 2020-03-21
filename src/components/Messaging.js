import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage, FlatList} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import { UserManager } from '../modules/UserManager.js';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function Login({ navigation }) {
    const [uid, setUID] = useState("");
    const [convMessages, setMessages] = useState([]);
    const [showBusy, setShowBusy] = useState(true);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotMessages;
        setShowBusy(true);
        UserManager.getCurrentUID(navigation).then(sUID => {
            setUID(sUID);
            snapShotMessages = _snapshotMessages();
            setShowBusy(false);
        }).catch(() => {
            setShowBusy(false);
        });
    }, []);

    _onSend = messages => {
        messages[0].user.avatar = null;
        firebaseRef.collection("chats").doc(uid+"|"+uid)
            .collection("messages").doc(messages[0]._id).set(messages[0]);
    };

    _snapshotMessages = () => {
        return firebaseRef.collection("chats").doc(uid+"|"+uid).collection("messages")
            .orderBy("createdAt", "desc").onSnapshot(_loadMessages);
    };

    _loadMessages = (aDocuments) => {
        var aNewMessages = [];
        aDocuments.forEach((oDoc) => {
            aNewMessages.push(oDoc.data());
        });
        var aPrintableMessages = GiftedChat.append(convMessages, aNewMessages);
        setMessages(aPrintableMessages);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GiftedChat
                messages={convMessages}
                user={{
                    _id: uid
                }}
                onSend={messages => _onSend(messages)}
            />
            {showBusy && <BusyIndicator text={"Avvio l'app.."} showBusy={showBusy}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    textContent: {
        flexShrink: 1, 
        fontSize: 20,
        paddingBottom: 30,
        padding: 10
    },
});