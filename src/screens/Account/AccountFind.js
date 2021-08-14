import React,{useState, useEffect, useRef, useContext} from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {removeWhitespace, validateEmail} from "../../utils/common";
import {Button, Input} from "../../components";
import styled from "styled-components/native";
import {UrlContext} from "../../contexts";
import {Alert} from "react-native";

const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({theme})=> theme.background};
    padding: 20px;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: bold;
    color: ${({theme}) => theme.titleColor};
    margin-top: 40px;
`;

const ErrorText = styled.Text`
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    line-height: 17px;
    color: ${({theme}) => theme.errorText}
`;

const AccountFind = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [certification, setCertification] = useState("");
    const [certificated, setCertificated] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const {url} = useContext(UrlContext);
    const didMountRef = useRef();

    useEffect(()=> {

        if(didMountRef.current){
        let _errorMessage = '';
        if(!email){
            _errorMessage = "이메일을 입력하세요.";
        }
        else if(!validateEmail(email)){
            _errorMessage = "이메일 형식을 확인하세요.";
        }else if(!confirmed){
            _errorMessage = "이메일 인증하세요.";
        }else if(!certification){
            _errorMessage = "인증번호를 입력하세요.";
        }
        else {
            _errorMessage = "";
        }
        setErrorMessage(_errorMessage);}
        else {
            didMountRef.current = true;
        }
    },[email, confirmed, certification]);

    useEffect(()=> {
        setDisabled(!(email && confirmed && certification));
    },[email, confirmed, errorMessage, certification]);

    const handleApi = async () => {
        const response = await fetch(url+`/member/auth/verify?email=${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            });

        const res = await response.json();
        return res["success"];    
    };

     // 서버 연동후 이메일 인증 확인 
     const _handleValidateEmailButtonPress = async() => {
        const result = await handleApi();
        if(!result){
            alert("이메일을 다시 확인하세요.");
        }else{
            setConfirmed(true);
            alert("인증번호가 전송되었습니다.");
        }
    };

    const handleKeyApi = async() => {
        let fixed = url+`/member/auth/verify/password?email=${email}&key=${certification}`
        console.log(fixed);
        const response = await fetch(fixed);
        const res = await response.json();
        console.log(res);
        return res["code"];
    };

    const _handleAuthButtonPress = async() => {
        console.log(certification)
        const result =  await handleKeyApi();
        if (result === 400){
            setCertificated(false);
            setErrorMessage("인증번호가 틀렸습니다.");
        }else if (result === 500){
            setCertificated(true);
            Alert.alert(
                "", "비밀번호가 전송되었습니다.\n다시 로그인해주세요.",
                [{ text: "확인", 
                onPress: () => {
                    navigation.navigate("Login");
                } }]
            );
        }else {
            setCertificated(false);
            setErrorMessage("다시 시도하세요.");
        }
    };

    return (
        <KeyboardAwareScrollView 
        contentContainerStyle={{flex: 1}}
        extraScrollHeight={20}>
            <Container>
                <Title>계정 찾기</Title>
                <Input
                label="이메일"
                value={email}
                onChangeText={ text => setEmail(removeWhitespace(text))}
                onSubmitEditing={_handleValidateEmailButtonPress} 
                placeholder="이메일을 입력하세요"
                returnKeyType="done"
                hasButton
                buttonTitle="인증"
                onPress={_handleValidateEmailButtonPress}
            />

                <Input  
                label="인증번호" 
                value={certification} 
                onChangeText={text=> setCertification(removeWhitespace(text))} 
                onSubmitEditing={_handleAuthButtonPress} 
                placeholder="인증번호를 입력하세요" 
                returnKeyType="done" 
                />

                <ErrorText>{errorMessage}</ErrorText>

                <Button title="인증 확인" onPress={_handleAuthButtonPress} disabled={disabled}/>

            </Container>
            
        </KeyboardAwareScrollView>
    );
};

export default AccountFind;