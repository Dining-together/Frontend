import React, {useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import {StyleSheet, Text, View, Alert, Modal, TouchableOpacity} from "react-native";
import {ProfileImage, InfoText,ToggleButton, RadioButton, SmallButton} from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import {UrlContext, LoginContext, ProgressContext} from "../../contexts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeWhitespace } from "../../utils/common";


const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
`;

const InfoChangeButton = styled.TouchableOpacity`
    justify-content: flex-end;  
    flexDirection: row;
    margin: 15px;
`;

const InfoChangeText = styled.Text`
    font-weight: bold;
    font-size: 16px;
    color: ${({theme})=> theme.titleColor};
`;

const InfoContainer = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
    margin-left: 40px;
`;

const SettingContainer = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
    margin-left: 20px;
    margin-top: 10px;
`;


const RadioTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-right: 7px;
    width: 20%;
    align-self: center;
`;

const AdditionalContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 6px;
`;

const RowContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 5px;
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
      width: ${({ width }) => width ? width : 80}%;
      background-color: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};
      padding: 10px 15px;
      font-size: 16px;
      border: 1px solid ${({ theme }) => theme.inputBorder};
      border-radius: 4px;
      margin-top: 10px;
  `;

const PwContainer = styled.View`
    background-color: ${({ theme }) => theme.background}; 
    flex-direction: row;
    margin : 40% 10px 0 10px;
    border-radius: 10px;
    border: 1px solid black;
    padding: 15px;
`;

const  UesrInfo = ({navigation}) => {

    const {url} = useContext(UrlContext);
    const {token, setSuccess} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);

    const [photo, setPhoto] = useState();
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const password = "비공개";
    const [age, setAge] = useState();
    const [gender, setGender] = useState();
    const [addr, setAddr] = useState();
    const [lati, setLati] = useState();
    const [longi, setLongi] = useState();
    const [isNoticed, setIsNoticed] = useState(false);

    // 비밀번호 팝업창
    const [isDialog, setIsDialog] = useState(false);
    const [pw, setPw] = useState('');
    
    // 메뉴추가/수정 팝업창
    const [isPwModal, setIsPwModal] = useState(false);
    

     // 서버 get 처리 (정보 가져오기)
     const getApi = async (url) => {

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },

        };
        try {
            spinner.start();
            let response = await fetch(url,options);
            let res = await response.json();
           

            setPhoto(res.data.path);
            setUserName(res.data.name);
            setEmail(res.data.email);
            setAge(String(res.data.age));
            setGender(res.data.gender);
            setAddr(res.data.addr);
            setLati(res.data.latitude);
            setLongi(res.data.longitude);

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    }


    useEffect( () => {
        getApi(url+"/member/customer");

        // 화면 새로고침
        const willFocusSubscription = navigation.addListener('focus', () => {
            getApi(url+"/member/customer");
        });

        return willFocusSubscription;

    }, []);

    // 회원 탈퇴 delete 처리
    const deleteApi = async (url) => {

      

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    const clearAll = async () => {
        try {
            spinner.start();
          await AsyncStorage.clear()
        } catch(e) {
          console.error(e);
        }finally{
            spinner.stop();
        }
      };

    // 회원 탈퇴 처리
    const _onDelete = async() => {
        try{
            spinner.start();

            const result = await deleteApi(url+"/member/user");

            if(!result){
                alert("다시 회원탈퇴를 시도해주세요.");
            }
            else{
                Alert.alert(
                    "", "회원탈퇴 되었습니다",
                    [{ text: "확인", onPress: () => {
                        clearAll();
                        setSuccess(false);
                    } }] );
            }

        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    // 회원 탈퇴
    const _handleDeletePress = () => {

        Alert.alert(
            "", "정말 탈퇴하시겠습니까?",
            [{ text: "확인", 
            onPress: _onDelete },
            {
                text: "취소", style: "cancel"
            },
            ]
          );

    }

    // 비밀번호 확인
    const postApi = async () => {
        let pwpw = removeWhitespace(pw)
        pwpw = encodeURIComponent(pwpw)
        let fixedUrl = url+"/member/password/verification?password="+pwpw;
        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };

        try{
            let response = await fetch(fixedUrl, options);
            let res = await response.json();

            console.log(res);

            return res["success"];
        }catch (error) {
            console.error(error);
          }
        
    };
    // 메뉴 등록 버튼 눌렀을때

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>

            <InfoChangeButton 
                onPress={() =>{ navigation.navigate("UserInfoChange",
                { photo: photo, userName: userName, email: email, age: age, gender: gender,
                    addr: addr, lati: lati, longi: longi,
                });}}>
                <InfoChangeText>내 정보 수정하기</InfoChangeText>
            </InfoChangeButton>


                <ProfileImage url={photo}/>

                <InfoContainer>
                    <InfoText label="닉네임" content={userName}/>
                    <InfoText label="이메일" content={email}/>
                    <InfoText label="비밀번호" content={password}/>
                    <InfoText label="나이" content={age}/>
                    <RowContainer>
                        <AdditionalContainer>
                        <RadioTitle>성별</RadioTitle>
                        <RadioButton 
                            label="여자"
                            status={(gender==="female"? "checked" : "unchecked")}
                            containerStyle={{ marginBottom: 0, marginLeft: 0, marginRight: 0}}
                            onPress={()=>{}}
                        />
                        <RadioButton 
                            label="남자"
                            status={(gender==="male"? "checked" : "unchecked")}
                            containerStyle={{marginBottom:0, marginLeft: 0, marginRight: 0}}
                            onPress={()=>{}}
                        /></AdditionalContainer>
                    </RowContainer>
                    <InfoText label="주소" content={addr}/>
                </InfoContainer>
                
                <View style={styles.hr}/>

                <SettingContainer>
                    <RowContainer>
                        <MaterialIcons name="settings" size={35}/>
                        <Text style={styles.setting}> 환경설정</Text>
                    </RowContainer>
                    <SettingContainer>
                        <ToggleButton
                            label="알림 수신동의"
                            value={isNoticed}
                            onValueChange={() => setIsNoticed(previousState => !previousState)}/>
                    </SettingContainer>
                </SettingContainer>

                <InfoChangeButton 
                    onPress={() =>{}}>
                    <Text style={styles.delete} onPress={_handleDeletePress}>회원탈퇴</Text>
                </InfoChangeButton>

                </KeyboardAwareScrollView>
            </Container>
        
    );
};

const styles = StyleSheet.create({
    delete: {
        fontSize: 15,
        textDecorationLine: 'underline',
    },
    info: {
        fontSize: 14, 
        marginLeft: 5, 
        alignSelf: 'center',
        fontWeight: "bold",
    },
    hr: {
        marginBottom: 10,
        marginTop: 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
    },
    setting : {
        fontSize: 23, 
        marginLeft: 6, 
        marginTop: 2,
    },
    background: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
      row: {
        flexDirection:'row',
      }
});

export default UesrInfo; 