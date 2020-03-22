import React from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity, Dimensions, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import fontSize from '../modules/fontSize';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function NewMessageFooter(props) {

    return (
        <View style={styles.mainView}>
            <View style={styles.viewNewComment}>
                <TextInput style={styles.inputNewComment}
                    placeholder={"Inserisci un commento"}
                    value={props.text}
                    onChangeText={props.setText}
                    multiline={true}
                />
            </View>
            {props.text && props.text.length > 0 ?
            <View style={styles.viewIconSend}>
                <TouchableOpacity onPress={props.send}>
                    <MaterialCommunityIcons style={styles.iconSend} name="send" size={33}/>
                </TouchableOpacity>
            </View> : null}
        </View>   
    );
}


const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        paddingBottom: 3, 
        paddingLeft: 5, 
        paddingRight: 5
    },
    iconSend: {
        paddingLeft: 5,
        color: "gray",
        paddingBottom: 5,
        paddingTop: 16
    },
    inputNewComment: {
        maxHeight: (screenHeight/6),
        height: "auto",
        textAlignVertical: 'center',
        fontSize: fontSize(18),
        paddingLeft: 15,
        paddingBottom: 7,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "gray"
    },
    viewNewComment: {
        flex: 2,
        justifyContent: 'flex-end',
        paddingBottom: 5
    },
    viewIconSend: {
        flex: 0.23, 
        justifyContent: 'flex-end',
        paddingBottom: Platform.OS === 'ios' ? 0 : 5,
    }
});