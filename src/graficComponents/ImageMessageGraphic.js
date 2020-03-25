import React from 'react';
import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import NewMessageGraphic from '../graficComponents/NewMessageGraphic';

export default function ImageMessage(props) {
    return (
        <>
            <View style={styles.mainView}>
                <TouchableOpacity onPress={_unselectImage} style={styles.buttonDelete}>
                    <Entypo name="circle-with-cross" size={30} color="white"/>
                </TouchableOpacity>
                <Image source={{uri: props.imageURL.path}} resizeMode='contain' style={styles.image}/>
                <View style={styles.viewNewMessage}>
                    <NewMessageGraphic text={props.newTextImage} setText={props.setNewTextImage} 
                        styles={styles.newMessageText}
                        showButton={true}
                        send={() => {props.sendMessageImage()}}/>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    mainView: {
        height: '100%',
        justifyContent: 'center', 
        alignItems: 'center',
        zIndex: 2,
        position: 'absolute', 
        right: 0, 
        top: 0, 
        bottom: 0, 
        left: 0
    },
    buttonDelete: {
        position: 'absolute', 
        zIndex: 3, 
        top: 5, 
        right: 10
    },
    image: {
        height: '95%', 
        width: '100%', 
        opacity: 0.95,
        zIndex: 2, 
        backgroundColor: 'black'
    },
    viewNewMessage: {
        paddingTop: 10, 
        alignItems: 'center', 
        opacity: 0.95,
        zIndex: 2, 
        backgroundColor: 'black'
    },
    newMessageText: {
        color: 'white'
    }
});