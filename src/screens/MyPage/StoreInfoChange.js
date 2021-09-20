import React, { useState, useEffect, useRef, useContext } from 'react';
import styled from "styled-components/native";
import { View, StyleSheet } from "react-native";
import { ProfileImage, InfoText, Button } from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { removeWhitespace, validatePassword } from "../../utils/common";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";


const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const InfoContainer = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    margin-left: 40px;
`;

const CenterContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    margin-bottom: 5%;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-top: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

const StoreInfoChange = ({navigation,route}) => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token} = useContext(LoginContext);

    const [photo, setPhoto] = useState(route.params.photo);
    const [userName, setuserName] = useState(route.params.userName);
    const [email, setEmail] = useState(route.params.email);
    const [password, setPassword] = useState();

    const [errorMessage, setErrorMessage] = useState("");
    const [disabled, setDisabled] = useState(true);

    const didMountRef = useRef();

    //에러 메세지 설정 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
                if (!userName) {
                    _errorMessage = "업체명을 입력하세요.";
                } else if (!password) {
                    _errorMessage = "비밀번호를 입력하세요.";
                } else if (!validatePassword(password)) {
                    _errorMessage = "비밀번호 조건을 확인하세요.";
                }else {
                    _errorMessage = "";
                }
            setErrorMessage(_errorMessage);
        } else {
            didMountRef.current = true;
        }
    }, [userName, password]);

    // 버튼 활성화
    useEffect(() => {
        setDisabled(            
            !(userName && password &&  !errorMessage && validatePassword(password) )
        );
        
    }, [userName, password, errorMessage]);

    
    // 서버 put 처리 (회원 정보 수정)
    const putApi = async (url) => {

       

        let options = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
            body: JSON.stringify({ 
                name: userName,
                password: password,

            }),
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();
            

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 회원 이미지 등록
    const postApi = async () => {
        let fixedUrl = url+'/member/image'; 

        if(photo != null && photo != route.params.photo){
            let filename = photo.split('/').pop();

            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
    
            let formData = new FormData();
            formData.append('file', { uri: photo, name: filename, type: type });
    
           

            let options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'X-AUTH-TOKEN' : token,
                },
                body: formData,
            };
            try {
                let response = await fetch(fixedUrl, options);
                let res = await response.json();
    
                
                return res["success"];
            
                } catch (error) {
                console.error(error);
            }
        }
    
    }
    
   
    // 정보 수정
    
    const _handleChangeButtonPress = async() => {
        try{
            spinner.start();

            const result = await putApi(url+"/member/store");
            const result_photo = await postApi();

            if(photo != null && photo != route.params.photo){
                if(result && result_photo){
                    navigation.navigate("StoreInfo");
                }
                else{
                    alert("저장에 실패했습니다.");
                }
            }
            else{
                if(result){
                    navigation.navigate("StoreInfo");
                }
                else{
                    alert("저장에 실패했습니다.");
                }
            }
            
    
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }      
           
        
        
    }


    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>

                <View style={{ marginTop: 30 }} ></View>

                <ProfileImage
                    url={photo}
                    onChangeImage={url => setPhoto(url)}
                    showButton />

                <InfoContainer>
                    <InfoText
                        label="업체명"
                        value={userName}
                        onChangeText={text => setuserName(text)}
                        placeholder="닉네임"
                        returnKeyType="done"
                        isChanged

                    />
                    <InfoText label="이메일" content={email} />
                    <InfoText
                        label="비밀번호"
                        value={password}
                        onChangeText={text => setPassword(removeWhitespace(text))}
                        placeholder="특문, 숫자, 영문 포함 8자-16자"
                        returnKeyType="done"
                        isChanged
                        isPassword

                    />
                    <ErrorText>{errorMessage}</ErrorText>
                </InfoContainer>

                <CenterContainer>
                    {/* 변경사항 서버 저장 */}
                    <Button
                        containerStyle={{ width: '50%', }}
                        title="저장"
                        disabled={disabled}
                        onPress={_handleChangeButtonPress}
                    />
                </CenterContainer>

            </KeyboardAwareScrollView>

        </Container>
    );
};

export default StoreInfoChange;