import React, {useEffect, useContext, useState} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';


import Post from './src/components/Posts';
import NewPost from './src/components/NewPost';
import PostDetail from './src/components/PostDetail';
import SavedPosts from './src/components/SavedPosts';
import Login from './src/components/Login';
import Messaging from './src/components/Messaging';
import MessageList from './src/components/MessageList';
import BusyIndicator from './src/graficComponents/BusyIndicatorGraphic';

import { UserManager } from './src/modules/UserManager.js';

const Stack = createStackNavigator();

function App() {
  const [uid, setUID] = useState("");
  const [showBusy, setShowBusy] = useState(true);
  const [appLoading, setAppLoading] = useState(true);
  const [uidSenderNotification, setUIDSenderNotification] = useState(null);

  useEffect(() => {
    //messaging().onNotificationOpenedApp(remoteMessage => {
    //  _openChatOrLogin(remoteMessage);
    //});
    messaging().getInitialNotification()
    .then(remoteMessage => {
        _openChatOrLogin(remoteMessage);
    });
  }, []);

  _openChatOrLogin = (remoteMessage) => {
    if (remoteMessage) {
        const { data } = remoteMessage;
        const { uidSender } = data;
        const { uidOther: myUID } = data;
        _openChatFromNotification(uidSender, myUID);
    }else{
        _getUIDOrShowLogin();
    }
  };

  _openChatFromNotification = (sSenderUID, sMyUID) => {
    setUIDSenderNotification(sSenderUID);
    setUID(sMyUID);
    setAppLoading(false);
  };

  _getUIDOrShowLogin = () => {
    UserManager.getCurrentUID()
    .then(sUID => {
      setUID(sUID);
      setAppLoading(false);
    })
    .catch(() => {
      setShowBusy(false);
      setUID("");
      setAppLoading(false);
    });
  };

  if(appLoading){
    return null;
  }

  if(uid === ""){
    return (
      <>
        <Login setShowBusy={setShowBusy} showBusy={showBusy} setUID={setUID}/>
        {showBusy && <BusyIndicator text={"Avvio l'app.."} showBusy={showBusy}/>}
      </>
    );
  }else{
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" headerMode="none">
          <Stack.Screen name="Home" component={Post} initialParams={{uidSender: uidSenderNotification}}/>
          <Stack.Screen name="NewPost" component={NewPost}/>
          <Stack.Screen name="PostDetail" component={PostDetail}/>
          <Stack.Screen name="SavedPosts" component={SavedPosts}/>
          <Stack.Screen name="Chat" component={Messaging}/>
          <Stack.Screen name="MessageList" component={MessageList}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

