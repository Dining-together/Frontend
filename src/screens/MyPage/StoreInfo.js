import React, {useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import { StyleSheet,Text, View, Alert, Modal, TouchableOpacity} from "react-native";
import {ProfileImage, InfoText,ToggleButton, SmallButton} from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import {UrlContext, ProgressContext, LoginConsumer, LoginContext} from "../../contexts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { removeWhitespace } from '../../utils/common';
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
const  StoreInfo = ({navigation}) => {
    const {url} = useContext(UrlContext);
    const {token, setSuccess} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);
    const [photo, setPhoto] = useState();
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const password = "?????????";
    const [isDocument, setIsDocument] = useState();
    // ???????????? ?????????
    const [isDialog, setIsDialog] = useState(false);
    const [pw, setPw] = useState('');
    // ????????????/?????? ?????????
    const [isPwModal, setIsPwModal] = useState(false);
    // ?????? ????????????
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
        // ?????? ????????????
        const willFocusSubscription = navigation.addListener('focus', () => {
            getApi(url+"/member/store");
        });
        return willFocusSubscription;
    }, []);
    // ?????? ?????? delete ??????
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
    // ?????? ?????? ??????
    const _onDelete = async() => {
        try{
            spinner.start();
            const result = await deleteApi(url+"/member/user");
            if(!result){
                alert("?????? ??????????????? ??????????????????.");
            }
            else{
                Alert.alert(
                    "", "???????????? ???????????????",
                    [{ text: "??????", onPress: () => {
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
    // ?????? ??????
    const _handleDeletePress = () => {
        Alert.alert(
            "", "?????? ?????????????????????????",
            [{ text: "??????",
            onPress: _onDelete },
            {
                text: "??????", style: "cancel"
            },
            ]
          );
    }
    // ???????????? ??????
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
       
            console.log(res)

            return res["success"];
        }catch (error) {
            console.error(error);
          }
    };

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}>
            <InfoChangeButton
                    onPress={() =>{navigation.navigate("StoreInfoChange",
                    { photo: photo, userName: userName, email: email });}}>
                    <InfoChangeText>??? ?????? ????????????</InfoChangeText>
                </InfoChangeButton>
                
                {/* ?????? ???????????? */}
                <ProfileImage url={photo}/>
                <InfoContainer>
                    <InfoText label="?????????" content={userName}/>
                    <InfoText label="?????????" content={email} />
                    <InfoText label="????????????" content={password} isPassword/>
                    <InfoText label="??????"
                     content={ isDocument ? "?????????" : "?????? ?????? ??????" }/>
                </InfoContainer>
                <View style={styles.hr}/>
                <SettingContainer>
                    <RowContainer>
                        <MaterialIcons name="settings" size={35}/>
                        <Text style={ styles.setting}>????????????</Text>
                    </RowContainer>
                    <SettingContainer>
                        <ToggleButton
                            label="?????? ????????????"
                            value={isNoticed}
                            onValueChange={() => setIsNoticed(previousState => !previousState)}/>
                    </SettingContainer>
                </SettingContainer>
                {/* ???????????? ?????? ?????? */}
                <InfoChangeButton
                    onPress={() =>{}}
                    >
                    <Text style={styles.delete} onPress={_handleDeletePress}>????????????</Text>
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
export default StoreInfo;