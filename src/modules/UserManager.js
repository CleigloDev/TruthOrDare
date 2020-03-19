import React from 'react';
import {AsyncStorage} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

export class UserManager {
    
    static getCurrentUID = (navigation) => {
        return new Promise(async(resolve, reject) => {
            try{
                const sUID = await AsyncStorage.getItem("UID");
                if(sUID){
                    resolve(sUID);
                }else{
                    alert("Ops! sembra che tu non sia loggato");
                    navigation ? navigation.navigate("Login") : null;
                    reject("");
                }
            }catch(e){
                alert("Ops! sembra che tu non sia loggato");
                navigation ? navigation.navigate("Login") : null;
                reject("");
            }
        });
    };
}
