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

    //??????
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

    //?????? ????????? ?????? 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
            if (!userName) {
                _errorMessage = "???????????? ???????????????.";
            } else if (!password) {
                _errorMessage = "??????????????? ???????????????.";
            } else if (!validatePassword(password)) {
                _errorMessage = "???????????? ????????? ???????????????.";
            } else if (!age) {
                _errorMessage = "????????? ???????????????.";
            }else if (!addr) {
                _errorMessage = "????????? ??????????????????.";
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

    // ?????? ?????????
    useEffect(() => {
        setDisabled(            
            !(userName && password &&  !errorMessage && validatePassword(password) && age && addr && !isChanging )
        );
        
    }, [userName, password, errorMessage, age, addr, isChanging]);

    

    // ?????? put ?????? (?????? ?????? ??????)
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
          

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // ?????? ????????? ??????
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
    
   
    // ?????? ??????
    
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
                    alert("????????? ??????????????????.");
                }
            }
            else{
                if(result){
                    navigation.pop();
                }
                else{
                    alert("????????? ??????????????????.");
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
                        label="?????????"
                        value={userName}
                        onChangeText={ text => setuserName(text)}
                        placeholder="?????????"
                        returnKeyType= "done"
                        isChanged
                        title="??????"
                    />
                    <InfoText label="?????????" content={email}/>
                    <InfoText
                        label="????????????"
                        value={password}
                        onChangeText={ text => setPassword(removeWhitespace(text))}
                        placeholder="??????, ??????, ?????? ?????? 8???-16???"
                        returnKeyType= "done"
                        isChanged
                        isPassword
                        title="??????"
                        disabled={validatePassword(password) ? false : true}                 
                        />

                    <InfoText
                        label="??????"
                        value={String(age)}
                        onChangeText={ text => setAge(text)}
                        placeholder="??????"
                        returnKeyType= "done"
                        isChanged
                        keyboardType="number-pad"
                        />
                        <RowContainer>
                            
                            <RadioTitle>??????</RadioTitle>
                            <RadioButton 
                                label="??????"
                                status={(gender==="female"? "checked" : "unchecked")}
                                containerStyle={{marginBottom:0, marginLeft: 0, marginRight: 0}}
                                onPress={() => setGender('female')}
                            />
                            <RadioButton 
                                label="??????"
                                status={(gender==="male"? "checked" : "unchecked")}
                                containerStyle={{marginBottom:0, marginLeft: 0, marginRight: 0}}
                                onPress={() => setGender('male')}
                            />
                    </RowContainer>
                        
                <InfoText
                        label="??????"
                        value= {addr}
                        placeholder="????????? ???????????? ???????????????."
                        onChangeText={(text) => setAddr(text)}
                        returnKeyType= "done"
                        isChanged
                        editable={true}
                        showButton
                        title="??????"
                        onPress={() => { 
                            if(allowLoc){
                                setIsAddressModal(true); 
                                setAddr("");
                            }else {
                                Alert.alert("Location Permission Error","?????? ????????? ??????????????????.");
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
                    {/* ???????????? ?????? ?????? */}
                    <Button 
                    containerStyle={{width:'50%', }}
                    title="??????"
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