import React, {useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import { StyleSheet,Text, View, Alert} from "react-native";
import {ProfileImage, InfoText,ToggleButton} from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import {UrlContext, ProgressContext, LoginConsumer, LoginContext} from "../../contexts";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const  StoreInfo = ({navigation}) => {

    const {url} = useContext(UrlContext);
    const {token, setSuccess} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);

    const [photo, setPhoto] = useState();
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const password = "비공개";
    const [isDocument, setIsDocument] = useState();

    const [isNoticed, setIsNoticed] = useState(false);

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
            setIsDocument(res.data.documentChecked);

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    }


    useEffect( () => {
        getApi(url+"/member/store");

        // 화면 새로고침
        const willFocusSubscription = navigation.addListener('focus', () => {
            getApi(url+"/member/store");
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

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>

            <InfoChangeButton 
                    onPress={() =>{navigation.navigate("StoreInfoChange",
                    { photo: photo, userName: userName, email: email });
                }}>
                    <InfoChangeText>내 정보 수정하기</InfoChangeText>
                </InfoChangeButton>

                {/* 사진 불러오기 */}
                <ProfileImage url={photo}/>

                <InfoContainer>
                    <InfoText label="업체명" content={userName}/>
                    <InfoText label="이메일" content={email} />
                    <InfoText label="비밀번호" content={password} isPassword/>
                    <InfoText label="서류" 
                     content={ isDocument ? "등록됨" : "서류 등록 필요" }/>
                </InfoContainer>
                
                <View style={styles.hr}/>

                <SettingContainer>
                    <RowContainer>
                        <MaterialIcons name="settings" size={35}/>
                        <Text style={ styles.setting}>환경설정</Text>
                    </RowContainer>
                    <SettingContainer>
                        <ToggleButton
                            label="알림 수신동의"
                            value={isNoticed}
                            onValueChange={() => setIsNoticed(previousState => !previousState)}/>
                    </SettingContainer>
                </SettingContainer>
                
                {/* 회원탈퇴 구현 필요 */}
                <InfoChangeButton 
                    onPress={() =>{}}
                    >
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

export default StoreInfo;