import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
                    {props.location ? 
                        <View style={{flexDirection: 'row'}}>
                            <MaterialCommunityIcons name="map-marker-outline" size={15} />
                            <Text style={styles.textLocation}>{props.location}</Text>
                        </View>
                    : <></>}
                </View>
                <View>
                    <Tooltip ref={refTooltipComment}
                        containerStyle={styles.tooltip} popover={props.children ? 
                        React.cloneElement(props.children, {refTool: refTooltipComment}) : <></>}>
                        {!props.children ? <></> :
                            <TouchableOpacity onPress={refTooltipComment && refTooltipComment.current ? 
                                refTooltipComment.current.toggleTooltip : null}
                                style={{padding: 10}}>
                                <SimpleLineIcons name="options-vertical" size={15}/>
                            </TouchableOpacity>}
                    </Tooltip>
                </View>
            </View>
            <Text style={styles.textContent}>{props.text}</Text>
            <View>
            {props.uidCreator === props.uidCurrent ? <></> :
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={props.chat}>
                            <MaterialCommunityIcons name="wechat" size={30}/>
                        </TouchableOpacity>
                    </View>}
            </View>
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