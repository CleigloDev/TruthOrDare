import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, FlatList, View, PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
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

export default function Post({ navigation, route }) {
    const [uid, setUID] = useState("");
    const [posts , setPosts] = useState([]);
    const [showBusy, setShowBusy] = useState(true);
    const [userCoords, setUserCoords] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    const [forceReload, setForceReload] = useState(false);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        let snapShotPost;
        let snapShotChatUser;
        setShowBusy(true);
        const { uidSender } = route.params;
        if(uidSender){
            route.params.uidSender = null;
            return _navigateChat(uidSender, setForceReload);
        }
        Promise.all([
            _getCurrentPosition(),
            UserManager.getCurrentUID(navigation)
        ]).then(aResults => {
            const sUID = aResults[1];
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
    }, [forceReload]);

    _getCurrentPosition = () => {
        return new Promise((resolve) => {
            let aPermissionPromise = [];
            if(Platform.OS === "android"){
                aPermissionPromise = [_getLocationPermission()];
            }
            Promise.all(aPermissionPromise)
            .then(() => {
                Geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const long = position.coords.longitude;
                    const oUserCoords = {
                        lat,
                        long
                    };
                    setUserCoords(oUserCoords);
                    resolve();
                }, (error) => {
                    alert("Errore!\nImpossibile determinare la posizione\nHai acceso il GPS? 🤔");
                    resolve();
                }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 });
            })
            .catch(() => {
                alert("Errore!\nImpossibile determinare la posizione\nHai acceso il GPS? 🤔");
                resolve();
            });
        });
    };

    _getLocationPermission = () => {
        return new Promise((resolve, reject) => {
            try{
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                    title: "TruthOrDare Location Permission",
                    message:
                        "Ehi! Abbiamo bisogno della tua posizione",
                    buttonNegative: "Cancella",
                    buttonPositive: "Ok"
                    }
                ).then((granted) => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(() => {
                    reject();
                });
            }catch(err){
                reject();
            }
        });
    };

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
                    firebaseRef.collection("posts").doc(postID).update({userSaved})
                    .then(() => {
                        _showToast("Post salvato con successo!", "LONG");
                    })
                    .catch(() => {
                        alert("Ops! Qualcosa è andato storto nel salvataggio 😥");
                    });
                }else{
                    _showToast("Perché provi a salvarlo di nuovo?😂", "LONG");
                }
            }
        })
        .catch(() => {
            alert("Ops! Errore durante il salvataggio 😥");
        });
    };

    _showToast = (sMessage, sDuration) => {
        ToastAndroid.showWithGravity(sMessage,
            ToastAndroid[sDuration],
            ToastAndroid.CENTER
        );
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

    _navigateChat = (sUIDCreator, setForceReload) => {
        let forceReloadParam = setForceReload && typeof setForceReload === "function" ? function(){
            setForceReload(!forceReload);
        } : null;
        navigation.navigate("Chat", {
            uidCreator: sUIDCreator,
            forceReload: forceReloadParam
        });
    };

    _navigateMessagesList = () => {
        firebaseRef.collection("users").doc(uid).update({showIncomingMessages: false});
        navigation.navigate("MessageList");
    };

    _renderItemPost = ({item, index}) => {
        return (
            <PostGraphic text={item.data.text} location={item.data.location} chat={_navigateChat.bind(this, item.data.uid)}
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
                <HeaderLocation userCoords={userCoords}/>
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