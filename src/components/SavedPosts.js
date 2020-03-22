import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, FlatList, TouchableOpacity, View, Text} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import fontSize from '../modules/fontSize';
import PostGraphic from '../graficComponents/PostGraphic';
import ToolTipPost from '../graficComponents/ToolTipPostGraphic';
import NoPost from '../graficComponents/NoPostGraphic';
import { UserManager } from '../modules/UserManager.js';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function SavedPost({ navigation }) {
    const [uid, setUID] = useState("");
    const [posts , setPosts] = useState([]);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotPost;
        UserManager.getCurrentUID(navigation).then(sUID => {
            setUID(sUID);
            snapShotPost = _snapshotPosts();
        }).catch(() => {
            //setShowBusy(false);
        });
        return () => {
            snapShotPost();
        };
    }, []);

    _deletePost = (sPostKey, sPostSavedKey) => {
        firebaseRef.collection("posts").doc(sPostKey).update({deleted: 1});
        firebaseRef.collection("users").doc(uid).collection("savedPosts").doc(sPostSavedKey).update({deleted: 1});
    };

    _snapshotPosts = () => {
        return firebaseRef.collection("users").doc(uid).collection("savedPosts")
        .orderBy("date", "desc").onSnapshot(_loadPosts);
    };

    _loadPosts = (aDocuments) => {
        let aDocData = [];
        aDocuments.forEach((oDoc) => {
            if(oDoc && oDoc.data && oDoc.data().deleted === 0){
                aDocData.push(Object.assign({}, { 
                        id: oDoc.id, 
                        data: oDoc.data()
                    }
                ));
            }
        });
        setPosts(aDocData);
    };

    _navigateDetail = (item) => {
        navigation.navigate("PostDetail", {
            "postKey": item.data.id
        });
    };

    _renderItemPost = ({item, index}) => {
        return (
            <PostGraphic text={item.data.text} location={"Roma"}
                navigate={_navigateDetail.bind(this, item)}>
                    <ToolTipPost uidCreator={item.data.uid} uidCurrent={uid}
                        delete={_deletePost.bind(this, item.data.id, item.id)} 
                        save={null} flag={() => {}} />
            </PostGraphic>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {posts.length > 0 ?
                <FlatList
                    keyExtractor={(item, index) => 'key'+index}
                    data={posts}
                    extraData={posts}
                    renderItem={_renderItemPost}
                />
            : <NoPost text={"Nessun post salvato!"}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    buttonAdd: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 50,
        zIndex: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconAdd: {
        color: "#d1d1d1"
    }
});