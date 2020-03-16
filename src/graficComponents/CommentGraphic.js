import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CommentGraphic(props) {

    return (
        <View style={styles.viewContent}>
            <View style={styles.flexRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={15} />
                <Text style={styles.textLocation}>{props.location}</Text>
            </View>
            <Text style={styles.textContent}>{props.text}</Text>
        </View>        
    );
}

const styles = StyleSheet.create({
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