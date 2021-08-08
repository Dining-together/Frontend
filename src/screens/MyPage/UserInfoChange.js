import React, {useState, useEffect, useRef, useContext} from 'react';
import styled from "styled-components/native";
import {View, Dimensions, StyleSheet, TouchableOpacity, Alert, Modal} from "react-native";
import {ProfileImage, InfoText, Button, RadioButton} from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { removeWhitespace, validatePassword } from '../../utils/common';
import * as Location from "expo-location";
import Postcode from '@actbase/react-daum-postcode';
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";


const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

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

const MapContainer = styled.View`
    justify-content: center;
    align-items: center;
`;

const CurrentButton = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    position: absolute;
    top: 10px;
    right: 13%;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    border-width: 1px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-top: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;



const  UserInfoChange = ({navigation, route}) => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token, allow, setAllow} = useContext(LoginContext);

    const [photo, setPhoto] = useState(route.params.photo);
    const [userName, setuserName] = useState(route.params.userName);
    const email = route.params.email;
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(route.params.age);
    const [gender, setGender] = useState(route.params.gender);

    const [errorMessage, setErrorMessage] = useState("");
    const [disabled, setDisabled] = useState(true);

    const didMountRef = useRef();

    //주소
    const [addr, setAddr] = useState(route.params.addr);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [allowLoc, setAllowLoc] = useState(allow);
    const [isAddressModal, setIsAddressModal] = useState(false);
    const [isChanging, setIsChanging] = useState(false);


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
        if(!allow){
            _getLocPer();
        }
    },[]);  

    //에러 메세지 설정 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
            if (!userName) {
                _errorMessage = "닉네임을 입력하세요.";
            } else if (!password) {
                _errorMessage = "비밀번호를 입력하세요.";
            } else if (!validatePassword(password)) {
                _errorMessage = "비밀번호 조건을 확인하세요.";
            } else if (!age) {
                _errorMessage = "나이를 입력하세요.";
            }else if (!addr) {
                _errorMessage = "지역을 입력해주세요.";
            }
            else {
                setDisabled(false);
                _errorMessage = "";
            }
            setErrorMessage(_errorMessage);

        } else {
            didMountRef.current = true;
        }
    }, [userName, password, age, addr]);

    // 버튼 활성화
    useEffect(() => {
        setDisabled(            
            !(userName && password &&  !errorMessage && validatePassword(password) && age && addr && !isChanging )
        );
        
    }, [userName, password, errorMessage, age, addr, isChanging]);

    

    // 서버 put 처리 (회원 정보 수정)
    const putApi = async (url) => {

        console.log(url);

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
                age: parseInt(age),
                gender: gender,
                addr: addr,
                latitude: lat,
                longitude: lon,
                
            }),
           
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();
            console.log(res);

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

            console.log(formData);
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

                console.log(res);
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
            const result = await putApi(url+"/member/customer");
            const result_photo = await postApi();

            if(photo != null && photo != route.params.photo){
                if(result && result_photo){
                    navigation.navigate("UserInfo");
                }
                else{
                    alert("저장에 실패했습니다.");
                }
            }
            else{
                if(result){
                    navigation.pop();
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
  
    useEffect(() => {
        if(!allow){
            const result = getLocation();
        }
    }, []);


    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>

                <View style={{marginTop: 30}} ></View>

               <ProfileImage 
                url={photo}
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
                        title="적용"
                    />
                    <InfoText label="이메일" content={email}/>
                    <InfoText
                        label="비밀번호"
                        value={password}
                        onChangeText={ text => setPassword(removeWhitespace(text))}
                        placeholder="특문, 숫자, 영문 포함 8자-16자"
                        returnKeyType= "done"
                        isChanged
                        isPassword
                        title="변경"
                        disabled={validatePassword(password) ? false : true}                 
                        />

                    <InfoText
                        label="나이"
                        value={String(age)}
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
                        
                <InfoText
                        label="주소"
                        value= {addr}
                        placeholder="지역이 선택되지 않았습니다."
                        onChangeText={(text) => setAddr(text)}
                        returnKeyType= "done"
                        isChanged
                        editable={true}
                        showButton
                        title="검색"
                        onPress={() => { 
                            if(allowLoc){
                                setIsAddressModal(true); 
                                setAddr("");
                            }else {
                                Alert.alert("Location Permission Error","위치 정보를 허용해주세요.");
                            }
                            }}
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
                </InfoContainer>
                

                <InfoContainer>
                    <ErrorText>{errorMessage}</ErrorText>
                </InfoContainer>
                
                <CenterContainer>
                    {/* 변경사항 서버 저장 */}
                    <Button 
                    containerStyle={{width:'50%', }}
                    title="저장"
                    disabled={disabled}
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