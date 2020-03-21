import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import AsyncText from '../AsyncComponents/AsyncText';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function MessageListItem(props) {
    const firebaseRef = firebase.firestore();

    _getLastMessage = () => {
        return firebaseRef.collection("chats").doc(props.chatID).collection("messages")
            .orderBy("createdAt", "desc").limit(1).get();
    };

    return (
        <>
            <TouchableOpacity style={styles.viewWrapper} 
                onPress={props.navigateToChat.bind(this, props.chatID)}>
                    <View>
                        <Text style={styles.textHeader}>Ultimo messaggio:</Text>
                        <AsyncText style={styles.textAsync} textPromise={_getLastMessage()}/>
                        {//TODO: add Date for new Messages
                        /*<View style={{alignItems: 'flex-end'}}>
                            <Text style={{paddingRight: 15, paddingBottom: 5}}>Ciao</Text>
                        </View>*/}
                    </View>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    viewWrapper: {
        marginTop: 30, 
        margin: 30, 
        marginBottom: 0,
        borderRadius: 25, 
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgray',
        justifyContent: 'center'
    },
    textHeader: {
        paddingTop: 10, 
        paddingLeft: 10, 
        fontSize: 13
    },
    textAsync: {
        padding: 20, 
        flexShrink: 1, 
        fontSize: 17
    }
});