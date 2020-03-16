import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ToolTipPost(props) {

    return (
        <>
            <TouchableOpacity style={styles.buttonTool} onPress={props.delete}>
                <MaterialCommunityIcons name="delete-outline" size={18} />
                <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonTool} onPress={props.flag}>
                <MaterialCommunityIcons name="flag-remove" size={18} />
                <Text>Segnala</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonTool} onPress={props.save}>
                <MaterialIcons name="favorite" size={18} />
                <Text>Salva</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    buttonTool: {
        flexDirection: "row", 
        alignItems: "center", 
        padding: 10,
        paddingBottom: 20,
        paddingTop: 20
    }
});