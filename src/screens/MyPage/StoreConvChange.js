import React, { useState,useEffect,useContext, useLayoutEffect, useRef } from 'react';
import styled from "styled-components/native";
import { Dimensions, View, StyleSheet } from "react-native";
import { ManageText,ToggleButton } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";

const HEIGHT = Dimensions.get("screen").width;

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 10px;
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

const DescTitle = styled.Text`
    font-size: ${({ size }) => size ? size : 19}px;
    font-weight: bold;
    color: ${({ theme }) => theme.text}; 
`;

const ToggleContainer = styled.View`
    flex: 1; 
    align-items: flex-end;
    justify-content: flex-end;
    align-self: flex-end;
    margin-bottom: 5px;
    flex-direction: row;
    width: 22%;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-top: 10px;
`;

const ButtonBox = styled.TouchableOpacity`
    background-color: ${({theme, checked})=> checked? theme.titleColor :theme.storeButton};
    width: ${({width})=> width? width : 30}%;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    height: ${HEIGHT*0.075}
`;

const ButtonText = styled.Text`
    font-size: 15px;
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
      width: ${({ width }) => width ? width : 85}%;
      background-color: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};
      padding: 10px 15px;
      font-size: 16px;
      border: 1px solid ${({ theme }) => theme.inputBorder};
      border-radius: 4px;
      margin-top: 10px;
  `;

  const ErrorText = styled.Text`
    position: absolute;
    align-self: flex-end;
    height: 20px;
    color: ${({ theme }) => theme.errorText};
    margin: 1% 1% 0 0;
`;


const StoreConvChange = ({ navigation, route }) => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token, allow} = useContext(LoginContext);

    //?????? ????????????
    const [personNumber, setPersonNumber] = useState((route.params.personNumber !== "") ? String(route.params.personNumber) : null);
    const [isParking, setIsParking] = useState((route.params.isParking !== "")? route.params.isParking :false);
    const [parkingNumber, setParkingNumber] = useState((route.params.parkingNumber !== "")? String(route.params.parkingNumber) : 0);

    // ????????????
    const [facilityEtcs, setFacilityEtcs] = useState(route.params.facilityEtcs);
    const [room, setRoom] = useState(route.params.room); // ???
    const [groupseat, setGroupseat] = useState(route.params.groupseat); // ?????????
    const [sedentary, setSedentary ] = useState(route.params.sedentary); // ??????
    const [internet, setInternet] = useState(route.params.internet); // ???????????????
    const [highchair, setHighchair] = useState(route.params.highchair); // ????????? ??????
    const [handicap, setHandicap] = useState(route.params.handicap); // ????????? ????????????
    const [pet, setPet] = useState(route.params.pet); // ????????????
    const [changed, setChanged] = useState(false);
    const [func, setFunc] = useState([]);
    // ?????????
    const [disabled, setDisabled] = useState(false)
    const [uploaded, setUploaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [buttonPress, setButtonPress] = useState(false);

    const didMountRef = useRef();

        // ???????????? facilityEtcs ?????? (????????? ????????? ??????)
        const _setList = () => {
            let facList = [];
            if(room) {facList.push("ROOM");}
            if(groupseat) {facList.push("GROUPSEAT");}
            if(sedentary) {facList.push("SEDENTARY");}
            if(internet) {facList.push("INTERNET");}
            if(highchair) {facList.push("HIGHCHAIR");}
            if(handicap) {facList.push("HANDICAP");}
            if(pet) {facList.push("PET");}
            
            return facList;
        }


    useEffect(()=> {
        setChanged(!changed);
    },[room, groupseat, sedentary, internet, highchair, handicap, pet]);

    useEffect(()=> {
        setFunc(_setList());
    },[changed]);


    //?????? ????????? ?????? 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
            if (!personNumber) {
                _errorMessage = "??????????????? ???????????????.";
            } 
            else if(isParking){
                if(!parkingNumber){
                    _errorMessage = "?????? ???????????? ???????????????.";
                }
            }
            else {
                _errorMessage = "";
            }
            setErrorMessage(_errorMessage);

        } else {
            didMountRef.current = true;
        }
    }, [personNumber, isParking, parkingNumber]);

    // ?????? ?????? ?????????
    useEffect(() => {
        setDisabled(!(personNumber &&!errorMessage));
    }, [personNumber,  errorMessage]);


    // ?????? ?????? ?????? (disabled false??? ?????? ??????)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                disabled ? (<MaterialCommunityIcons name="check" size={35} onPress={_onConvPress}
                    style={{ marginRight: 10, marginBottom: 3, opacity: 0.3 }} />)
                    : (<MaterialCommunityIcons name="check" size={35} onPress={_buttonPress}
                        style={{ marginRight: 10, marginBottom: 3, opacity: 1 }} />)
            )
        });
    }, [disabled, func]);

    const _buttonPress = () => {
        setButtonPress(true);
    }

    useEffect(() => {
        if (buttonPress) {
            _onConvPress();
        }
      },[buttonPress]);

    // ?????? ?????? ??????
    const postApi = async () => {
        let fixedUrl = url+'/member/store/facility'; 

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
            body: JSON.stringify({ 
                capacity: personNumber,
                facilityTypes: func,
                parking: isParking,
                parkingCount: parkingNumber,
                 
            }),
        };
        try {
        
            let response = await fetch(fixedUrl,options);
            let res = await response.json();
    

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // ???????????? ??????
    const _onConvPress = async() => {
        setUploaded(true);
        if (!disabled) {
            // ????????? ??????
            try{
                spinner.start();

                const result = await postApi();

                if(result){
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
                        label="????????????"
                        value={personNumber}
                        onChangeText={text => setPersonNumber(text)}
                        placeholder="????????????"
                        keyboardType="number-pad"
                    />
                    {/* ?????? */}
                    <RowItemContainer>
                        <DescTitle>??????</DescTitle>
                        <ToggleContainer>
                            <ToggleButton
                                label="??????"
                                value={isParking}
                                onValueChange={() => {
                                    setIsParking(previousState => !previousState); 
                                    if(!isParking){setParkingNumber("")}}}/>
                        </ToggleContainer>
                        { isParking &&
                            <StyledTextInput 
                                value={parkingNumber}
                                onChangeText={text => setParkingNumber(text)}
                                placeholder="?????? ?????????"
                                keyboardType="number-pad"
                        />}
                    </RowItemContainer>

                    {/* ???????????? */}
                    <RowItemContainer>
                        <DescTitle>????????????</DescTitle>
                        <ButtonContainer> 
                        <ButtonBox onPress={() =>{setRoom(!room)}} checked={room} width={15}>
                            <ButtonText>???</ButtonText>
                        </ButtonBox>
                        <ButtonBox onPress={() =>{setGroupseat(!groupseat)}} checked={groupseat} width={25}>
                            <ButtonText>?????????</ButtonText>
                        </ButtonBox>
                        <ButtonBox onPress={() =>{setSedentary(!sedentary)}} checked={sedentary} width={20}>
                            <ButtonText>??????</ButtonText>
                        </ButtonBox>  
                        <ButtonBox onPress={() =>{setInternet(!internet)}} checked={internet}>
                            <ButtonText>???????????????</ButtonText>
                        </ButtonBox>
                        </ButtonContainer>
                        <ButtonContainer>
                        <ButtonBox onPress={() =>{setHighchair(!highchair)}} checked={highchair}>
                            <ButtonText>????????? ??????</ButtonText>
                        </ButtonBox>

                        <ButtonBox onPress={() =>{setHandicap(!handicap)}} checked={handicap} width={40}>
                            <ButtonText>????????? ????????????</ButtonText>
                        </ButtonBox>
                        <ButtonBox onPress={() =>{setPet(!pet)}} checked={pet} width={25}>
                            <ButtonText>????????????</ButtonText>
                        </ButtonBox>
                        </ButtonContainer>
                    </RowItemContainer>


                </InfoContainer>
            </KeyboardAwareScrollView>
        </Container>

    );
};

const styles = StyleSheet.create({
      row: {
        flexDirection:'row',
        marginRight: '50%'
      }
});

export default StoreConvChange;