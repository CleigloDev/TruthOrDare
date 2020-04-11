import React, {useEffect, useState} from 'react';
import {Text, StyleSheet} from 'react-native';

import fontSize from '../modules/fontSize';

export default function AsyncText(props) {
    const [text, setText] = useState("");

    useEffect(() => {
        props.textPromise
        .then((oResult) => {
            const text = props.fnProcessText(oResult);
            setText(text);
        })
        .catch(() => {
            setText("Caricamento fallito! 😥");
        });
    }, []);

    return (
        <>  
            <Text style={props.style ? props.style : styles.textStyle}>{text && props.maxLength && props.maxLength < text.length 
                ? text.substr(0,props.maxLength)+"..." : text}</Text>
        </>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        color: "white"
    }
});