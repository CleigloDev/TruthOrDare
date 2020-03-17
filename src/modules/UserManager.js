import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

export class UserManager {
    
    static getCurrentUID = (navigation) => {
        return this.getCurrentUser(navigation).uid;
    };

    static getCurrentUser = (navigation) => {
        try{
            const oUser = firebase.auth().currentUsers;
            return oUser;
        }catch(error){
            alert("Ops! sembra che tu non sia loggato");
            navigation.navigate("Login");
        }
    }
    
    static isUserOnline = (navigation) => {
        try{
            var bLoggedIn = !!firebase.auth().currentUsers;
            return bLoggedIn;
        }catch(error){
            alert("Ops! sembra che tu non sia loggato");
            navigation.navigate("Login");
        }
    }
}
