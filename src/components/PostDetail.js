import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, FlatList, View} from 'react-native';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import fontSize from '../modules/fontSize';
import BusyIndicator from '../graficComponents/BusyIndicatorGraphic';
import ToolTipPost from '../graficComponents/ToolTipPostGraphic';
import NewMessageGraphic from '../graficComponents/NewMessageGraphic';
import PostGraphic from '../graficComponents/PostGraphic';
import CommentGraph from '../graficComponents/CommentGraphic';
import { UserManager } from '../modules/UserManager.js';

firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    persistence: true
});

export default function Post({ route, navigation }) {
    const [uid, setUID] = useState("");
    const [showBusy, setShowBusy] = useState(true);
    const [post, setPost] = useState("");
    const [IDPost, setPostID] = useState("");
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [IDcommentEdit, setIDCommentEdit] = useState("");
    const firebaseRef = firebase.firestore();

    useEffect(() => {
        var snapshotComments;
        setShowBusy(true);
        UserManager.getCurrentUID(navigation).then(sUID => {
            setUID(sUID);
            const { postKey } = route.params;
            _loadPosts(postKey);
            snapshotComments = _snapshotComments(postKey);
        }).catch(() => {
            setShowBusy(false);
        });

        return () => {
            snapshotComments();
        };
    }, []);

    _loadPosts = (postKey) => {
        firebaseRef.collection("posts").doc(postKey).get()
        .then((oPost) => {
            const postData = oPost.data();
            postData.id = oPost.id;
            oPost.data && setPost(postData);
            setPostID(postKey);
            setShowBusy(false);
        }).catch((oErr) => {
            alert("Impossibile caricare i post! Riprovare");
        });
    };

    _snapshotComments = (postKey) => {
        return firebaseRef.collection("posts").doc(postKey).collection("comments")
            .where("deleted", "==", false).orderBy("date", "desc")
            .onSnapshot(_loadComments);
    };

    _loadComments = (aComments) => {
        var aCommentsData = [];
        if(aComments && aComments.docs.length > 0){
            aComments.forEach((oComment) => {
                aCommentsData.push(Object.assign({}, {
                    id: oComment.id, data: oComment.data()
                    }
                ));
            });
        }
        setComments(aCommentsData);
    };

    _deleteComment = (commentID) => {
        firebaseRef.collection("posts").doc(IDPost).collection("comments")
        .doc(commentID).update({deleted: true})
        .then(() => {
            _updatePost("DELETE");
        }).catch(() => {
            alert("Ops! Sembra che questo commento non si voglia cancellare 😂");
        });
    };

    _editComment = (commentID, sText) => {
        setNewComment(sText);
        setIDCommentEdit(commentID);
    };

    _updateComment = () => {
        firebaseRef.collection("posts").doc(IDPost).collection("comments")
        .doc(IDcommentEdit).update({text: newComment})
        .then(() => {
            _resetPage();
        }).catch(() => {
            alert("Ops! Sembra che questo commento non si voglia modificare 😂");
        });
    };

    _renderItemComments = ({item, index}) => {
        return (
            <CommentGraph location={"Roma"} text={item.data.text}>
                <ToolTipPost uidCreator={item.data.uid} uidCurrent={uid}
                    modify={_editComment.bind(this, item.id, item.data.text)}
                    delete={_deleteComment.bind(this, item.id)} flag={() => {}} />
            </CommentGraph>
        );
    };

    _createComment = () => {
        firebaseRef.collection("posts").doc(IDPost).collection("comments").add({
            date: new Date(),
            text: newComment,
            uid: uid,
            deleted: false
        }).then(() => {
            _updatePost("ADD");
            _resetPage();
        })
        .catch(() => {
            _resetPage();
            alert("Creazione commento fallito!!");
        });
    };

    _updatePost = (sAction) => {
        firebaseRef.collection("posts").doc(IDPost).get()
        .then((oDoc) => {
            let {comments} = oDoc.data();
            if(sAction === "ADD"){
                comments.push(uid);
            }else if(sAction === "DELETE"){
                comments.splice(0,1);
            }
            firebaseRef.collection("posts").doc(IDPost).update({comments})
        })
        .catch(() => {
            alert("Ops! Qualcosa sembra essere andato storto!");
        });
    };

    _resetPage = () => {
        setNewComment("");
        setIDCommentEdit("");
    };

    _deletePost = (sPostKey) => {
        setShowBusy(true);
        firebaseRef.collection("posts").doc(sPostKey).update({deleted: 1})
        .then(() => {
            navigation.goBack();
        });
    };

    _savePost = (postInfo) => {
        firebaseRef.collection("users").doc(uid).collection("savedPosts").add(postInfo);
    };

    _navigateChat = (sUIDCreator) => {
        navigation.navigate("Chat", {
            uidCreator: sUIDCreator
        });
    };

    _onSend = () => {
        if(IDcommentEdit !== ""){
            _updateComment();
        }else{
            _createComment();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {IDcommentEdit === "" ?
                <View style={{flex: 1}}>
                    <PostGraphic location={"Roma"} text={post.text} navigate={() =>{}}
                        chat={_navigateChat.bind(this, post.uid)}
                        uidCreator={post.uid} uidCurrent={uid}>
                        <ToolTipPost uidCreator={post.uid} uidCurrent={uid}
                            delete={_deletePost.bind(this, post.id)} 
                            save={_savePost.bind(this, post)} flag={() => {}} />
                    </PostGraphic>
                    <Text style={{paddingLeft: 10}}>Commenti</Text>
                    <FlatList
                        keyExtractor={(item, index) => 'key'+index}
                        data={comments}
                        extraData={comments}
                        renderItem={_renderItemComments}
                    />
                </View> : 
                <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'transparent'}}>
                    <CommentGraph text={newComment}/>
                </View>}
            
            <NewMessageGraphic text={newComment} setText={setNewComment} send={_onSend}/>
            {showBusy && <BusyIndicator text={"Caricamento commenti..."} showBusy={showBusy}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    }
});