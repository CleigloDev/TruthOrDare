import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Tooltip } from 'react-native-elements';

import fontSize from '../modules/fontSize';

export default function PostGraphic(props) {
    const refTooltip = useRef(null);

    return (
        <View style={styles.viewContent}>
            <View style={styles.flexRow}>
                <View style={styles.viewLocation}>
                    <MaterialCommunityIcons name="map-marker-outline" size={15} />
                    <Text style={styles.textLocation}>{props.location}</Text>
                </View>
                <Tooltip ref={refTooltip} 
                    containerStyle={styles.tooltip} popover={props.children ? 
                    React.cloneElement(props.children, {refTool: refTooltip}) : <></>}>
                    <SimpleLineIcons name="options-vertical" size={15}/>
                </Tooltip>
            </View>
            <TouchableOpacity onPress={props.navigate}>
                <Text style={styles.textContent}>{props.text}</Text>
            </TouchableOpacity>
            <View style={styles.flexRow}>
                {props.comments === undefined ? <></> :
                    <View style={{flex: 2}}>
                        <TouchableOpacity style={styles.flexRow} onPress={props.navigate}>
                            <MaterialCommunityIcons name="comment-processing" size={22}/>
                        <Text style={{paddingLeft: 10}}>{props.comments+" Commenti"}</Text>
                        </TouchableOpacity>
                    </View>}
                {props.uidCreator === props.uidCurrent ? <></> :
                    <View>
                        <TouchableOpacity onPress={props.chat}>
                            <MaterialCommunityIcons name="wechat" size={30}/>
                        </TouchableOpacity>
                    </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewLocation: {
        flex: 1, 
        flexDirection: 'row'
    },
    textContent: {
        flexShrink: 1, 
        fontSize: fontSize(20),
        paddingBottom: 30
    },
    viewContent:{
        height: "auto", 
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#d1d1d1",
        padding: 10,
        margin: 5
    },
    flexRow: {
        flexDirection: "row"
    },
    textLocation: {
        fontSize: fontSize(13), 
        paddingBottom: 10
    },
    tooltip: {
        height: "auto", 
        backgroundColor: "white", 
        borderColor: "black", 
        borderWidth: 1
    }
});