import React, {useContext, useEffect, useState} from 'react';
import { View } from "react-native";
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UrlContext, ProgressContext, LoginConsumer, LoginContext} from "../../contexts";
import * as Location from "expo-location";


const NaverLogin = () => {


    const {spinner} = useContext(ProgressContext);
    const {url} = useContext(UrlContext);
    const {token, mode, doc, allow, setSuccess, setAllow, setAutoLogin, setToken, setMode, setId, setLatitude, setLongitude} = useContext(LoginContext);

    const CLIENT_ID = "9MUAPcyGVhbTteFu3l97";
    let REDIRECT_URI = url+"/member/social/login/naver";
    const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

    let tokenData = "";
    const random_state = "dining";

    // code 분리
    const LogInProgress = (data) => {
        // access code는 url에 붙어 장황하게 날아온다.
        // substringd으로 url에서 code=뒤를 substring하면 된다.
        if(data != null){
            const exp = "code=";
            const exp2 = "&state=";
            let condition = data.indexOf(exp);
            let condition2 = data.indexOf(exp2);

            if (condition != -1 && condition2 != -1) {
                let request_code = data.substring(condition + exp.length, condition2);
                let request_state = data.substring(condition2 + exp2.length);

                // 인가코드 전달 -> 토큰 발급
                _handleLoginPress(request_code);

            }
        }
    };


    // Back으로 token 전달 
    const requestToken = async (code) => {

        const token_url = url+`/member/auth/signin/naver?code=${code}`;

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        };

        try{
            let response = await fetch(token_url, options);
            let res = await response.json();

            console.log(res);

            if(res.success){
                setToken(res["data"]);
                tokenData = res["data"];
                AsyncStorage.setItem('UserToken', tokenData);
            }
            return res["success"];

        }catch (error) {
            console.error(error);
          }
    };

    const getModeApi = async () => {
        let fixedUrl = url+"/member/userId";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };

        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            setMode("CUSTOMER");
            setId(res["id"]);
            await getAllowApi()
            .then(() => {
                setSuccess(true)});
            return res["type"];
        }catch(error) {
            console.error(error);
        }
    };

    const getAllowApi = async () => {
        const {status} = await Location.requestBackgroundPermissionsAsync();
        if (status === "granted"){ 
            setAllow(true);
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High}); 
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
        }else{
            setAllow(false);
        }
        return;
    }


    const _handleLoginPress = async (request_code) => {
        try{
            spinner.start();
            const result = await requestToken(request_code);
            if (!result) {
                alert("이 계정으로는 가입 및 로그인이 불가능합니다. ");
            }else {
                await getModeApi();
            }
    }catch(e){
        Alert.alert("Login Error", e.message);
    }finally{
        spinner.stop();
    }
    };



    return (
        <View style={{ flex: 1 }}>
            {/* 인가 코드 받아오기 */}
            <WebView
                originWhitelist={['*']}
                scalesPageToFit={true}    
                source={{ uri: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${random_state}` }}
                javaScriptEnabled={true}
                injectedJavaScript={runFirst}
                onMessage={(event) => {LogInProgress(event.nativeEvent["url"]); }}
            />

        </View>
    );

};


export default NaverLogin; 