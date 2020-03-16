import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, FlatList, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import PostGraphic from '../graficComponents/PostGraphic';

export default function Post({ navigation }) {
    const [posts , setPosts] = useState([]);
    const firebaseRef = firebase.firestore();

    useEffect(() => { 
        const snapShotPost = _snapshotPosts();

        return () => {
            snapShotPost();
        };
    }, []);

    _deletePost = () => {

    };

    _snapshotPosts = () => {
        return firebaseRef.collection("posts").orderBy("date", "desc").onSnapshot(_loadPosts);
    };

    _loadPosts = (aDocuments) => {
        let aDocData = [];
        aDocuments.forEach((oDoc) => {
            aDocData.push(Object.assign({}, { 
                    id: oDoc.id, 
                    data: oDoc.data()
                }
            ));
        });
        setPosts(aDocData);
    };

    _navigateDetail = (item) => {
        navigation.navigate("PostDetail", {
            "postKey": item.id
        });
    };

    _renderItemPost = ({item, index}) => {
        return (
            <PostGraphic text={item.data.text} location={"Roma"} 
                delete={_deletePost} navigate={_navigateDetail.bind(this, item)}/>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                keyExtractor={(item, index) => 'key'+index}
                data={posts}
                extraData={posts}
                renderItem={_renderItemPost}
            />
            <TouchableOpacity style={styles.centerItem} onPress={() => navigation.navigate('NewPost')}>
                <MaterialIcons style={styles.iconAdd} name="add-circle-outline" size={70}/>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white"
    },
    centerItem: {
        alignItems: "center"
    },
    iconAdd: {
        color: "#d1d1d1"
    }
});