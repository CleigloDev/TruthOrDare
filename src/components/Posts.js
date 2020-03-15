import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text, StatusBar, FlatList, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

export default function Post({ navigation }) {
    const [posts , setPosts] = useState([]);
    const firebaseRef = firebase.firestore();

    useEffect(() => { 
        firebaseRef.collection("posts").get().then((aDocuments) => {
            let aDocData = [];
            aDocuments.forEach((oDoc) => {
                aDocData.push(Object.assign({}, { 
                        id: oDoc.id, 
                        data: oDoc.data()
                    }
                ));
            });
            setPosts(aDocData);
        }).catch((oErr) => {
            alert("Impossibile caricare i post! Riprovare");
        });
    });

    _renderItemPost = ({item, index}) => {
        return (
            <View style={styles.viewContent}>
                <View style={styles.flexRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={15} />
                    <Text style={styles.textLocation}>Roma</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("PostDetail", {
                    "postKey": item.id
                })}>
                    <Text style={styles.textContent}>{item.data.text}</Text>
                </TouchableOpacity>
            </View>
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
    }
});