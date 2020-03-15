import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, FlatList, StatusBar, ActivityIndicator} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';

export default function Post({ route, navigation }) {
    const [postText, setPostText] = useState("");
    const [IDPost, setPostID] = useState("");
    const [newComment, setNewComment] = useState("");
    const [showBusy, setShowBusy] = useState(false);
    const [comments, setComments] = useState([]);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        const { postKey } = route.params;
        setPostID(postKey);
        let aPromises = [
            firebaseRef.collection("posts").doc(postKey).get(),
            firebaseRef.collection("posts").doc(postKey).collection("comments").get(),
        ];
        Promise.all(aPromises)
        .then((aResults) => {
            const oPost = aResults[0];
            const sPostText = oPost.data && oPost.data().text;
            const aComments = aResults[1];
            let aCommentsData = [];
            aComments.forEach(doc => {
                aCommentsData.push(Object.assign({}, {
                        id: doc.id,
                        data: doc.data()
                    }
                ));
            });
            setPostText(sPostText);
            setComments(aCommentsData);
        }).catch((oErr) => {
            alert("Impossibile caricare i post! Riprovare");
        });
    });

    _renderItemComments = ({item, index}) => {
        return (
            <View style={styles.viewContent}>
                <View style={styles.flexRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={15} />
                    <Text style={styles.textLocation}>Roma</Text>
                </View>
                <Text style={styles.textContent}>{item.data.text}</Text>
            </View>
        );
    };

    _createComment = () => {
        setShowBusy(true);
        firebaseRef.collection("posts").doc(IDPost).collection("comments").add({
            id: 2,
            text: newComment
        }).then(() => {
            setShowBusy(false);
            setNewComment("");
        })
        .catch(() => {
            setShowBusy(false);
            setNewComment("");
            alert("Creazione commento fallito!!");
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.viewContent}>
                <View style={styles.flexRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={15} />
                    <Text style={styles.textLocation}>Roma</Text>
                </View>
                <Text style={styles.textContent}>{postText}</Text>
            </View>
            <Text style={{paddingLeft: 10}}>Commenti</Text>
            <FlatList
                keyExtractor={(item, index) => 'key'+index}
                data={comments}
                extraData={comments}
                renderItem={_renderItemComments}
            />
            <View style={{flexDirection: "row", paddingLeft: 10}}>
                <TextInput style={styles.inputNewComment}
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline={true}
                />
                <TouchableOpacity onPress={_createComment}>
                    <MaterialCommunityIcons style={styles.iconSend} name="send" size={30}/>
                </TouchableOpacity>
            </View>
            {showBusy &&
                <View style={styles.busyIndicator}>
                    <ActivityIndicator animating={showBusy} size="large"/>
                    <Text>Commento...</Text>
                </View>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    iconSend: {
        paddingLeft: 5,
        color: "gray",
        paddingTop: 16
    },
    textContent: {
        flexShrink: 1, 
        fontSize: 20,
        paddingBottom: 30
    },
    viewContent:{
        height: "auto", 
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#d1d1d1",
        padding: 10,
        marginBottom: 10
    },
    flexRow: {
        flexDirection: "row"
    },
    textLocation: {
        fontSize: 13, 
        paddingBottom: 10
    },
    inputNewComment: {
        height: "auto", 
        width: "90%", 
        fontSize: 25, 
        padding: 20,
        marginTop: 5, 
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "gray"
    },
    busyIndicator:{
        flex: 1,
        backgroundColor: "white",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});