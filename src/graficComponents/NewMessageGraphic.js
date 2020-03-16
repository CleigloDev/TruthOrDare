import React from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function NewMessageFooter(props) {

    return (
        <View style={styles.viewNewComment}>
            <TextInput style={styles.inputNewComment}
                value={props.text}
                onChangeText={props.setText}
                multiline={true}
            />
            <TouchableOpacity onPress={props.send}>
                <MaterialCommunityIcons style={styles.iconSend} name="send" size={30}/>
            </TouchableOpacity>
        </View>    
    );
}


const styles = StyleSheet.create({
    iconSend: {
        paddingLeft: 5,
        color: "gray",
        paddingTop: 16
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
    viewNewComment: {
        flexDirection: "row", 
        paddingLeft: 10
    }
});