import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ToolTipPost(props) {

    return (
        <>  
            {props.uidCreator === props.uidCurrent ?
                <TouchableOpacity style={styles.buttonTool} 
                    onPress={() => {props.delete(), props.refTool.current.toggleTooltip()}}>
                    <MaterialCommunityIcons name="delete-outline" size={18} color="#d1d1d1"/>
                    <Text style={styles.text}>Delete</Text>
                </TouchableOpacity> : null}
            {props.uidCreator !== props.uidCurrent ?    
                <TouchableOpacity style={styles.buttonTool} 
                    onPress={() => {props.flag(), props.refTool.current.toggleTooltip()}}>
                    <MaterialCommunityIcons name="flag-remove" size={18} color="#d1d1d1"/>
                    <Text style={styles.text}>Segnala</Text>
                </TouchableOpacity> : null}
            {props.save && typeof props.save === "function" ?
                <TouchableOpacity style={styles.buttonTool} 
                    onPress={() => {props.save(), props.refTool.current.toggleTooltip()}}>
                    <MaterialIcons name="favorite" size={18} color="#d1d1d1"/>
                    <Text style={styles.text}>Salva</Text>
                </TouchableOpacity> : null}
            {props.modify && typeof props.modify === "function" && props.uidCreator === props.uidCurrent ?
                <TouchableOpacity style={styles.buttonTool} 
                    onPress={() => {props.modify(), props.refTool.current.toggleTooltip()}}>
                    <MaterialIcons name="mode-edit" size={18} color="#d1d1d1"/>
                    <Text style={styles.text}>Edita</Text>
                </TouchableOpacity> : null}
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
    },
    text: {
        color: "#d1d1d1"
    }
});