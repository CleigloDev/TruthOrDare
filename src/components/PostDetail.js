import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, FlatList} from 'react-native';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import ToolTipPost from '../graficComponents/ToolTipPostGraphic';
import NewMessageGraphic from '../graficComponents/NewMessageGraphic';
import PostGraphic from '../graficComponents/PostGraphic';
import CommentGraph from '../graficComponents/CommentGraphic';

export default function Post({ route, navigation }) {
    const [postText, setPostText] = useState("");
    const [IDPost, setPostID] = useState("");
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        const { postKey } = route.params;
        _loadPosts(postKey);
        const snapshotComments = _snapshotComments(postKey);

        return () => {
            snapshotComments();
        };
    }, []);

    _loadPosts = (postKey) => {
        firebaseRef.collection("posts").doc(postKey).get()
        .then((oPost) => {
            const sPostText = oPost.data && oPost.data().text;
            setPostText(sPostText);
            setPostID(postKey);
        }).catch((oErr) => {
            alert("Impossibile caricare i post! Riprovare");
        });
    };

    _snapshotComments = (postKey) => {
        return firebaseRef.collection("posts").doc(postKey).collection("comments").orderBy("date", "desc")
        .onSnapshot(_loadComments);
    };

    _loadComments = (aComments) => {
        var aCommentsData = [];
        aComments.forEach((oComment) => {
            aCommentsData.push(Object.assign({}, {
                id: oComment.id, data: oComment.data()
                }
            ));
        });
        setComments(aCommentsData);
    };

    _renderItemComments = ({item, index}) => {
        return (
            <CommentGraph location={"Roma"} text={item.data.text}/>
        );
    };

    _createComment = () => {
        firebaseRef.collection("posts").doc(IDPost).collection("comments").add({
            date: new Date(),
            text: newComment
        }).then(() => {
            _resetPage();
        })
        .catch(() => {
            _resetPage();
            alert("Creazione commento fallito!!");
        });
    };

    _resetPage = () => {
        setNewComment("");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <PostGraphic location={"Roma"} text={postText} navigate={() =>{}}>
                    <ToolTipPost delete={() => {}} save={() => {}} flag={() => {}} />
                </PostGraphic>
            <Text style={{paddingLeft: 10}}>Commenti</Text>
            <FlatList
                keyExtractor={(item, index) => 'key'+index}
                data={comments}
                extraData={comments}
                renderItem={_renderItemComments}
            />
            <NewMessageGraphic text={newComment} setText={setNewComment} send={_createComment}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    }
});