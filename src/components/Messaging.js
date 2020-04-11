import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, StatusBar, Platform, Text, TouchableOpacity, Dimensions, BackHandler, PermissionsAndroid} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

import ImageMessageGraphic from '../graficComponents/ImageMessageGraphic';
import fontSize from '../modules/fontSize';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import { UserManager } from '../modules/UserManager.js';

const { height: screenHeight } = Dimensions.get('window');

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function Messaging({ route, navigation }) {
    const [uid, setUID] = useState("");
    const [uidOther, setOtherUID] = useState("");
    const [convMessages, setMessages] = useState([]);
    const [isWriting, setIsWriting] = useState("");
    const [showBusy, setShowBusy] = useState(true);
    const [imageURL, setImageURL] = useState("");
    const [newTextImage, setNewTextImage] = useState("");
    const [firebaseLastDoc, setFirebaseLastDoc] = useState({});
    const [loadingEarlier, setLoadingEarlier] = useState(false);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapShotMessages;
        var snapShotIsWriting;
        setShowBusy(true);

        const backHandler = BackHandler.addEventListener("hardwareBackPress", _backAction);
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
            backHandler.remove();
        }
    }, []);

    _backAction = () => {
        const { forceReload } = route.params;
        imageURL !== "" ? setImageURL("") : 
            ((forceReload ? forceReload() : null), navigation.goBack());
        return true;
    };

    _onSend = messages => {
        _createChatIntoUser();
        messages[0].user.avatar = null;
        messages[0].uidOther = uidOther;
        firebaseRef.collection("chats").doc(_chatDoc())
            .collection("messages").doc(messages[0]._id).set(messages[0]).then(() => {
                _setUserIsWriting("");
            }).catch(() => {
                alert("Invio del messaggio fallito!😥 Riprova");
                _setUserIsWriting("");
            });
    };

    _createChatIntoUser = () => {
        let chatDoc = _chatDoc();

        _setChatIdLogic(uid, chatDoc);
        _setChatIdLogic(uidOther, chatDoc);
    };

    _setChatIdLogic = (sUID, chatDoc) => {
        return firebaseRef.collection("users").doc(sUID).get().then((oDoc) => {
            if(oDoc.data()){
                let chats = oDoc.data().chats ? oDoc.data().chats : [];
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
            .orderBy("createdAt", "desc").limit(40).onSnapshot(_loadMessages);
    };

    _snapshotIsWriting = () => {
        return firebaseRef.collection("chats").doc(_chatDoc())
        .collection("messages").doc("isWriting"+uid).onSnapshot(_setIsWriting);
    };

    _setUserIsWriting = (sType) => {
        if(newTextImage !== "" && sType === "TEXT"){
            firebaseRef.collection("chats").doc(_chatDoc())
                .collection("messages").doc("isWriting"+uidOther).set({isWriting: true, isSendingPic: false});
        }else if(imageURL !== "" && sType === "IMAGE"){
            firebaseRef.collection("chats").doc(_chatDoc())
                .collection("messages").doc("isWriting"+uidOther).set({isWriting: false, isSendingPic: true});
        }else{
            firebaseRef.collection("chats").doc(_chatDoc())
                .collection("messages").doc("isWriting"+uidOther).set({isWriting: false, isSendingPic: false});
        }
    };

    _loadMessages = (aDocuments) => {
        let aNewMessages = [];
        aDocuments.forEach((oDoc) => {
            const oDocData = oDoc.data();
            oDocData.createdAt = new Date(oDocData.createdAt.toDate());
            aNewMessages.push(oDocData);
        });
        setFirebaseLastDoc(aDocuments.docs[aDocuments.docs?.length -1]);
        const aPrintableMessages = GiftedChat.append(convMessages, aNewMessages);
        setMessages(aPrintableMessages);
        setShowBusy(false);
        _setReadMessage();
    };

    _setReadMessage = () => {
        firebaseRef.collection("users").doc(uid).update({showIncomingMessages: false});
    };

    _setIsWriting = (oDoc) => {
        const oDocData = oDoc.data();
        if(oDocData && oDocData.isWriting){
            setIsWriting("TEXT");
        }else if(oDocData && oDocData.isSendingPic) {
            setIsWriting("IMAGE");
        }else{
            setIsWriting("");
        }
    };

    _openImageSelection = () => {
        let aPromisesAndroid = [];
        if(Platform.OS === "android"){
            aPromisesAndroid = [_getStoragePermission()];
        }
        Promise.all(aPromisesAndroid)
        .then(() => {
            ImagePicker.openPicker({
                compressImageQuality: 0.8,
                cropping: true
            }).then(oImageInfo => {
                setImageURL(oImageInfo);
            });
        })
        .catch(() => {
            
        })
    };

    _getStoragePermission = () => {
        return new Promise((resolve, reject) => {
            try {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                    title: "TruthOrDare Storage Permission",
                    message: "Ci devi concedere il permesso per vedere le immagini!",
                    buttonNegative: "Cancella",
                    buttonPositive: "Ok"
                    }
                ).then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        resolve();
                    } else {
                        alert("Senza permessi non puoi selezionare immagini! 😟");
                        reject();
                    }
                })
                .catch(() => {
                    alert("Ops! Qualcosa è andato storto 😥! Riprova");
                    reject();
                });
            } catch (err) {
                alert("Ops! Qualcosa è andato storto 😥! Riprova");
                reject();
            }
        });
    };

    _sendMessageImage = () => {
        const oNewMessageImage = [_createMessageImage(imageURL)];
        const aPrintableMessages = GiftedChat.append(convMessages, oNewMessageImage);
        setMessages(aPrintableMessages);
        setImageURL("");
        setNewTextImage("");

        _setUserIsWriting("IMAGE");
        _uploadImageToFirebase(imageURL, oNewMessageImage);
    };

    _uploadImageToFirebase = (oImageInfo, oNewMessage) =>{
        const sChatID = firebase.auth().currentUser._user.uid;
        const oDate = new Date();
        const filename = oImageInfo.filename+oDate.toISOString();
        firebase
        .storage()
        .ref(`chats/${sChatID}/${filename}`)
        .putFile(oImageInfo.path)
        .on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
                let state = {};
                state = {
                ...state,
                progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
                };
                if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                    snapshot.ref.getDownloadURL().then(sImageURL => {
                        oNewMessage[0].image = sImageURL;
                        _onSend(oNewMessage);
                    });
                }
            },
            error => {
                alert("Ops caricament immagine fallito, riprova!");
            }
        );
    };

    _createMessageImage = (oImageInfo) => {
        const oDate = new Date();
        let oMessage = {
            _id: oImageInfo.filename+oDate.toISOString(),
            text: newTextImage,
            createdAt: new Date(),
            user: {
                _id: uid,
            },
            image: oImageInfo.path,
        };
        return oMessage;
    };

    _createMessageText = (refChat) => {
        const oDate = new Date();
        let oMessage = {
            _id: refChat.messageIdGenerator()+oDate.toISOString(),
            text: refChat.text,
            createdAt: new Date(),
            user: {
                _id: uid,
            }
        };

        _onSend([oMessage]);
        setNewTextImage("");
    };

    _unselectImage = () => {
        setImageURL("");
        setNewTextImage("");
    };

    _isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const LOAD_EARLIER_ON_SCROLL_HEGHT_OFFSET = -(screenHeight/2) + 50;
        const contentTopOffset = contentSize.height - layoutMeasurement.height - contentOffset.y;
        // if the screen is not full of messages, offset would be too big
        return contentSize.height < layoutMeasurement.height
            ? contentOffset.y > LOAD_EARLIER_ON_SCROLL_HEGHT_OFFSET // so we only check bottom offset
            : contentTopOffset + LOAD_EARLIER_ON_SCROLL_HEGHT_OFFSET < 0;
    };

    _loadMoreMessage = () => {
        if(firebaseLastDoc && Object.keys(firebaseLastDoc).length > 0 && !loadingEarlier){
            setLoadingEarlier(true);
            firebaseRef.collection("chats").doc(_chatDoc()).collection("messages")
                .orderBy("createdAt", "desc").startAfter(firebaseLastDoc).limit(10).get().then((aDocuments) => {
                    _loadOldMessages(aDocuments);
                })
                .catch(err => {
                    setLoadingEarlier(false);
                    alert("Ops! Caricamento messaggi fallito 😔, riprova!");
                });
        }
    };

    _loadOldMessages = (aDocuments) => {
        let aNewMessages = [];
        aDocuments.forEach((oDoc) => {
            const oDocData = oDoc.data();
            oDocData.createdAt = new Date(oDocData.createdAt.toDate());
            aNewMessages.push(oDocData);
        });
        if(aDocuments.docs.length > 0){
            setFirebaseLastDoc(aDocuments.docs[aDocuments.docs?.length -1]);
            const aPrintableMessages = GiftedChat.append(aNewMessages, convMessages);
            setMessages(aPrintableMessages);
        }else{
            setFirebaseLastDoc({});
        }
        setLoadingEarlier(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{flex: 1}}>
                <View style={styles.viewHeader}>
                    <View style={styles.viewWriting}>
                        {isWriting !== "" ? 
                        <Text style={styles.textWriting}>{isWriting === "TEXT" ? "Sta scrivendo..." : 
                            "Invio immagine..."}</Text> : <></>}
                    </View>
                    <View style={styles.viewAddImage}>
                        <TouchableOpacity onPress={_openImageSelection}>
                            <MaterialIcons name="add-a-photo" size={30}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <GiftedChat
                    placeholder={"Scrivi un messaggio..."}
                    text={newTextImage}
                    textInputProps={{onChangeText:(text) => {
                            setNewTextImage(text);
                            _setUserIsWriting("TEXT");
                        }
                    }}
                    onLoadEarlier={x => {console.log(x)}}
                    listViewProps={{
                        scrollEventThrottle: 400,
                        onScroll: ({ nativeEvent }) => {if (_isCloseToTop(nativeEvent)) _loadMoreMessage()}
                    }}
                    messages={convMessages}
                    user={{
                        _id: uid
                    }}
                    isLoadingEarlier={loadingEarlier}
                    renderSend={(refChat) => {
                        return refChat.text === "" ? <></> :
                            <TouchableOpacity onPress={_createMessageText.bind(this, refChat)}> 
                                <MaterialCommunityIcons style={styles.iconSend} name="send" size={30}/>
                            </TouchableOpacity>;
                    }}
                    onSend={messages => _onSend(messages)}
                />
                {imageURL !== "" ? <ImageMessageGraphic sendMessageImage={_sendMessageImage}
                    newTextImage={newTextImage} setNewTextImage={setNewTextImage} imageURL={imageURL}/> : <></>}
            </View>
            {convMessages.length > 0 ? <></> :
                <View style={styles.viewNoMessages}>
                    <Text style={styles.textNoMessages}>{"Su non essere timido!\nScrivi qualcosa 😉"}</Text>
                </View>}
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
    viewAddImage: {
        marginTop: 5, 
        position: 'absolute', 
        top: 0, 
        right: 10
    },
    viewHeader: {
        flexDirection: 'row',
        position: 'absolute',
        height: 40,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9'
    },
    iconSend: {
        marginLeft: 5, 
        marginRight: 7,
        marginBottom: Platform.OS === "ios" ? 5 : 8,
        color: "#1EA6B6",
    }
});