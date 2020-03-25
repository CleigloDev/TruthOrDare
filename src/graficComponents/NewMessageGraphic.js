import React from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity, Dimensions, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import fontSize from '../modules/fontSize';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function NewMessageFooter(props) {

    return (
        <View style={styles.mainView}>
            <View style={styles.viewNewComment}>
                <TextInput style={{...styles.inputNewComment, ...(props.styles ? props.styles : {})}}
                    placeholder={"Inserisci un commento"}
                    value={props.text}
                    onChangeText={props.setText}
                    multiline={true}
                />
            </View>
            {props.text && props.text.length > 0 ?
            <View style={styles.viewIconSend}>
                <TouchableOpacity onPress={props.send}>
                    <MaterialCommunityIcons style={styles.iconSend} name="send" size={30}/>
                </TouchableOpacity>
            </View> : null}
        </View>   
    );
}


const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginBottom: 10, 
        marginLeft: 5, 
        marginRight: 5,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "gray"
    },
    iconSend: {
        marginTop: 5,
        marginBottom: Platform.OS === "ios" ? 0 : 8,
        color: "#1EA6B6",
    },
    inputNewComment: {
        maxHeight: (screenHeight/6),
        height: "auto",
        textAlignVertical: 'center',
        marginTop: Platform.OS === "ios" ? 7 : 0,
        marginBottom: Platform.OS === "ios" ? 5 : 0,
        marginLeft: 5,
        fontSize: fontSize(18),
    },
    viewNewComment: {
        flex: 2,
        justifyContent: 'flex-end',
    },
    viewIconSend: {
        flex: 0.23, 
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
});