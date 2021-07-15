import React, {useState, useEffect} from 'react';
import styled from "styled-components/native";
import {View, Modal, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {ProfileImage, InfoText, Button, RadioButton} from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { removeWhitespace, validatePassword } from '../utils/common';
import Postcode from '@actbase/react-daum-postcode';


const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
`;

const InfoContainer = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
    margin-left: 40px;
`;

const CenterContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 5px;
    margin-bottom: 5%;
`;
const RowContainer = styled.View`
    flex: 1;
    flex-direction: row;
    margin-bottom: 5px;
    margin-top: 6px;
`;

const RadioTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-right: 7px;
    width: 20%;
    align-self: center;
`;






const  UserInfoChange = () => {

    // 임의로 설정, 연동 후 기존 설정값 등록
    const [Photo, setPhoto] = useState(null);
    const [address, setAddress] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');
    const [userName, setuserName] = useState('안녕하세요');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('23');
    const [gender, setGender] = useState('female');

    // 닉네임 중복확인, 핸드폰 인증
    const [isNameCheck, setNameCheck] = useState(false);
    const [isPhoneCheck, setPhoneCheck] = useState(false);
    const [isPassword, setIsPassword] = useState(false);

    const [isModal, setModal] = useState(false);



    const _handleChangeButtonPress = () => {
        if (!userName) {
            Alert.alert('','닉네임을 입력해주세요');
            return;
        }
        if(!isNameCheck){
            Alert.alert('','닉네임 중복확인을 해주세요');
            return;
        }
        if(!password){
            Alert.alert('','비밀번호를 설정해주세요');
            return;
        }
        if(password){
            if(!isPassword){
                Alert.alert('','비밀번호를 설정해주세요');
                return; 
            }
        }
        if(!age){
            Alert.alert('','나이를 입력해주세요');
            return; 
        }
        
    

     };

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>

                <View style={{marginTop: 30}} ></View>

               <ProfileImage 
                url={Photo}
                onChangeImage={url => setPhoto(url)}
                showButton />

                <InfoContainer>
                    <InfoText
                        label="닉네임"
                        value={userName}
                        onChangeText={ text => setuserName(text)}
                        placeholder="닉네임"
                        returnKeyType= "done"
                        isChanged
                        showButton
                        title="적용"
                        
                        />
                    <InfoText label="이메일" content="이메일주소"/>
                    <InfoText
                        label="비밀번호"
                        value={password}
                        onChangeText={ text => setPassword(removeWhitespace(text))}
                        placeholder="특문, 숫자, 영문 포함 8자-16자"
                        returnKeyType= "done"
                        isChanged
                        isPassword
                        showButton                                
                        title="변경"
                        disabled={validatePassword(password) ? false : true}
                        onPress={()=> {
                            setIsPassword(true);
                            setPassword(password);
                            editable=false;
                        }}                 
                        />

                    <InfoText
                        label="나이"
                        value={age}
                        onChangeText={ text => setAge(text)}
                        placeholder="나이"
                        returnKeyType= "done"
                        isChanged
                        keyboardType="number-pad"
                        />
                        <RowContainer>
                            
                            <RadioTitle>성별</RadioTitle>
                            <RadioButton 
                                label="여자"
                                status={(gender==="female"? "checked" : "unchecked")}
                                containerStyle={{marginBottom:0, marginLeft: 0, marginRight: 0}}
                                onPress={() => setGender('female')}
                            />
                            <RadioButton 
                                label="남자"
                                status={(gender==="male"? "checked" : "unchecked")}
                                containerStyle={{marginBottom:0, marginLeft: 0, marginRight: 0}}
                                onPress={() => setGender('male')}
                            />
                    </RowContainer>
                </InfoContainer>
                
                <CenterContainer>
                    {/* 변경사항 서버 저장 */}
                    <Button 
                    containerStyle={{width:'50%', }}
                    title="저장"
                    onPress={ _handleChangeButtonPress }
                    />
                </CenterContainer>

                </KeyboardAwareScrollView>
            </Container>
        
    );
};

const styles = StyleSheet.create({
    modal: {
        marginHorizontal: 20,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: '40%',
        backgroundColor: 'white',
      },
      background: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
});

export default UserInfoChange; 