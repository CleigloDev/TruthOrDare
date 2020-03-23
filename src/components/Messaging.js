import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Text} from 'react-native';
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
    const [isWriting, setIsWriting] = useState(false);
    const [showBusy, setShowBusy] = useState(true);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotMessages;
        var snapShotIsWriting;
        setShowBusy(true);
        UserManager.getCurrentUID(navigation).then(sUID => {
            const { uidCreator } = route.params;
            setOtherUID(uidCreator);
            setUID(sUID);
            snapShotMessages = _snapshotMessages();
            snapShotIsWriting = _snapshotIsWriting();
        }).catch(() => {
            setShowBusy(false);
        });

        return () => {
            snapShotMessages();
            snapShotIsWriting();
        }
    }, []);

    _onSend = messages => {
        _createChatIntoUser();
        messages[0].user.avatar = null;
        firebaseRef.collection("chats").doc(_chatDoc())
            .collection("messages").doc(messages[0]._id).set(messages[0]);
        _setUserIsWriting("");
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
                let oUserUpdate = oDoc.data();
                if(!foundChat)(
                    chats.push(chatDoc),
                    oUserUpdate.chats = chats
                );
                oUserUpdate = sUID === uidOther ? 
                    {...oUserUpdate, ...{showIncomingMessages: true}} : oUserUpdate;
                firebaseRef.collection("users").doc(sUID).update(oUserUpdate)
            }else{
                let oUserUpdate = {chats: [chatDoc]};
                oUserUpdate = sUID === uidOther ? 
                    {...oUserUpdate, ...{showIncomingMessages: true}} : oUserUpdate;
                firebaseRef.collection("users").doc(sUID).set(oUserUpdate);
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

    _snapshotIsWriting = () => {
        return firebaseRef.collection("chats").doc(_chatDoc())
        .collection("messages").doc("isWriting"+uid).onSnapshot(_setIsWriting);
    };

    _setUserIsWriting = (text) => {
        if(text !== ""){
            firebaseRef.collection("chats").doc(_chatDoc())
                .collection("messages").doc("isWriting"+uidOther).set({isWriting: true});
        }else{
            firebaseRef.collection("chats").doc(_chatDoc())
                .collection("messages").doc("isWriting"+uidOther).set({isWriting: false});
        }
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

    _setIsWriting = (oDoc) => {
        const oDocData = oDoc.data();
        if(oDocData && oDocData.isWriting){
            setIsWriting(true);
        }else{
            setIsWriting(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{flex: 1}}>
                    <View style={styles.viewWriting}>
                        {isWriting ? <Text style={styles.textWriting}>Sta scrivendo...</Text> : <></>}
                    </View>
                <View style={{flex: 2}}>
                    <GiftedChat
                        placeholder={"Scrivi un messaggio..."}
                        messages={convMessages}
                        user={{
                            _id: uid
                        }}
                        onInputTextChanged={text => _setUserIsWriting(text)}
                        onSend={messages => _onSend(messages)}
                    />
                </View>
                {convMessages.length > 0 ? <></> :
                    <View style={styles.viewNoMessages}>
                        <Text style={styles.textNoMessages}>{"Su non essere timido!\nScrivi qualcosa 😉"}</Text>
                    </View>}
            </View>
            {showBusy && <BusyIndicator text={"Apertura conversazione..."} showBusy={showBusy}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    textNoMessages: {
        paddingTop: 50,
        fontSize: fontSize(20), 
        flexShrink: 1 
    },
    viewNoMessages: {
        position: 'absolute', 
        bottom: 0, 
        right: 0, 
        left: 0, 
        top: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '90%'
    },
    textWriting: {
        color: 'gray', 
        paddingTop: 10
    },
    viewWriting: {
        flex: 0.1,
        alignItems: 'center', 
        backgroundColor: '#F9F9F9'
    }
});