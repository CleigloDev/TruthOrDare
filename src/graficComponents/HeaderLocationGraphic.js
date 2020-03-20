import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function HeaderLocation(props) {

    return (
        <>  
            <View style={styles.viewWrapper}>
                <Text>Location: </Text>
                <TouchableOpacity>
                    <Text style={{fontWeight: 'bold'}}>Roma</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    viewWrapper: {
        flex: 0.2, 
        backgroundColor: 'white', 
        borderBottomLeftRadius: 5, 
        borderBottomRightRadius: 5,
        borderColor: 'gray', 
        borderBottomWidth: 1.5,
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});
