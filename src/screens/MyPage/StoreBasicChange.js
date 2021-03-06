import React, { useState,useEffect,useRef, useLayoutEffect, useContext } from 'react';
import styled from "styled-components/native";
import { Dimensions, Modal, View, StyleSheet,TouchableOpacity, Alert } from "react-native";
import { DateTimePicker, SmallButton, ManageText } from '../../components';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Postcode from '@actbase/react-daum-postcode';
import DropDownPicker from "react-native-dropdown-picker";
import * as Location from "expo-location";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    background-color: ${({ theme }) => theme.background};
    padding: 10px;
    flex:1;
`;

const InfoContainer = styled.View`
    background-color: ${({ theme }) => theme.background}; 
    margin: 15px;
    padding: 10px;
    border-radius: 6px;
    border: 0.7px solid black;
`;

const RowItemContainer = styled.View`
    padding: 5px 10px 15px;
    flex-direction: column;
    border-bottom-width: ${({ border }) => border ? border : 1}px;
    border-color: ${({ theme }) => theme.label};
    margin: 5px 0 5px 0;
`;

const TypeContainer = styled.View`
    position: absolute;
    height: 200px;
    left: 30px;
    bottom: 45px;
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

const DescTitle = styled.Text`
    font-size: ${({ size }) => size ? size : 19}px;
    font-weight: bold;
    color: ${({ theme }) => theme.text}; 
`;

const StoreImage = styled.Image`
    background-color:${({theme}) => theme.imageBackground};
    height: ${HEIGHT*0.12}px;
    width: ${HEIGHT*0.12}px;
`;

const ErrorText = styled.Text`
    position: absolute;
    align-self: flex-end;
    height: 20px;
    color: ${({ theme }) => theme.errorText};
    margin: 1% 1% 0 0;
`;
const TimeContainer = styled.TouchableOpacity`
    background-color: ${({theme})=> theme.background}
    align-items: flex-start;
    border-radius: 4px;
    width: 80%;
    padding: 15px 15px;
    border: 1px solid ${({ theme}) => theme.inputBorder};
    margin-top: 10px;
`;
const ButtonTitle = styled.Text`
  font-size: 16px;
  color: ${({theme})=> theme.inputPlaceholder}
`;

const StoreBasicChange = ({ navigation, route }) => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token, allow} = useContext(LoginContext);
    const [allowLoc, setAllowLoc] = useState(allow);

    // ?????? ????????????
    const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber);
    const [address, setAddress] = useState(route.params.address);
    const [ment, setMent] = useState(route.params.ment);

    const [openTime, setOpenTime] = useState(route.params.openTime);
    const [openTimeVisible, setOpenTimeVisible] = useState(false);

    const [closeTime, setCloseTime] = useState(route.params.closeTime);
    const [closeTimeVisible, setCloseTimeVisible] = useState(false);

    // ????????? ?????? ??????+?????? type
    const [openT, setOpenT] = useState(route.params.openT);
    const [closeT, setCloseT] = useState(route.params.closeT);
    const [lat, setLat] = useState(route.params.lat);
    const [lon, setLon] = useState(route.params.lon);
    const [isChanging, setIsChanging] = useState(false);
    const [changed, setChanged] = useState(false);

    const [opening, setOpening] = useState('');
    const [closing, setClosing] = useState('');

    // ?????? ?????????
    const [photos, setPhotos] = useState();

    // ?????? ????????? ???????????? ??????
    useEffect(() => {
        if (route.params.photos) {
            setPhotos(route.params.photos);
        }
      }, [route.params.photos, photos]);

      // ?????? ?????? ?????? ?????? ??? ?????? ?????? ????????? ??? 
      const _getLocPer = async () => {
        try{
            const {status} = await Location.requestForegroundPermissionsAsync();
            if(status === "granted"){
                setAllowLoc(true);
            };
        }catch (e) {
            console.log(e);
        };
      };

      useEffect(() => {
        setIsChanging(false);
      },[changed]);

    //?????? ???????????? 
    useEffect(() => {
        if(!allow){
            _getLocPer();
        }
    },[]);


    // ???????????? ???????????? 
    const [open, setOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(route.params.selectedType);
    const [storeType, setStoreType] = useState([
      {label: "??????", value: "KOREAN"},
      {label: "??????", value: "CHINESE"},
      {label: "??????", value: "JAPANESE"},
      {label: "??????", value: "WESTERN "},
      {label: "??????", value: "??????"},
    ]); 

    // ?????? ?????????
    const [isAddressModal, setIsAddressModal] = useState(false);

    // ?????????
    const [disabled, setDisabled] = useState(false)
    const [uploaded, setUploaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("????????? ??????????????????.");

    const didMountRef = useRef();


    // ?????? ?????? ????????????
    const _onPhotoPress = () => {
        navigation.navigate("MultipleImage", {type: "Store"});
    }


    const _getLL = async(address) => {
        Location.setGoogleApiKey("AIzaSyBPYCpA668yc46wX23TWIZpQQUj08AzWms");
        let res =  await Location.geocodeAsync(address);
        setLat(res[0].latitude);
        setLon(res[0].longitude);
        setChanged(!changed);
    };


    //?????? ????????? ?????? 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
            if (!phoneNumber) {
                _errorMessage = "?????? ??????????????? ???????????????.";
            } else if (!address) {
                _errorMessage = "????????? ???????????????.";
            } else if (!selectedType) {
                _errorMessage = "?????? ????????? ???????????????.";
            } else if (!photos) {
                _errorMessage = "?????? ????????? ???????????????.";
            } else if(!openTime) {
                _errorMessage = "??????????????? ???????????????.";
            } else if(!closeTime) {
                _errorMessage = "??????????????? ???????????????.";
            } else if(parseInt(closing)<parseInt(opening)){
                _errorMessage = "?????? ????????? ???????????? ???????????? ??????????????????."
              }
            else {
                _errorMessage = "";
            }
            setErrorMessage(_errorMessage);

        } else {
            didMountRef.current = true;
        }
    }, [phoneNumber, address, selectedType, photos, openTime, closeTime,opening, closing]);


    // ?????? ?????? ?????????
    useEffect(() => {
        setDisabled(!(phoneNumber && address && selectedType && photos && openTime && closeTime &&!errorMessage && !isChanging));
    }, [phoneNumber, address, selectedType, photos, openTime, closeTime, errorMessage, lat, lon, isChanging]);

    // ?????? ????????? ?????? ????????? ??????
    useEffect(()=> {
        var _open = openTime.slice(0,2)+openTime.slice(4,6);
        var _close = closeTime.slice(0,2)+closeTime.slice(4,6);
        setOpening(_open);
        setClosing(_close);
      },[openTime,closeTime]);

    // ?????? ?????? ?????? (disabled false??? ?????? ??????)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                disabled ? (<MaterialCommunityIcons name="check" size={35} onPress={_onBasicPress}
                    style={{ marginRight: 10, marginBottom: 3, opacity: 0.3 }} />)
                    : (<MaterialCommunityIcons name="check" size={35} onPress={() => _onBasicPress()}
                        style={{ marginRight: 10, marginBottom: 3, opacity: 1 }} />)
            )
        });
    }, [disabled, isChanging, lat, lon]);

    // ????????????
    const _handleOpenTimePress =() => {
        setOpenTimeVisible(true);
    };

    const _setOpenTime = time => {
        setOpenT(time);
        let h = time.getHours();
        let m = time.getMinutes();

        if(h < 10){
          h = "0"+h;
        }

        if(m< 10){
          m = "0"+m;
        }
        setOpenTime(h+"??? "+m+"???");
        setOpenTimeVisible(false);
    };

    const _hideOpenTimePicker = () => {
      setOpenTimeVisible(false);
    };

    // ?????? ??????
     const _handleCloseTimePress =() => {
        setCloseTimeVisible(true);
    };

    const _setCloseTime = time => {
        setCloseT(time);
        let h = time.getHours();
        let m = time.getMinutes();

        if(h < 10){
          h = "0"+h;
        }

        if(m< 10){
          m = "0"+m;
        }

        setCloseTime(h+"??? "+m+"???");
        setCloseTimeVisible(false);
    };

    const _hideCloseTimePicker = () => {
      setCloseTimeVisible(false);
    };

    const selectRegion = async(data) => {
        let ad = JSON.stringify(data.address).replace(/\"/g,'');
        setAddress(ad);
        setIsAddressModal(false);
        setIsChanging(true);
        await _getLL(ad);
    };

    // ???????????? ?????? 
    const _onBasicPress = async() => {
        setUploaded(true);
        if (!disabled) {
            // ????????? ??????
            try{
                spinner.start();
    
                var result = await postApi(url+"/member/store");
                var result_photo = await postImageApi();

                if(result && result_photo){
                    setErrorMessage("?????? ????????? ??????????????????");
                    setDisabled(true);
                    setUploaded(false);
                    navigation.navigate("StoreManage");
                }
                else{
                    alert("????????? ??????????????????.");
                }
    
            }catch(e){
                    console.log("Error", e.message);
            }finally{
                spinner.stop();
            }      
        }
    };

    // ???????????? post
    const postApi = async (url) => {

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
            body: JSON.stringify({ 
                addr: address,
                closedTime: closeT,
                latitude: lat,
                longitude: lon,
                openTime: openT,
                phoneNum: phoneNumber,
                storeType: selectedType,
                comment: ment,
                storeName: "",
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

    // ?????? ?????? ????????? post
    const postImageApi = async () => {
        let fixedUrl = url+'/member/store/images'; 

        let formData = new FormData();

        for (let i = 0; i < photos.length; i++) {
            let photo = photos[i];
            formData.append("files", {uri: photo.uri, name: photo.name, type: photo.type});
        }


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


    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}
            >
                
                {/* ?????? ???????????? */}
                <View style={{marginLeft: 10}}>
                    <DescTitle size={23}>?????? ????????????</DescTitle>
                </View>
                {uploaded && disabled && <ErrorText>{errorMessage}</ErrorText>}
                <InfoContainer>
                    <ManageText 
                        label="?????? ????????????"
                        value={phoneNumber!== "first"? phoneNumber: ""}
                        onChangeText={text => setPhoneNumber(text)}
                        placeholder="?????? ????????????"
                        keyboardType="number-pad"
                    />
                    <RowItemContainer>
                        <DescTitle>??????</DescTitle>
                        {address==="" ? null : (<DescTitle size={12} style={{color: "blue", marginTop: 5}}>?????? ????????? ?????? ??????????????????.</DescTitle>)}
                        <View style={styles.row}>
                            <StyledTextInput
                                width={80}
                                value={address}
                                placeholder="??????"
                                returnKeyType= "done"
                                editable={address === '' ? false : true}
                                onChangeText={text => setAddress(text)}
                            />
                            <SmallButton title="??????" containerStyle={{width: '20%', marginLeft:10, height: 50, marginTop: 10}}
                                onPress={() => {
                                    if(allowLoc){
                                        setIsAddressModal(true); 
                                        setAddress("");
                                    }else {
                                        Alert.alert("Location Permission Error","?????? ????????? ??????????????????.");
                                    }
                                    }}
                            />
                        </View>
                    <Modal visible={isAddressModal} transparent={true}>
                        <TouchableOpacity style={styles.background} onPress={() => setIsAddressModal(false)}/>
                        <View style={styles.modal}>
                            <Postcode
                                style={{  width: 350, height: 450 }}
                                jsOptions={{ animated: true, hideMapBtn: true }}
                                onSelected={data => selectRegion(data)}
                            />
                        </View>
                    </Modal>
                    </RowItemContainer>

                    <RowItemContainer>
                        <DescTitle>????????????</DescTitle>
                    <TimeContainer onPress={_handleOpenTimePress} >
                        <ButtonTitle>{openTime!=="Invalid date??? Invalid date???" ? openTime :"??????????????? ???????????????."}</ButtonTitle>
                    </TimeContainer>
                        <DateTimePicker visible={openTimeVisible} mode="time" 
                            handleConfirm={_setOpenTime} handleCancel={_hideOpenTimePicker}/>

                        <TimeContainer onPress={_handleCloseTimePress} >
                        <ButtonTitle>{closeTime!=="Invalid date??? Invalid date???" ? closeTime :"??????????????? ???????????????."}</ButtonTitle>
                    </TimeContainer>
                        <DateTimePicker visible={closeTimeVisible} mode="time" 
                            handleConfirm={_setCloseTime} handleCancel={_hideCloseTimePicker}/>

                    </RowItemContainer>
                    
                    
                    <ManageText 
                        label="????????? ??????"
                        value={ment}
                        onChangeText={text => setMent(text)}
                        placeholder="????????? ??????"
                    />   

                    <RowItemContainer>
                        <DescTitle>?????? ??????</DescTitle>
                        {!photos ? null : (<DescTitle size={12} style={{color: "blue", marginTop: 5}}>{photos.length}?????? ????????? ?????????????????????.</DescTitle>)}
                        <SmallButton 
                            title="????????????" 
                            containerStyle ={{width: '30%', marginTop: '3%'}}
                            onPress={_onPhotoPress}
                            uploaded={!photos ? false : true} 
                        />

                    </RowItemContainer>

                    <RowItemContainer>
                        <DescTitle>?????? ??????</DescTitle>
                        <View style={{height: HEIGHT*0.05}} />
                    </RowItemContainer>             
                </InfoContainer>
                <TypeContainer>
                        <DropDownPicker 
                                open={open}
                                value={selectedType}
                                items={storeType}
                                setOpen={setOpen}
                                setValue={setSelectedType}
                                setItems={setStoreType}
                                containerStyle={{width: WIDTH*0.43, alignSelf: "flex-start", marginTop: 10}}
                                placeholder="?????? ??????"
                                placeholderStyle={{color: theme.label, fontSize: 16}}
                                listMode="SCROLLVIEW"
                                maxHeight={150}
                            />  
                </TypeContainer>
                <View style={{height: 150}} />
            </KeyboardAwareScrollView>
        </Container>

    );
};

const styles = StyleSheet.create({
    modal: {
        marginHorizontal: 20,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: '25%',
        backgroundColor: 'white',
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

export default StoreBasicChange;