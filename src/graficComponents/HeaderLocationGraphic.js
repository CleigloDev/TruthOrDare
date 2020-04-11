import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AsyncText from '../AsyncComponents/AsyncText';

export default function HeaderLocation(props) {

    _getUserCity = () => {
        return fetch("https://geocode.xyz/"+props.userCoords.lat+","+props.userCoords.long+"?geoit=json"
        /*&auth=218202394355746891371x5162"*/)
        .then(res => res.json());
    };

    _setCity = (oResult) => {
        return oResult.city;
    }

    return (
        <>  
            <View style={styles.viewWrapper}>
                <Text style={{color: "white"}}>Location: </Text>
                <TouchableOpacity>
                    {props.userCoords === "" ? 
                        <Text style={{fontWeight: 'bold', color: "white"}}>Sconosciuta!</Text> :
                        <AsyncText textPromise={_getUserCity()} fnProcessText={_setCity}/>}
                </TouchableOpacity>
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
        borderColor: 'white', 
        borderBottomWidth: 1.5,
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});
