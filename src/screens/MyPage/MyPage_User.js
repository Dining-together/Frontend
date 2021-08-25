import React, {useContext, useState, useEffect} from 'react';
import styled from "styled-components/native";
import {MypageButton, ProfileImage, SmallButton} from "../../components";
import {LoginContext, UrlContext, ProgressContext} from "../../contexts";
import {Alert, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    background-color: ${({theme})=> theme.background};
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
    background-color: ${({theme})=> theme.background};
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
    align-items: flex-end;
    justify-content: flex-start;
    margin-right: 20px;
`;


const Mypage_User = ( {navigation} ) => {
    const {token, setSuccess, setAutoLogin} = useContext(LoginContext);
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
    let fixedUrl = url+"/member/customer";

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
                    navigation.navigate("UserInfo");
                }}>
                     {(image !== "") && (
                            <ProfileImage url={image}/>
                        )}
                </ProfileButton>
                <ProfileNameButton onPress={() => {
                    navigation.navigate("UserInfo");
                }}>
                    <Username style={{color: name===""? "white" : "black"}}>{name}</Username>
                </ProfileNameButton>
                </ProfileContainer>
                <LogoutContainer>
                <SmallButton title="로그아웃" containerStyle={{marginTop: 0}} 
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
                <MypageButton title='이용내역' name='list-alt'   
                    onPress={() => {
                        navigation.navigate("UseManage");
                }} />
                <MypageButton title='리뷰관리' name='thumb-up'   
                    onPress={() => {
                        navigation.navigate("ReviewManage",{ isUser: true });
                }}/>
                <MypageButton title='공고관리' name='description'
                    onPress={() => {
                        navigation.navigate("BidManageTab", { isUser: true });
                }}  />
            </IconContainer>
            <IconContainer>
                <MypageButton title='결제관리' name='payment'   
                    onPress={() => {
                        navigation.navigate("PayManage");
                }} /> 
                <MypageButton title='채팅관리' name='chat'  
                    onPress={() => {
                        navigation.navigate("ChatManage");
                }}/>
                <MypageButton title='즐겨찾기' name='star'  
                    onPress={() => {
                        navigation.navigate("Bookmark",{ isUser: true });
                }}/>
            </IconContainer>
        </Container>
    );
};

export default Mypage_User; 