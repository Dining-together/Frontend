import React,{useContext, useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import AuthStack from "./AuthStack";
import { Spinner } from '../components';
import { ProgressContext, LoginConsumer, LoginContext, LoginProvider, UrlContext } from '../contexts';
import MainStack from "./MainStack";
import MainTab from './MainTab';
import {SafeAreaView} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navigation = () => {
    const {inProgress, spinner} = useContext(ProgressContext);
    const {success, autoLogin, setSuccess, setToken, setMode, setId, setAllow, setDoc, setAutoLogin} = useContext(LoginContext);
    const {url} = useContext(UrlContext);
    const [isReady, setIsReady] = useState(false);

    const getTokenData = async () => {
        try{
            spinner.start()
            AsyncStorage.getItem("UserToken", (err, result) => {
                console.log(result);
                if(result!==null){
                    setSuccess(true);
                    setAutoLogin(true);
                    setToken(result);
                    AsyncStorage.getItem("UserId", (err, res) => {
                        console.log(res);
                        if(JSON.parse(res)==null) setId(JSON.parse(res).id);
                    });
        
                    AsyncStorage.getItem("UserMode", (err, res) => {
                        console.log(res);
                        if(res!==null) {
                            if(res==="STORE"){
                                console.log("its Store");
                                setMode("Store");
                            }else if (res === "CUSTOMER"){
                                console.log("its Customer");
                                setMode("Customer");
                            }
                        if(res==="STORE"){
                            AsyncStorage.getItem("UserDoc", (e, r) => {
                                console.log(JSON.parse(r));
                                if(JSON.parse(r)!==null) {setDoc(JSON.parse(r).doc)};
                            });
                        }}
                    });
                    AsyncStorage.getItem("UserAllow", (err, res) => {
                        console.log(JSON.parse(res));
                        if(JSON.parse(res)!==null) {setAllow(JSON.parse(res).allow)};
                    });
                        return true;
                }else{
                    console.log("no");
                    setIsReady(false);
                    return false;
                }
            });
        }catch(e){
            console.error(e);
        }finally{
            spinner.stop();
        }
    };

    useEffect(()=>{
       var res = getTokenData();
       if(res===true){
        setIsReady(true);
       }
    },[]);

    useEffect(()=>{
        if(success){
            setIsReady(true);
        }else{
            setIsReady(false);
        }
    },[success]);

    return (
        <>
        <SafeAreaView />
        <NavigationContainer>
            {/* <MainTab /> */}
            {isReady? <MainTab />: <AuthStack />}
            {inProgress&&<Spinner />}
        </NavigationContainer>
        </>
    );
};

export default Navigation;