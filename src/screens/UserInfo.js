import React, {useState} from 'react';
import styled from "styled-components/native";
import {StyleSheet, Text, View} from "react-native";
import {ProfileImage, InfoText,ToggleButton, RadioButton} from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';

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

    // 임의로 설정
    const userName = "닉네임이름";
    const email = "이메일주소";
    const password = "비밀번호 비공개";
    const age = "나이";
    const gender = "female";
    const [isNoticed, setIsNoticed] = useState(false);

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>
            <InfoChangeButton 
                    onPress={() =>{navigation.navigate("UserInfoChange");
                }}>
                    <InfoChangeText>내 정보 수정하기</InfoChangeText>
                </InfoChangeButton>

                <ProfileImage />

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
                    <Text style={styles.delete}>회원탈퇴</Text>
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