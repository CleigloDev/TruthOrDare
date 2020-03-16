import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default function PostGraphic(props) {

    return (
        <View style={styles.viewContent}>
            <View style={styles.flexRow}>
                <View style={{flex: 7}}>
                    <MaterialCommunityIcons name="map-marker-outline" size={15} />
                    <Text style={styles.textLocation}>{props.location}</Text>
                </View>
                <TouchableOpacity onPress={props.delete}>
                    <SimpleLineIcons name="options-vertical" size={15}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={props.navigate}>
                <Text style={styles.textContent}>{props.text}</Text>
            </TouchableOpacity>
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