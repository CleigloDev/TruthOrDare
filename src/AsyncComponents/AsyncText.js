import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

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
            <Text style={props.style}>{text && props.maxLength && props.maxLength < text.length 
                ? text.substr(0,props.maxLength)+"..." : text}</Text>
        </>
    );
}