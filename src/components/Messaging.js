import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import fontSize from '../modules/fontSize';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import { UserManager } from '../modules/UserManager.js';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function Messaging({ route, navigation }) {
    const [uid, setUID] = useState("");
    const [uidOther, setOtherUID] = useState("");
    const [convMessages, setMessages] = useState([]);
    const [showBusy, setShowBusy] = useState(true);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotMessages;
        setShowBusy(true);
        UserManager.getCurrentUID(navigation).then(sUID => {
            const { uidCreator } = route.params;
            setOtherUID(uidCreator);
            setUID(sUID);
            snapShotMessages = _snapshotMessages();
        }).catch(() => {
            setShowBusy(false);
        });

        return () => {
            snapShotMessages();
        }
    }, []);

    _onSend = messages => {
        if(convMessages.length === 0) _createChatIntoUser();
        messages[0].user.avatar = null;
        firebaseRef.collection("chats").doc(_chatDoc())
            .collection("messages").doc(messages[0]._id).set(messages[0]);
    };

    _createChatIntoUser = () => {
        let chatDoc = _chatDoc();

        _setChatIdLogic(uid, chatDoc);
        _setChatIdLogic(uidOther, chatDoc);
    };

    _setChatIdLogic = (sUID, chatDoc) => {
        return firebaseRef.collection("users").doc(sUID).get().then((oDoc) => {
            if(oDoc.data() && oDoc.data().chats){
                let chats = oDoc.data().chats;
                let foundChat = chats.find(chatId => chatId === chatDoc);
                if(!foundChat)(
                    chats.push(chatDoc),
                    firebaseRef.collection("users").doc(sUID).update({...chats, ...oDoc.data()})
                );
            }else{
                firebaseRef.collection("users").doc(sUID).set({chats: [chatDoc]});
            }
        });
    };

    _chatDoc = () => {
        return uid > uidOther ? uid+"|"+ uidOther : uidOther+"|"+ uid;
    };

    _snapshotMessages = () => {
        return firebaseRef.collection("chats").doc(_chatDoc()).collection("messages")
            .orderBy("createdAt", "desc").onSnapshot(_loadMessages);
    };

    _loadMessages = (aDocuments) => {
        let aNewMessages = [];
        aDocuments.forEach((oDoc) => {
            const oDocData = oDoc.data();
            oDocData.createdAt = new Date(oDocData.createdAt.toDate());
            aNewMessages.push(oDocData);
        });
        const aPrintableMessages = GiftedChat.append(convMessages, aNewMessages);
        setMessages(aPrintableMessages);
        setShowBusy(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GiftedChat
                placeholder={"Scrivi un messaggio..."}
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
    }
});