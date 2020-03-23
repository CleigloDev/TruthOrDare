import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import fontSize from '../modules/fontSize';

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
        fontSize: fontSize(20),
        paddingBottom: 10
    },
    viewContent:{
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: "#d1d1d1",
        margin: 5,
        padding: 10
    },
    flexRow: {
        flexDirection: "row"
    },
    textLocation: {
        fontSize: fontSize(13), 
        paddingBottom: 10
    }
});