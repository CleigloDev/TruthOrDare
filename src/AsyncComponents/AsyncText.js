import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

export default function AsyncText(props) {
    const [text, setText] = useState("");

    useEffect(() => {
        props.textPromise
        .then((oDoc) => {
            const textMessage = oDoc.docs[0]?.data()?.text
            setText(textMessage);
        })
        .catch(() => {
            setText("Caricamento testo fallito!");
        });
    }, []);

    return (
        <>  
            <Text style={props.style}>{text && props.maxLength && props.maxLength < text.length 
                ? text.substr(0,props.maxLength)+"..." : text}</Text>
        </>
    );
}