import React, { useState, useContext, useEffect } from 'react';
import styled from "styled-components/native";
import { MypageButton, ProfileImage, SmallButton } from '../../components'
import {LoginContext, UrlContext, ProgressContext} from "../../contexts";
import {Alert, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    background-color: ${({ theme }) => theme.background};
    flex: 1;
    padding: 0 10%;
`;

const IconContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
`;

const InfoContainer = styled.View`
    margin-bottom: 50px;
    
`;

const ProfileContainer = styled.View`
    width: 100%;
    flex-direction: row;
    background-color: ${({ theme }) => theme.background};
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
`;

const ProfileButton = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    
`
const ProfileNameButton = styled.TouchableOpacity`
    width: ${WIDTH*0.5};
    justify-content: center;
    align-items: center;
`

const Username = styled.Text`
    font-size: 23px;
    font-weight: bold;
`;

const LogoutContainer = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
`;


const Mypage_Store = ({ navigation }) => {
    const {token, setSuccess, doc, id, setAutoLogin} = useContext(LoginContext);
    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");

    useEffect(()=> {
        handleApi();
        // 화면 새로고침
        const willFocusSubscription = navigation.addListener('focus', () => {
            handleApi();
        });
        return willFocusSubscription;
    },[]); 

    const handleApi = async () => {
    let fixedUrl = url+"/member/store/"+id;

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
        
        let response = await fetch(fixedUrl, options);
        let res = await response.json();
        
        setName(res.data.name);
        setImage(res.data.path);
    }catch (error) {
        console.error(error);
      } finally {
        spinner.stop();
      }
    };

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

    return (
        <Container>
            <InfoContainer>
                <ProfileContainer>
                    <ProfileButton onPress={() => {
                        navigation.navigate("StoreInfo");
                    }}>
                        {(image !== "") && (
                            <ProfileImage url={image}/>
                        )}
                    </ProfileButton>
                    <ProfileNameButton onPress={() => {
                        navigation.navigate("StoreInfo");
                    }}>
                       <Username style={{color: name===""? "white" : "black"}}>{name}</Username>
                    </ProfileNameButton>
                </ProfileContainer>
                <LogoutContainer>
                    <SmallButton title={doc? "서류 변경" : "서류 등록"}
                        containerStyle={{ width: '35%' }}
                        onPress={() => {navigation.navigate("DocumentRegister")}}
                        uploaded={doc? true : false}
                    />
                    <SmallButton title="로그아웃" containerStyle={{ width: '30%', }}
                        onPress={()=>{
                            Alert.alert(
                                "", "로그아웃하시겠습니까?",
                                [
                                    { text: "확인", 
                                      onPress: () => {
                                        clearAll();
                                        setSuccess(false);
                                        setAutoLogin(false);
                                    }},
                                    {
                                      text: "취소",
                                      style: "cancel"
                                    },
                                  ]
                              );

                        }}
                    />
                </LogoutContainer>

            </InfoContainer>

            <IconContainer>
                <MypageButton title='입찰내역' name='description'  
                    onPress={() => {
                        navigation.navigate("BidManageTab",{ isUser: false });
                    }} />
                <MypageButton title='업체관리' name='home-work'  
                    onPress={() => {
                        navigation.navigate("StoreManage");
                    }}/>
                <MypageButton title='리뷰관리' name='thumb-up' 
                    onPress={() => {
                        navigation.navigate("ReviewManage",{ isUser: false });
                }}/>
            </IconContainer>
            <IconContainer>
                <MypageButton title='로그분석' name='insert-chart' 
               onPress={() => {
                navigation.navigate("LogManageTab");
                }} />
                <MypageButton title='채팅관리' name='chat' 
                    onPress={() => {
                        navigation.navigate("ChatManage");
                }} />
                <MypageButton title='즐겨찾기' name='star' 
                    onPress={() => {
                        navigation.navigate("Bookmark",{ isUser: false });
                }} />
            </IconContainer>
        </Container>
    );
};

export default Mypage_Store;