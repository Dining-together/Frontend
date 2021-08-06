import React, {useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import {StyleSheet, Text, View, Alert} from "react-native";
import {ProfileImage, InfoText,ToggleButton, RadioButton} from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import {UrlContext, LoginContext, ProgressContext} from "../../contexts";

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

const RowContainer = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 5px;
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

     // 서버 get 처리 (정보 가져오기)
     const getApi = async (url) => {

        console.log(url);

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
            console.log(res);

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

        console.log(url);

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
                    [{ text: "확인", onPress: () => {setSuccess(false);} }] );
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

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>
            <InfoChangeButton 
                    onPress={() =>{navigation.navigate("UserInfoChange",
                    { photo: photo, userName: userName, email: email, age: age, gender: gender,
                        addr: addr, lati: lati, longi: longi,
                    });
                }}>
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
                    <InfoText label="지역" content={addr}/>
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
});

export default UesrInfo; 