import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Tooltip } from 'react-native-elements';

import fontSize from '../modules/fontSize';

export default function CommentGraphic(props) {
    const refTooltipComment = useRef(null);

    return (
        <View style={styles.viewContent}>
            <View style={styles.flexRow}>
                <View style={{flex: 2}}>
                    <MaterialCommunityIcons name="map-marker-outline" size={15} />
                    <Text style={styles.textLocation}>{props.location}</Text>
                </View>
                <View>
                    <Tooltip ref={refTooltipComment} 
                        containerStyle={styles.tooltip} popover={props.children ? 
                        React.cloneElement(props.children, {refTool: refTooltipComment}) : <></>}>
                        <SimpleLineIcons name="options-vertical" size={15}/>
                    </Tooltip>
                </View>
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
    },
    tooltip: {
        height: "auto", 
        backgroundColor: "white", 
        borderColor: "black", 
        borderWidth: 1
    }
});