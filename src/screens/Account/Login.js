// 로그인 페이지
import React, {useState, useRef,useEffect, useContext} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import {Input,Button, CheckBoxLetter, IconButton} from "../../components";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {validateEmail,removeWhitespace} from "../../utils/common";
import {images} from "../../images";
import {UrlContext, ProgressContext, LoginConsumer, LoginContext} from "../../contexts";
import {Alert} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from '@react-native-async-storage/async-storage';


const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({theme})=> theme.background};
    padding: 0 20px;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: bold;
    color: ${({theme}) => theme.titleColor};
`;

const Letter = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const AdditionalLetter = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const ErrorText = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: ${({theme}) => theme.errorText}
    padding: 2px 0;
`;

const QText = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: ${({theme}) => theme.text}
    padding: 2px 0;
    align-self: flex-start;
`;

const SocialContainer = styled.View`
    width: 100%;
    margin-top: 10%;
`;

const KakaoImage = styled.Image`
    height: 28px;
    width: 28px;
    position: absolute;
    left: 6%;
`;

const NaverImage = styled.Image`
    height: 40px;
    width: 40px;
    position: absolute;
    left: 5%;
`;

const SocialBackground = styled.TouchableOpacity`
    flex-direction: row;
    width: 100%;
    height: 50px;
    background-color: ${({color,theme})=> color? color : theme.background};
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    margin-top : ${({hasMarginTop})=> hasMarginTop? 5 : 0}px;
`;

const ButtonText = styled.Text`
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    color: ${({theme, isKakao}) => isKakao? theme.kakaoTextColor : theme.buttonTextColor};
`;


const Login = ({navigation}) => {
    const {spinner} = useContext(ProgressContext);
    const {url} = useContext(UrlContext);
    const {token, mode, doc, allow, setSuccess, setAllow, setAutoLogin, setToken, setMode, setDoc, setId} = useContext(LoginContext);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [auto, setAuto] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const passwordRef = useRef();
    let tokenData = "";
    const theme = useContext(ThemeContext);

    useEffect(()=> {setDisabled(!(userId&&password))}, [userId,password]);

    const _handleEmailChange = email => {
        const changedEmail = removeWhitespace(email);
        setUserId(changedEmail);
        setErrorMessage(
            validateEmail(changedEmail)? "" : "이메일 형식을 확인하세요."
        );
    };

    const getDocApi = async () => {
        let fixedUrl = url+"/member/store";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : tokenData,
            },
        };

        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            setDoc(res["data"]["documentChecked"]);
            return(res["data"]["documentChecked"]);
        }catch(error) {
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
                'X-AUTH-TOKEN' : tokenData,
            },
        };

        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            setMode(res["type"]);
            setId(res["id"]);
            return res["type"];
        }catch(error) {
            console.error(error);
        }
    };

    const handleApi = async () => {
        let fixedUrl = url+"/member/auth/signin";

        let Info = {
            email : userId,
            password: password,
        };

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( Info ),
        };

        try{
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            if(res.success){
                setToken(res["data"]);
                tokenData = res["data"];
                setAutoLogin(auto);
                if(auto){
                    AsyncStorage.setItem('UserToken', tokenData);
                }
            }
            return res["success"];
        }catch (error) {
            console.error(error);
          }
        
    };

    const getAllowApi = async () => {
        const {status} = await Location.requestBackgroundPermissionsAsync();
        if (status === "granted"){ 
            setAllow(true);
        }else{
            setAllow(false);
        }
    }

    const _loginSuccess = async (callback1, callback2, callback3) => {
        var m = await callback1();
        if(m === "STORE"){
            const d = await callback2();
        }
        if(!allow){
            await callback3();
        }
    };

    const _handleLoginPress = async () => {
        try{
            spinner.start();
            const result = await handleApi();
            if (!result) {
                alert("로그인 실패! 다시 입력해주세요.");
            }else {
                await _loginSuccess(getModeApi,getDocApi,getAllowApi);
                setSuccess(true);
            }
    }catch(e){
        Alert.alert("Login Error", e.message);
    }finally{
        spinner.stop();
    }
    };

    return (
        <KeyboardAwareScrollView
        contentContainerStyle={{flex: 1}}
        extraScrollHeight={20}
        >
        <Container>
            <Title>로그인</Title>
            <Input 
            label="이메일" 
            value={userId} 
            onChangeText={_handleEmailChange} 
            onSubmitEditing={() => passwordRef.current.focus()} 
            placeholder="이메일을 입력하세요" 
            returnKeyType="next" 
            />
            
            <Input 
            ref={passwordRef} 
            label="비밀번호" 
            value={password} 
            onChangeText={text=> setPassword(removeWhitespace(text))} 
            onSubmitEditing={() => _handleLoginPress()} 
            placeholder="비밀번호를 입력하세요" 
            returnKeyType="done" 
            isPassword 
            containerStyle={0}/>
            
            <AdditionalLetter>
            <ErrorText>{errorMessage}</ErrorText>
            </AdditionalLetter>
            
            <LoginConsumer>
                {({dispatch})=> (
                    <Button
                    title="로그인"
                    onPress={_handleLoginPress} 
                    disabled={disabled}
                    containerStyle={{marginTop: 0, marginBottom: 2}}/>
            )}
        </LoginConsumer>
               
            <Letter>
            <CheckBoxLetter
            hasIcon={true}
            type={auto? images.checked : images.unchecked}
            title="자동 로그인"
            onPress={() => setAuto(!auto)} />
             <CheckBoxLetter
            hasIcon={false}
            title="아이디/비밀번호 찾기"
            onPress={()=> {navigation.navigate("AccountFind")}}
            />
            </Letter>

           
           <SocialContainer>
                <QText>SNS 계정 로그인</QText>
            <SocialBackground color={theme.kakaoColor} 
                onPress={() => {navigation.navigate("KakaoLogin");}}>
                    <KakaoImage source={images.kakaoLogin} />
                    <ButtonText isKakao={true}>카카오 로그인</ButtonText>
                </SocialBackground>
                <SocialBackground color={theme.naverColor} hasMarginTop={true}>
                    <NaverImage source={images.naverLogin} />
                    <ButtonText>네이버 로그인</ButtonText>
                </SocialBackground>
            </SocialContainer>

            <SocialContainer style={{marginTop: 20}}>
                <QText>아직 회원이 아니신가요?</QText>
                <Button title="회원가입" containerStyle={{marginTop: 0}}
                onPress={() => {
                    navigation.navigate("Mode");
                }}/>
            </SocialContainer>
        </Container>
        </KeyboardAwareScrollView>
    );
};


export default Login;