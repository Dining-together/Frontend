import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, View, StyleSheet,TouchableOpacity, Alert } from 'react-native';
import styled from "styled-components/native";
import { Input,Button, RadioButton } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace, validatePassword } from '../../utils/common';
import {ProgressContext, UrlContext, LoginContext} from "../../contexts";
import Postcode from '@actbase/react-daum-postcode';
import * as Location from "expo-location";

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({theme})=> theme.background};
    padding: 40px 20px;
`;

const Title = styled.Text`
    font-size: 40px;
    font-weight: bold;
    color: ${({theme}) => theme.titleColor};
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    font-size: 13px;
    font-weight: 900;
    margin-bottom: 10px;
    padding-bottom: 1px;
    padding-left: 1%;
    color: ${({ theme }) => theme.errorText};
`;

const UserView = styled.View`
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    background-color: ${({theme})=> theme.background};
    width: 100%;
`;

const RadioView = styled.View`
    flex: 1;
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
    margin-left: 0;
`;

const RadioTitle = styled.Text`
    font-size: 14px;
    font-weight: 600;
    margin-right: 10px;
    color: ${({theme}) => theme.label};
    margin-top: 5px;
`;

const Signup = ({ navigation, route }) => {

    const {spinner} = useContext(ProgressContext);
    const {url} = useContext(UrlContext);
    const {allow, setAllow} = useContext(LoginContext);

    //별명, 업체명
    const [userId, setuserId] = useState('');

    //아이디인 이메일
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    const [errorMessage, setErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    //이메일 중복확인 클릭 여부
    const [pressBeforeEmail, setPressBeforeEmail] = useState(false);
    const [isEmailValidated, setIsEmailValidated] = useState(false);
    
    //이메일 인증버튼 클릭 여부
    const [emailConfirmPress, setEmailConfirmPress] = useState(false);

    //이메일 인증번호
    const [emailConfirmCode, setEmailConfirmCode] = useState("");
    const [emailCodePress, setEmailCodePress] = useState(false);

    //서버를 통해 받아온 값 (임의) 
    //이메일 중복 확인 결과
    const [isSameEmail, setIsSameEmail] = useState(true);

    //이메일 인증 확인 결과
    const [isConfirmedEmail, setIsConfirmedEmail] = useState(false);
    let isCorrect = false;

    //이메일 인증 전송<>확인
    const [isConfirmedSend, setIsConfirmSend] = useState(false);

    //주소
    const [addr, setAddr] = useState("");
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [allowLoc, setAllowLoc] = useState(allow);
    const [isAddressModal, setIsAddressModal] = useState(false);
    const [isChanging, setIsChanging] = useState(false);

    const userIdRef =useRef();
    const emailConfirmRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const didMountRef = useRef();
    const ageRef = useRef();
    const emailMountRef = useRef();
     
    const _getLocPer = async () => {
        try{
            const {status} = await Location.requestForegroundPermissionsAsync();
            if(status === "granted"){
                setAllow(true);
                setAllowLoc(true);
            };
        }catch (e) {
            console.log(e);
        };
      };

      const _getLL = async(address) => {
        Location.setGoogleApiKey("AIzaSyBPYCpA668yc46wX23TWIZpQQUj08AzWms");
        let res =  await Location.geocodeAsync(address);
        setLat(res[0].latitude);
        setLon(res[0].longitude);
        setIsChanging(false);
    };

    useEffect(() => {
        _getLocPer();
    },[]);  

    useEffect(() => {

        if (didMountRef.current) {
            let _errorMessage = '';
            if(!email){
                _errorMessage = "이메일을 입력하세요.";
            }
            else if (!emailConfirmPress && !isSameEmail)
            {
                _errorMessage = "이메일을 인증하세요.";
            }else if(!emailCodePress) 
            {
                _errorMessage = "이메일 인증번호를 확인하세요. ";
            }
            else if(!password){
                _errorMessage = "비밀번호를 입력하세요.";
            }
            // 비밀번호 영문, 숫자, 특문 1개 포함 8~16자리
            else if (!validatePassword(password)) {
                _errorMessage = "비밀번호 조건을 확인하세요.";
            }
            else if (password !== passwordConfirm){
                _errorMessage = "비밀번호를 확인하세요.";
            }
            else if(route.params.mode === "User"){
                if (!removeWhitespace(userId)){
                    _errorMessage = "닉네임을 입력하세요.";
                }
                if(!age){
                    _errorMessage = "나이를 입력하세요.";
                }
                if(!addr){
                    _errorMessage = "주소를 입력하세요.";
                }
                if(!gender){
                    _errorMessage = "성별을 입력하세요.";
                }
            }else if (route.params.mode === "Store") {
                if (!removeWhitespace(userId)){
                    _errorMessage = "업체명을 입력하세요.";
                }
            }
            else{
                _errorMessage = '';
            }
            setErrorMessage(_errorMessage);
        } else {
            didMountRef.current = true;
            }
        
    }, [email, password, passwordConfirm, userId, emailConfirmPress,gender,age,emailCodePress, addr]);

    useEffect(() => {
        
        if(emailMountRef.current){
            let _emailErrorMessage = '';
            if(!email){
                _emailErrorMessage="이메일을 입력하세요.";
            }else if(!validateEmail(email)) {
                _emailErrorMessage = "이메일 형식을 확인하세요. ";
            }
            else if(!isEmailValidated){
                _emailErrorMessage = "이메일 중복확인을 해주세요.";
            }
            else if(isSameEmail){
                _emailErrorMessage = "중복된 이메일입니다. ";
            }
            else if(!isSameEmail && !emailCodePress){
                _emailErrorMessage="사용 가능한 이메일입니다. ";
            }
            else if(!emailConfirmCode){
                _emailErrorMessage="이메일 인증번호를 입력하세요. ";
            }else if(!emailCodePress){
                _emailErrorMessage="이메일 인증번호를 확인하세요. ";
            }
            else if(!isConfirmedEmail && emailCodePress && isCorrect) {
                _emailErrorMessage="인증번호가 틀렸습니다. ";
            }
            else {
                _emailErrorMessage = "";
            }
            setEmailErrorMessage(_emailErrorMessage);
        }else {
            emailMountRef.current = true;
        }
    },[pressBeforeEmail,email,isSameEmail, isConfirmedEmail, emailConfirmPress, emailConfirmCode, emailCodePress, isEmailValidated]);

        useEffect(() => {
            setDisabled(            
                !(userId && email && password && passwordConfirm && !errorMessage &&isEmailValidated && !emailErrorMessage && !isChanging)
            );
            if(route.params.mode==="User"){
                if(!gender){
                    setDisabled(true);
                }
            }
        }, [userId, email, password, passwordConfirm, errorMessage, isEmailValidated, gender,age, emailErrorMessage, isChanging]);
        
        // 이메일 중복확인 
        const _handleEmailButtonPress = async() => {
            let fixedUrl = url+'/member/auth/signup?email='+`${email}`;
            try{
                spinner.start();

                const result =  await getApi(fixedUrl);
                if(!isSameEmail){ 
                    setEmailConfirmPress(true);
                }else{
                    setPressBeforeEmail(true);
                    if(email){
                        setIsEmailValidated(true);
                        //중복 확인 코드 
                        if (result===true){
                            setIsSameEmail(false);
                            setEmailConfirmPress(true);
                            setEmailErrorMessage("");
                            
                        }else if (result === "overlap"){
                            setIsSameEmail(true);
                            setEmailErrorMessage("중복된 이메일입니다.");
                        }else{
                            setEmailErrorMessage("오류가 발생하였습니다.");
                        }
                    }
                }
            }catch(e){
                    console.log("Error", e.message);
            }finally{
                spinner.stop();
            }
                  
        };
        // 이메일 키값 전송
        const _handleEmailVaildateSend = async() => {
            try{
                spinner.start();
            
                const result =  await postemailApi();
                if(!result){
                    alert("이메일을 다시 확인하세요.");
                }else{
                    alert("인증번호가 전송되었습니다.");
                    setIsConfirmSend(true);
                }
        
            }catch(e){
                    console.log("Error", e.message);
            }finally{
                spinner.stop();
            }
           
        }

        // 이메일 인증 키값 확인
        const _handleEmailVaildatePress = async() => {
            let fixedUrl = url+'/member/auth/verify?email='+`${email}&key=${emailConfirmCode}`;
            try{
                spinner.start();
            
                setEmailCodePress(true);
                    const result = await getApi(fixedUrl);
                    if(emailConfirmCode)
                    {    
                        if(result){
                            setIsConfirmedEmail(true)
                        }
                        else{
                            setIsConfirmedEmail(false)
                            alert("인증키를 다시 확인하세요.");
                        }
                        isCorrect = true;
                    }
            
            }catch(e){
                    console.log("Error", e.message);
            }finally{
                spinner.stop();
            }
                
        };

        // 회원가입 처리
        const _handleSignupPress = async() => {
            try{
                spinner.start();

                const result =  await postApi();

                if(result){
                    Alert.alert("","회원가입이 되었습니다.",[ { text:"확인", onPress: () => navigation.navigate("Login") }] ); 
                }
                else{
                    alert("다시 시도해주세요.");
                }
        
            }catch(e){
                    console.log("Error", e.message);
            }finally{
                spinner.stop();
            }
           
        };


        // 이메일 키값 전송 api
        const postemailApi = async () => {
            let fixedUrl = url+'/member/auth/verify?email='+`${email}`;
            console.log(fixedUrl);
            
            let options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            };
            try {
                let response = await fetch(fixedUrl, options);
                let res = await response.json();

                console.log(res);
                return res["success"];

              } catch (error) {
                console.error(error);
              }

        }

        // 회원가입 api
        const postApi = async () => {
            let fixedUrl = url+'/member/auth/signup'; 
            let Info;

            if(route.params.mode === 'User'){
                Info = {
                    age: parseInt(age),
                    gender: gender,
                    email : email,
                    name : userId,
                    password : password,
                    userType: "CUSTOMER",
                    latitude: lat,
                    longitude: lon,
                    addr: addr,
                }
            }
            else if(route.params.mode === 'Store'){
                Info = {
                    email : email,
                    name : userId,
                    password : password,
                    userType: "STORE",
                }
            }

            let options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( Info ),
            
            };
            console.log(JSON.stringify( Info ));
            try {
                let response = await fetch(fixedUrl, options);
                let res = await response.json();

                console.log(res);
                return res["success"];
                
                
              } catch (error) {
                console.error(error);
              }

        }

        // 서버 get 처리
        const getApi = async (url) => {
            
            console.log(url);
            try {
                let response = await fetch(url);
                let res = await response.json();
                console.log(res);
                let msg = res["msg"];
                if (msg === "이미 등록된 회원 이메일입니다."){
                    return "overlap"
                }
                return res["success"];

              } catch (error) {
                console.error(error);
              }
           
        }

    return (
        <KeyboardAwareScrollView
        extraScrollHeight={20}
        >
        <Container>
            <Title>회원가입</Title>
            <Input
                label="이메일"
                value={email}
                onChangeText={ text => setEmail(removeWhitespace(text))}
                onSubmitEditing={emailConfirmPress? ()=> emailConfirmRef.current.focus() : () => passwordRef.current.focus()} 
                placeholder="이메일을 입력하세요"
                returnKeyType="next"
                hasButton
                buttonTitle="중복확인"
                onPress={_handleEmailButtonPress}
                completed={emailConfirmPress? true : false}
            />
           {emailErrorMessage !== "" && <ErrorText>{emailErrorMessage}</ErrorText>}

            {emailConfirmPress&&
            <Input label="이메일 인증번호"
            ref={emailConfirmRef}
            value={emailConfirmCode}
            onChangeText={text => setEmailConfirmCode(removeWhitespace(text))}
            onSubmitEditing={() => passwordRef.current.focus()}
            placeholder="인증번호를 입력하세요"
            returnKeyType="next"
            hasButton
            buttonTitle={ isConfirmedSend ? "인증확인" : "인증전송"}
            onPress={ isConfirmedSend ? _handleEmailVaildatePress : _handleEmailVaildateSend}
            completed={isConfirmedEmail? true : false}
            />}

            <Input
                ref={passwordRef}
                label="비밀번호 (특수문자, 숫자, 영문 포함 8자-16자 내외)"
                value={password}
                onChangeText={ text => setPassword(removeWhitespace(text))}
                onSubmitEditing={() => passwordConfirmRef.current.focus()} 
                placeholder="비밀번호를 입력하세요"
                returnKeyType="next"
                isPassword
            />
            <Input
                ref={passwordConfirmRef}
                label="비밀번호 확인"
                value={passwordConfirm}
                onChangeText={ text => setPasswordConfirm(removeWhitespace(text))}
                onSubmitEditing={() => userIdRef.current.focus()} 
                placeholder="비밀번호를 입력하세요"
                returnKeyType="next"
                isPassword
            /> 
            
            <Input
                ref={userIdRef}
                label={route.params.mode === "User"? "닉네임" : "업체명"}
                value={userId}
                onChangeText={ text => setuserId(text)}
                onSubmitEditing= { route.params.mode === 'User' ? 
                () => ageRef.current.focus() : null }
                placeholder={route.params.mode === "User"? "닉네임을 입력하세요" : "업체명을 입력하세요"}
                returnKeyType= {route.params.mode === "User"? "next" : "done"}
                onSubmitEditing={() => {
                    if(route.params.mode !== 'User'){
                        _handleSignupPress();
                    }else{
                        ageRef.current.focus();
                    }
                }}
            />

        
            { route.params.mode === 'User' && (
                <UserView>
                <Input
                    ref={ageRef}
                    label="나이"
                    value={age}
                    onChangeText={text => setAge(removeWhitespace(text))}
                    placeholder="나이를 입력하세요"
                    returnKeyType="done"
                    keyboardType="number-pad"
                />
                <Input 
                label="주소"
                value={addr}
                placeholder="주소를 입력하세요"
                onChangeText={text => setAddr(text)}
                editable={addr===""? false: true}
                returnKeyType="done"
                hasButton
                buttonTitle="검색"
                onPress={() => { 
                    if(allowLoc){
                        setIsAddressModal(true); 
                        setAddr("");
                    }else {
                        Alert.alert("Location Permission Error","위치 정보를 허용해주세요.");
                    }
                    }}
                completed={addr!==""? true : false}
                />
                <Modal visible={isAddressModal} transparent={true}>
                        <TouchableOpacity style={styles.background} onPress={() => setIsAddressModal(false)}/>
                        <View style={styles.modal}>
                            <Postcode
                                style={{  width: 350, height: 450 }}
                                jsOptions={{ animated: true, hideMapBtn: true }}
                                onSelected={data => {
                                let ad = JSON.stringify(data.address).replace(/\"/g,'');
                                setAddr(ad);
                                setIsAddressModal(false);
                                setIsChanging(true);
                                _getLL(ad);
                                }}
                            />
                        </View>
                    </Modal>
                <RadioTitle>성별</RadioTitle>
                <RadioView>
                        <RadioButton
                            label="남자"
                            status={ gender === 'male' ? 'checked' : 'unchecked' }
                            onPress={()=>{
                                setGender('male');
                            }}
                        />
                        <RadioButton
                            label="여자"
                            status={ gender === 'female'? 'checked' : 'unchecked' }
                            onPress={()=>{
                                setGender('female');
                            }}
                        />
                    </RadioView>
                </UserView>
            )}
            
            <ErrorText>{errorMessage}</ErrorText>
            <Button
                title="회원가입"
                onPress={_handleSignupPress}
                disabled={disabled}
            />
            
        </Container>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    modal: {
        marginHorizontal: 20,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: '25%',
        backgroundColor: 'white',
      },
      background: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
});

export default Signup;