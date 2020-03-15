import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, StatusBar, FlatList} from 'react-native';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

export default function Post({ navigation }) {
    const [posts , setPosts] = useState([]);
    const firebaseRef = firebase.firestore();

    useEffect(() => { 
        firebaseRef.collection("test").get().then((aDocuments) => {
            let aDocData = [];
            aDocuments.forEach((oDoc) => {
                aDocData.push(oDoc.data());
            });
            setPosts(aDocData);
        }).catch((oErr) => {
            var x = oErr;
        });
    }, [])

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                keyExtractor={(item, index) => 'key'+index}
                data={posts}
                extraData={posts}
                renderItem={({item}) => {
                    return (
                        <Text>{item.id}</Text>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    }
});