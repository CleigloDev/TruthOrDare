import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Text, TouchableOpacity, Image, AsyncStorage, FlatList} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import NoPost from '../graficComponents/NoPostGraphic';
import HeaderText from '../graficComponents/HeaderTextGraphic';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import MessageListItem from '../graficComponents/MessageListItemGraphic';
import { UserManager } from '../modules/UserManager.js';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function MessageList({ route, navigation }) {
    const [uid, setUID] = useState("");
    const [chats, setChats] = useState([]);
    const [showBusy, setShowBusy] = useState(true);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotUser;
        setShowBusy(true);
        UserManager.getCurrentUID(navigation).then(sUID => {
            setUID(sUID);
            snapShotUser = _snapshotUser();
        }).catch(() => {
            setShowBusy(false);
        });

        return () => {
            snapShotUser();
        }
    }, []);

    _snapshotUser = () => {
        return firebaseRef.collection("users").doc(uid).onSnapshot(_loadUserChats);
    };

    _loadUserChats = (oDoc) => {
        if(oDoc.data()){
            const oUserInfo = oDoc.data();
            const aChats = oUserInfo.chats;
            const aChatSet = [...(new Set([...chats,...aChats]))];
            setChats(aChatSet);
            setShowBusy(false);
        }
    };

    _navigateToChat = (chatID) => {
        const aUIDChat = chatID.split("|");
        const sUIDCreator = aUIDChat[0] === uid ? aUIDChat[1] : aUIDChat[0];
        navigation.navigate("Chat", {
            uidCreator: sUIDCreator
        });
    };

    _renderChatItem = ({item, index}) => {
        return (
            <MessageListItem navigateToChat={_navigateToChat.bind(this, item)} chatID={item}/>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {chats && chats.length > 0 ?
                <>
                    <HeaderText text={"Chat attive"}/>
                    <View style={{flex: 3}}>
                        <FlatList
                            data={chats}
                            extraData={chats}
                            renderItem={_renderChatItem}
                            keyExtractor={(item, index) => 'key'+index}
                        />
                    </View> 
                </> : <NoPost text={"Ehi sembra non ci sia alcuna chat attiva!"}/>}
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