import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, FlatList, View} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import HeaderLocation from '../graficComponents/HeaderLocationGraphic';
import PostGraphic from '../graficComponents/PostGraphic';
import ToolTipPost from '../graficComponents/ToolTipPostGraphic';
import NoPost from '../graficComponents/NoPostGraphic';
import TabBar from '../graficComponents/TabBarGraphic';
import { UserManager } from '../modules/UserManager.js';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function Post({ navigation }) {
    const [uid, setUID] = useState("");
    const [posts , setPosts] = useState([]);
    const [showBusy, setShowBusy] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        let snapShotPost;
        let snapShotChatUser;
        setShowBusy(true);
        UserManager.getCurrentUID(navigation).then(sUID => {
            setUID(sUID);
            snapShotPost = _snapshotPosts();
            snapShotChatUser = _snapshotChatUser();
        }).catch(() => {
            setShowBusy(false);
        });

        return () => {
            snapShotPost();
            snapShotChatUser();
        };
    }, []);

    _deletePost = (sPostKey) => {
        firebaseRef.collection("posts").doc(sPostKey).update({deleted: 1});
    };

    _savePost = (postInfo, postID) => {
        firebaseRef.collection("posts").doc(postID).get()
        .then((oDoc) => {
            if(oDoc && oDoc.data()){
                const docData = oDoc.data();
                let { userSaved } = docData;
                const bAlreadyLiked = userSaved.includes(uid);
                if(!bAlreadyLiked){
                    userSaved.push(uid);
                    firebaseRef.collection("posts").doc(postID).update({userSaved});
                }else{
                    alert("Perché provi a salvarlo di nuovo?😂");
                }
            }
        })
        .catch(() => {
            alert("Ops! Errore durante il salvataggio 😥");
        });
    };

    _snapshotPosts = () => {
        return firebaseRef.collection("posts").where("deleted", "==", 0).orderBy("date", "desc").onSnapshot(_loadPosts);
    };

    _snapshotChatUser = () => {
        return firebaseRef.collection("users").doc(uid).onSnapshot(_showNotification);
    };

    _showNotification = (oDoc) => {
        if(oDoc.data()){
            const oUserData = oDoc.data();
            var oMetadata = oDoc.metadata;
            if(oUserData && oMetadata && !oMetadata.fromCache && oUserData.showIncomingMessages){
                setShowNotification(true);
            }else{
                setShowNotification(false);
            }
        }else{
            setShowNotification(false);
        }
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

    _navigateSave = () => {
        navigation.navigate("SavedPosts");
    };

    _navigateChat = (sUIDCreator) => {
        navigation.navigate("Chat", {
            uidCreator: sUIDCreator
        });
    };

    _navigateMessagesList = () => {
        firebaseRef.collection("users").doc(uid).update({showIncomingMessages: false});
        navigation.navigate("MessageList");
    };

    _renderItemPost = ({item, index}) => {
        return (
            <PostGraphic text={item.data.text} location={"Roma"} chat={_navigateChat.bind(this, item.data.uid)}
                uidCreator={item.data.uid} uidCurrent={uid} comments={item.data.comments.length}
                navigate={_navigateDetail.bind(this, item)}>
                    <ToolTipPost uidCreator={item.data.uid} uidCurrent={uid}
                        delete={_deletePost.bind(this, item.id)} 
                        save={_savePost.bind(this, item.data, item.id)} flag={() => {}} />
            </PostGraphic>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{flex: 3}}>
                <HeaderLocation />
                <View style={{flex: 3}}>
                    {posts.length > 0 ?
                        <FlatList
                            keyExtractor={(item, index) => 'key'+index}
                            data={posts}
                            extraData={posts}
                            renderItem={_renderItemPost}
                        />
                    : <NoPost text={"Ehi sembra non ci sia nessuno qui!\nScrivi il primo post! 😉"}/>}
                </View>
            </View>
            <View style={{...styles.viewFlex, ...styles.viewShadow}}>
                <TabBar centerAction={() => {navigation.navigate("NewPost")}} 
                    leftAction={_navigateMessagesList} showNotificationLeft={showNotification}
                    rightAction={_navigateSave}/>
            </View>
            {showBusy && <BusyIndicator text={"Caricamento..."} showBusy={showBusy}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    viewFlex: {
        flex: 0.20,
        backgroundColor: "white"
    },
    viewShadow: {
        shadowOpacity: 0.5,
        shadowColor: "black",
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        elevation: 2,
    },
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    }
});