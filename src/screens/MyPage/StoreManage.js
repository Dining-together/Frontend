import React, { useState,useEffect, useContext } from 'react';
import styled from "styled-components/native";
import { Dimensions, Modal, View, StyleSheet,TouchableOpacity, Alert, FlatList} from "react-native";
import { Button, Image, ManageText, SmallButton } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";
import moment from 'moment';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

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

const ChangeContainer = styled.View`
    flex: 1; 
    alignItems: flex-end;
    justify-content: flex-end;
    margin-bottom: 5px;
    flex-direction: row;
`;

const ChangeText = styled.Text`
    font-weight: bold;
    font-size: 16px;
    color: ${({theme})=> theme.titleColor};
    margin-right: 5px;
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

const MenuContainer = styled.View`
    background-color: ${({ theme }) => theme.background}; 
    flex-direction: column;
    margin : 10% 10px 0 10px;
    border-radius: 10px;
    border: 1px solid black;
    padding: 15px;
`;

const Label = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.text}
    align-self: flex-start;
    margin-top: 3%;
`;

const ButtonContainer = styled.View`
    margin-top: 3%;
    flex-direction: row;
    justify-content: center;
`;

const StoreImage = styled.Image`
    background-color:${({theme}) => theme.imageBackground};
    height: ${HEIGHT*0.2}px;
    width: ${HEIGHT*0.35}px;
    margin-top: 2%;
`;


const StoreManage = ({ navigation }) => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token, doc, id} = useContext(LoginContext);


    // ?????? ????????????
    const [phoneNumber, setPhoneNumber] = useState("first");
    const [address, setAddress] = useState("");
    const [storeType, setStoreType] = useState("");
    const [openTime, setOpeningTime] = useState('');
    const [closeTime, setClosingTime] = useState('');
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [ment, setMent] = useState("");
    const [storeImages, setStoreImages] = useState([]);

    // ?????? ?????? ?????????
    const [menus, setMenus] = useState([]);
    
    //?????? ????????????
    const [personNumber, setPersonNumber] = useState("");
    const [isParking, setIsParking] = useState("");
    const [parkingNumber, setParkingNumber] = useState("");

    // ????????????
    const [facilityEtcs, setFacilityEtcs] = useState([]);
    const [room, setRoom] = useState(false); // ???
    const [groupseat, setGroupseat] = useState(false); // ?????????
    const [sedentary, setSedentary ] = useState(false); // ??????
    const [internet, setInternet] = useState(false); // ???????????????
    const [highchair, setHighchair] = useState(false); // ????????? ??????
    const [handicap, setHandicap] = useState(false); // ????????? ????????????
    const [pet, setPet] = useState(false); // ????????????

    // ?????? ?????? ??????
    const [menuDisalbed, setMenuDisalbed] = useState(true);

    // ????????????/?????? ?????????
    const [isMenuModal, setIsMenuModal] = useState(false);

    // ?????? ???????????? ?????? 
    const _onBasicPress = () => {
        navigation.navigate("StoreBasicChange",
        { phoneNumber: phoneNumber, address: address, storeType: storeType, 
            openTime: setTime(openTime), closeTime: setTime(closeTime), selectedType: storeType,
            openT: openTime, closeT: closeTime, lat: lat, lon: lon, ment: ment});
    };

    // ?????? ???????????? ?????? 
    const _onConveniencePress = () => {
        navigation.navigate("StoreConvChange", 
        { personNumber: personNumber, isParking: isParking, parkingNumber: parkingNumber, 
            facilityEtcs : facilityEtcs, room: room, groupseat: groupseat, sedentary : sedentary,
            internet: internet, highchair: highchair, handicap: handicap, pet: pet});
    };

    // ?????? ???????????? ???????????? ????????????
    useEffect(() => {
        if(!doc){
            Alert.alert(
                "", "?????? ????????? ????????????",
                [{ text: "??????", 
                onPress: () => {navigation.navigate("Mypage_Store")} }]
              );
        }
    } ,[]);


    // ????????? ???????????? ?????? ?????? ?????? ~
    useEffect(() => {
        infoGet();
        menuGet();
        // ?????? ????????????(navigation ?????? ??? ???????????? ??? ????????????)
        const willFocusSubscription = navigation.addListener('focus', () => {
            infoGet();
            menuGet();
        });

        return willFocusSubscription;
        
    }, []);


    // ?????? get ??????
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
            return res;

          } catch (error) {
            console.error(error);
          } finally {
              spinner.stop();
          }
    }

    // ?????? ????????? ????????????
    const infoGet = async () => {
        let fixedUrl =url+'/member/store/'+`${id}`;

        try{
            spinner.start();
            const res =  await getApi(fixedUrl);

            if(res.success){
                // ???????????? ????????????????????? ??? ??????
                if(res.data.phoneNum != null){
                    setPhoneNumber(res.data.phoneNum);
                    setAddress(res.data.addr);
                    setStoreType(res.data.storeType);
                    setOpeningTime(res.data.openTime);
                    setClosingTime(res.data.closedTime);
                    setLat(res.data.latitude);
                    setLon(res.data.longitude);
                    setMent(res.data.comment);
                    setStoreImages(res.data.storeImages);
                }
                // ???????????? ????????????????????? ??? ??????
                if(res.data.facility != null){
                    setPersonNumber(res.data.facility.capacity);
                    setIsParking(res.data.facility.parking);
                    setParkingNumber(res.data.facility.parkingCount);
                    setFacilityEtcs(res.data.facility.facilityEtcs);
                    _changeFac(res.data.facility.facilityEtcs);
                }
                
                useEffect(()=> {
                    spinner.stop();
                },[setStoreImages]);
            }
        }catch(e){
                console.log("Error", e.message);
        }
    }

    // ?????? ????????????(menus ??????)
    const menuGet = async() => {
        let fixedUrl = url+'/member/'+`${id}`+'/menus';
        
        try{
            spinner.start();
            const res =  await getApi(fixedUrl);

            if(res.success){
                setMenus(res.list);
            }

            useEffect(()=>{
                spinner.stop()
            },[menus]);

        }catch(e){
                console.log("Error", e.message);
        }
              
    };

    // ?????? ???????????? input
    const [inputs, setInputs] = useState([]);
    const [photo, setPhoto] = useState();

    const { name, price, description } = inputs;

    // input ???????????????
    const handleChange = (event) => {
        // input??? ??????
        const { name, text } = event;

        setInputs({
            ...inputs,
            [name]: text
          });
    }

    // ?????? ?????? ?????? disabled
    useEffect(() => {
        setMenuDisalbed(            
            !(name && price && description && photo )
        );
    }, [name, price, description, photo]);

    // ?????? ?????? ?????? ????????????
    const _onMenuPress = async() => {
        try{
            spinner.start();

            const result = await postApi();

            if(result){
                setInputs({
                    name: '', 
                    price: '', 
                    description: '', 
                });
                setPhoto('');
                setIsMenuModal(false);
                menuGet();
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

    // ?????? ?????? ???????????? ????????? ???
    const _onMenuCancel = () => {
        setIsMenuModal(false);
        setInputs({
            name: '', 
            price: '', 
            description: '', 
        });
        setPhoto('');
    }


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

    // ?????? ?????? ????????? ???????????? ??? delete ?????? ??????
    const _onDelete = async(id) => {
        try{
            spinner.start();

            const result = await deleteApi(url+"/member/menus/"+`${id}`);

            if(!result){
                alert("?????? ????????? ??????????????????.");
            }
            else{
                alert("????????? ?????????????????????.");
                menuGet();
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    // ?????? ?????? ?????? ????????? ??? 
    const _onMenuDelete = id => {
        Alert.alert(
            "", "?????????????????????????",
            [{ text: "??????", 
            onPress: () => {_onDelete(id)} },
            {
                text: "??????", style: "cancel"
            },
            ]
          );
    }

    // ?????? ?????? post (?????? ????????? + ??????)
    const postApi = async () => {
        let fixedUrl = url+'/member/menus?description='
        +`${description}`+'&name='+`${name}`+'&price='+`${parseInt(price)}`; 

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
            console.log(res);
            return res["success"];
            
            
          } catch (error) {
            console.error(error);
          }

    }

    // ???????????? ?????? type ??????
    const setTime = (time) => {
        const moment = require('moment');
        
        let h = moment(time).format('HH');
        let m = moment(time).format('mm');


        return (h+"??? "+m+"???");
    };

    // ???????????? ????????? ??????
    const _changeType = (type) => {
        let text;

        switch(type){
            case "KOREAN":
                text = "??????"; break;
            case "CHINESE":
                text = "??????"; break;
            case "JAPANESE":
                text = "??????"; break;
            case "WESTERN":
                text = "??????"; break;
        }
        return text;
    }

    // ???????????? ??????
    const _changeFac = list => {
        for(let i = 0; i< list.length; i++){
            let fac = list[i];
            switch (fac.facilityType){
                case "ROOM":
                    setRoom(true); break;
                case "GROUPSEAT":
                    setGroupseat(true); break;
                case "SEDENTARY":
                    setSedentary(true); break;
                case "INTERNET":
                    setInternet(true); break;
                case "HIGHCHAIR":
                    setHighchair(true); break;
                case "HANDICAP":
                    setHandicap(true); break;
                case "PET":
                    setPet(true); break;
            }
        }
    }

    const _setList = () => {
        let list = [];
        if(room) {list.push("???")};
        if(groupseat) {list.push("?????????")}
        if(sedentary) {list.push("??????")}
        if(internet) {list.push("?????? ?????????")}
        if(highchair) {list.push("????????? ??????")}
        if(handicap) {list.push("????????? ????????????")}
        if(pet) {list.push("????????????")}
        var listStr = list.join(", ");
        
        
        return listStr; 
    };

    return (
        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}
            >
                {phoneNumber!=="" && (
                    <>
                <View style={{marginLeft: 10}}>
                    <DescTitle size={23}>?????? ????????????</DescTitle>
                    <DescTitle size={12}>(?????? ????????? ??????????????? ?????? ?????? ???????????? ???????????????.)</DescTitle>
                </View>
                <InfoContainer>
                    <ManageText 
                        label="?????? ????????????"
                        TextChange
                        onChangePress={_onBasicPress}
                        value={phoneNumber!== "first"? phoneNumber: ""}
                        editable={false}
                    />
                    <ManageText 
                        label="??????"
                        value={address}
                        editable={false}
                    />
                    <ManageText 
                        label="????????????"
                        value={openTime !== '' ? setTime(openTime)+" ~ "+setTime(closeTime) : ""}
                        editable={false}
                    />
                    <ManageText 
                        label="????????? ??????"
                        value={ment}
                        editable={false}
                    />
                    <RowItemContainer>
                        <DescTitle>?????? ??????</DescTitle>
                        {storeImages.reverse().map( item => 
                            <StoreImage source={{uri : item.path}} key = {item.id}/>
                        )}
                    </RowItemContainer>
                    <ManageText 
                        label="????????????"
                        value={_changeType(storeType)}
                        editable={false}
                    />
                </InfoContainer>

                {/* ?????? ???????????? */}
                <View style={{marginLeft: 10}}>
                    <DescTitle size={23}>?????? ????????????</DescTitle>
                </View>

                <InfoContainer>
                    <View style={styles.row}>
                        <ChangeContainer>
                            <ChangeText onPress={() => {setIsMenuModal(true);}}>?????? ??????</ChangeText>
                        </ChangeContainer> 
                    </View>
                    <Modal visible={isMenuModal} transparent={true}>
                        <TouchableOpacity style={styles.background} onPress={() => setIsMenuModal(false)} />
                        <KeyboardAwareScrollView
                extraScrollHeight={20}
            >
                        <MenuContainer>
                            <ManageText 
                                name="name"
                                value={name}
                                label="?????? ??????"
                                placeholder="?????? ??????"
                                onChange={handleChange}
                            />
                            <ManageText
                                name="price"
                                label="??????"
                                placeholder="??????"
                                keyboardType="number-pad"
                                value={price}
                                onChange={handleChange}
                            />
                            <ManageText 
                                name="description"
                                label="??????"
                                placeholder="??????"
                                multiline={true}
                                value={description}
                                onChange={handleChange}
                            />
                            <RowItemContainer>
                                <DescTitle>?????? ??????</DescTitle>
                                <Image title="?????? ??????"
                                    url={photo}
                                    onChangeImage={url => setPhoto(url)}
                                    containerStyle={{ width: '70%', marginTop: '3%'}}
                            />
                            </RowItemContainer>
                            <ButtonContainer>
                                <Button title="??????" onPress={_onMenuCancel} containerStyle={{ width: '40%', marginRight: 10}}/>
                                <Button title="??????" onPress={_onMenuPress} containerStyle={{ width: '40%' }} disabled={menuDisalbed}/>
                            </ButtonContainer>
                        </MenuContainer>
                        </KeyboardAwareScrollView>
                    </Modal>
                    
                    {menus.map(item => (
                        
                        <RowItemContainer key={item.menuId}>
                            <StoreImage source={{uri : item.path}}/>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%'}}>
                                <Label>?????? : {item.name}</Label>
                                <Label>?????? : {item.price}???</Label>
                                <SmallButton title="??????" onPress={() => {_onMenuDelete(item.menuId);}} containerStyle={{ width: '20%', }}/>
                            </View>
                            <Label>?????? : {item.description}</Label>
                        </RowItemContainer>
                    ))} 

                </InfoContainer>
                
                {/* ?????? ???????????? */}
                <View style={{marginLeft: 10}}>
                    <DescTitle size={23}>?????? ????????????</DescTitle>
                </View>

                <InfoContainer>
                    <ManageText 
                        label="????????????"
                        TextChange
                        onChangePress={_onConveniencePress}
                        isText
                        text={personNumber ? personNumber+"???" : ""}
                    />
                    <ManageText 
                        label="??????"
                        isText
                        text={isParking ? parkingNumber+"??? ??????" : "??????" }
                    />
                    
                    {/* ???????????? list??? ????????? ?????? ??????.. */}
                    <ManageText 
                        label="????????????"
                        isText
                        text={_setList()}
                    />
                    
                </InfoContainer></>
                )}
            </KeyboardAwareScrollView>
        </Container>

    );
};

const styles = StyleSheet.create({
    modal: {
        marginHorizontal: 20,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: '50%',
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

export default StoreManage;