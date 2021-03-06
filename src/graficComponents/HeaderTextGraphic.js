import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function HeaderText(props) {

    return (
        <>  
            <View style={styles.viewWrapper}>
                <Text style={{color: "white"}}>{props.text}</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    viewWrapper: {
        flex: 0.2, 
        backgroundColor: '#252c38', 
        borderBottomLeftRadius: 5, 
        borderBottomRightRadius: 5,
        borderColor: 'gray', 
        borderBottomWidth: 1.5,
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});
