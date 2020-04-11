import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, FlatList, View} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import HeaderText from '../graficComponents/HeaderTextGraphic';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
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
    const [showBusy, setShowBusy] = useState(true);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotPost;
        UserManager.getCurrentUID(navigation).then(sUID => {
            setUID(sUID);
            snapShotPost = _snapshotPosts();
        }).catch(() => {
            setShowBusy(false);
        });
        return () => {
            snapShotPost();
        };
    }, []);

    _deletePost = (sPostKey) => {
        firebaseRef.collection("posts").doc(sPostKey).update({deleted: 1});
    };

    _snapshotPosts = () => {
        return firebaseRef.collection("posts").where("userSaved", "array-contains", uid)
            .where("deleted", "==", 0)
            .orderBy("date", "desc").onSnapshot(_loadPosts);
    };

    _loadPosts = (aDocuments) => {
        let aDocData = [];
        if(aDocuments && aDocuments.docs.length > 0){
            aDocuments.forEach((oDoc) => {
                if(oDoc && oDoc.data && oDoc.data().deleted === 0){
                    aDocData.push(Object.assign({}, { 
                            id: oDoc.id, 
                            data: oDoc.data()
                        }
                    ));
                }
            });
        }
        setPosts(aDocData);
        setShowBusy(false);
    };

    _navigateDetail = (item) => {
        navigation.navigate("PostDetail", {
            "postKey": item.id
        });
    };

    _renderItemPost = ({item, index}) => {
        return (
            <PostGraphic text={item.data.text} location={item.data.location}
                uidCreator={item.data.uid} uidCurrent={uid} comments={item.data.comments.length}
                chat={_navigateChat.bind(this, item.data.uid)}
                navigate={_navigateDetail.bind(this, item)}>
                    <ToolTipPost uidCreator={item.data.uid} uidCurrent={uid}
                        delete={_deletePost.bind(this, item.id)} 
                        save={null} flag={() => {}} />
            </PostGraphic>
        );
    };

    _navigateChat = (sUIDCreator) => {
        navigation.navigate("Chat", {
            uidCreator: sUIDCreator
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {posts.length > 0 ?
                <>
                    <HeaderText text={"Post salvati"}/>
                    <View style={{flex: 3}}>
                        <FlatList
                            keyExtractor={(item, index) => 'key'+index}
                            data={posts}
                            extraData={posts}
                            renderItem={_renderItemPost}
                        />
                    </View>
                </>
            : <NoPost text={"Nessun post salvato!"}/>}
            {showBusy && <BusyIndicator text={"Caricamento..."} showBusy={showBusy}/>}
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