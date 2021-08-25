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


    // 업체 기본정보
    const [phoneNumber, setPhoneNumber] = useState("first");
    const [address, setAddress] = useState("");
    const [storeType, setStoreType] = useState("");
    const [openTime, setOpeningTime] = useState('');
    const [closeTime, setClosingTime] = useState('');
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [ment, setMent] = useState("");
    const [storeImages, setStoreImages] = useState([]);

    // 업체 메뉴 리스트
    const [menus, setMenus] = useState([]);
    
    //업체 편의정보
    const [personNumber, setPersonNumber] = useState("");
    const [isParking, setIsParking] = useState("");
    const [parkingNumber, setParkingNumber] = useState("");

    // 기타시설
    const [facilityEtcs, setFacilityEtcs] = useState([]);
    const [room, setRoom] = useState(false); // 룸
    const [groupseat, setGroupseat] = useState(false); // 단체석
    const [sedentary, setSedentary ] = useState(false); // 좌식
    const [internet, setInternet] = useState(false); // 무선인터넷
    const [highchair, setHighchair] = useState(false); // 유아용 의자
    const [handicap, setHandicap] = useState(false); // 장애인 편의시설
    const [pet, setPet] = useState(false); // 반려동물

    // 메뉴 에러 검사
    const [menuDisalbed, setMenuDisalbed] = useState(true);

    // 메뉴추가/수정 팝업창
    const [isMenuModal, setIsMenuModal] = useState(false);

    // 업체 기본정보 수정 
    const _onBasicPress = () => {
        navigation.navigate("StoreBasicChange",
        { phoneNumber: phoneNumber, address: address, storeType: storeType, 
            openTime: setTime(openTime), closeTime: setTime(closeTime), selectedType: storeType,
            openT: openTime, closeT: closeTime, lat: lat, lon: lon, ment: ment});
    };

    // 업체 편의정보 수정 
    const _onConveniencePress = () => {
        navigation.navigate("StoreConvChange", 
        { personNumber: personNumber, isParking: isParking, parkingNumber: parkingNumber, 
            facilityEtcs : facilityEtcs, room: room, groupseat: groupseat, sedentary : sedentary,
            internet: internet, highchair: highchair, handicap: handicap, pet: pet});
    };

    // 서류 등록되지 않았으면 못들어옴
    useEffect(() => {
        if(!doc){
            Alert.alert(
                "", "서류 등록을 해주세요",
                [{ text: "확인", 
                onPress: () => {navigation.navigate("Mypage_Store")} }]
              );
        }
    } ,[]);


    // 정보들 불러오기 화면 초기 설정 ~
    useEffect(() => {
        infoGet();
        menuGet();
        // 화면 새로고침(navigation 이동 후 돌아왔을 때 새로고침)
        const willFocusSubscription = navigation.addListener('focus', () => {
            infoGet();
            menuGet();
        });

        return willFocusSubscription;
        
    }, []);

    // 서버 get 처리
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

    // 업체 정보들 불러오기
    const infoGet = async () => {
        let fixedUrl =url+'/member/store/'+`${id}`;

        try{
            spinner.start();
            const res =  await getApi(fixedUrl);

            if(res.success){
                // 기본정보 등록되어있으면 값 바꿈
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
                // 편의정보 등록되어있으면 값 바꿈
                if(res.data.facility != null){
                    setPersonNumber(res.data.facility.capacity);
                    setIsParking(res.data.facility.parking);
                    setParkingNumber(res.data.facility.parkingCount);
                    setFacilityEtcs(res.data.facility.facilityEtcs);
                    _changeFac(res.data.facility.facilityEtcs);
                }
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    // 메뉴 불러오기(menus 설정)
    const menuGet = async() => {
        let fixedUrl = url+'/member/'+`${id}`+'/menus';
        
        try{
            spinner.start();
            const res =  await getApi(fixedUrl);

            if(res.success){
                setMenus(res.list);
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
              
    };

    // 업체 메뉴정보 input
    const [inputs, setInputs] = useState([]);
    const [photo, setPhoto] = useState();

    const { name, price, description } = inputs;

    // input 이벤트처리
    const handleChange = (event) => {
        // input의 속성
        const { name, text } = event;

        setInputs({
            ...inputs,
            [name]: text
          });
    }

    // 메뉴 등록 버튼 disabled
    useEffect(() => {
        setMenuDisalbed(            
            !(name && price && description && photo )
        );
    }, [name, price, description, photo]);

    // 메뉴 등록 버튼 눌렀을때
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
                alert("저장에 실패했습니다.");
            }
    
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    // 메뉴 등록 취소버튼 눌렀을 때
    const _onMenuCancel = () => {
        setIsMenuModal(false);
        setInputs({
            name: '', 
            price: '', 
            description: '', 
        });
        setPhoto('');
    }


    // 메뉴 삭제 delete 처리
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

    // 메뉴 삭제 한다고 수락했을 때 delete 처리 시도
    const _onDelete = async(id) => {
        try{
            spinner.start();

            const result = await deleteApi(url+"/member/menus/"+`${id}`);

            if(!result){
                alert("다시 메뉴를 삭제해주세요.");
            }
            else{
                alert("메뉴가 삭제되었습니다.");
                menuGet();
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    // 메뉴 삭제 버튼 눌렀을 때 
    const _onMenuDelete = id => {
        Alert.alert(
            "", "삭제하시겠습니까?",
            [{ text: "확인", 
            onPress: () => {_onDelete(id)} },
            {
                text: "취소", style: "cancel"
            },
            ]
          );
    }

    // 메뉴 등록 post (메뉴 설명들 + 사진)
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

            return res["success"];
            
            
          } catch (error) {
            console.error(error);
          }

    }

    // 영업시간 시간 type 변경
    const setTime = (time) => {
        const moment = require('moment');
        
        let h = moment(time).format('HH');
        let m = moment(time).format('mm');


        return (h+"시 "+m+"분");
    };

    // 업체유형 한글로 변환
    const _changeType = (type) => {
        let text;

        switch(type){
            case "KOREAN":
                text = "한식"; break;
            case "CHINESE":
                text = "중식"; break;
            case "JAPANESE":
                text = "일식"; break;
            case "WESTERN":
                text = "양식"; break;
        }
        return text;
    }

    // 편의유형 변환
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
        if(room) {list.push("룸")};
        if(groupseat) {list.push("단체석")}
        if(sedentary) {list.push("좌식")}
        if(internet) {list.push("무선 인터넷")}
        if(highchair) {list.push("유아용 의자")}
        if(handicap) {list.push("장애인 편의시설")}
        if(pet) {list.push("반려동물")}
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
                    <DescTitle size={23}>업체 기본정보</DescTitle>
                    <DescTitle size={12}>(기본 정보가 입력되어야 업체 조회 리스트에 등록됩니다.)</DescTitle>
                </View>
                <InfoContainer>
                    <ManageText 
                        label="업체 전화번호"
                        TextChange
                        onChangePress={_onBasicPress}
                        value={phoneNumber!== "first"? phoneNumber: ""}
                        editable={false}
                    />
                    <ManageText 
                        label="주소"
                        value={address}
                        editable={false}
                    />
                    <ManageText 
                        label="영업시간"
                        value={openTime !== '' ? setTime(openTime)+" ~ "+setTime(closeTime) : ""}
                        editable={false}
                    />
                    <ManageText 
                        label="간단한 설명"
                        value={ment}
                        editable={false}
                    />
                    <RowItemContainer>
                        <DescTitle>업체 사진</DescTitle>
                        {storeImages.map( item => 
                            <StoreImage source={{uri : item.path}} key = {item.id}/>
                        )}
                    </RowItemContainer>
                    <ManageText 
                        label="업체유형"
                        value={_changeType(storeType)}
                        editable={false}
                    />
                </InfoContainer>

                {/* 업체 메뉴정보 */}
                <View style={{marginLeft: 10}}>
                    <DescTitle size={23}>업체 메뉴정보</DescTitle>
                </View>

                <InfoContainer>
                    <View style={styles.row}>
                        <ChangeContainer>
                            <ChangeText onPress={() => {setIsMenuModal(true);}}>메뉴 추가</ChangeText>
                        </ChangeContainer> 
                    </View>
                    <Modal visible={isMenuModal} transparent={true}>
                        <TouchableOpacity style={styles.background} onPress={() => setIsMenuModal(false)} />
                        <MenuContainer>
                            <ManageText 
                                name="name"
                                value={name}
                                label="메뉴 이름"
                                placeholder="메뉴 이름"
                                onChange={handleChange}
                            />
                            <ManageText
                                name="price"
                                label="가격"
                                placeholder="가격"
                                keyboardType="number-pad"
                                value={price}
                                onChange={handleChange}
                            />
                            <ManageText 
                                name="description"
                                label="설명"
                                placeholder="설명"
                                multiline={true}
                                value={description}
                                onChange={handleChange}
                            />
                            <RowItemContainer>
                                <DescTitle>메뉴 사진</DescTitle>
                                <Image title="사진 첨부"
                                    url={photo}
                                    onChangeImage={url => setPhoto(url)}
                                    containerStyle={{ width: '70%', marginTop: '3%'}}
                            />
                            </RowItemContainer>
                            <ButtonContainer>
                                <Button title="취소" onPress={_onMenuCancel} containerStyle={{ width: '40%', marginRight: 10}}/>
                                <Button title="저장" onPress={_onMenuPress} containerStyle={{ width: '40%' }} disabled={menuDisalbed}/>
                            </ButtonContainer>
                        </MenuContainer>
                    </Modal>
                    
                    {menus.map(item => (
                        
                        <RowItemContainer key={item.menuId}>
                            <StoreImage source={{uri : item.path}}/>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: '3%'}}>
                                <Label>이름 : {item.name}</Label>
                                <Label>가격 : {item.price}원</Label>
                                <SmallButton title="삭제" onPress={() => {_onMenuDelete(item.menuId);}} containerStyle={{ width: '20%', }}/>
                            </View>
                            <Label>설명 : {item.description}</Label>
                        </RowItemContainer>
                    ))} 

                </InfoContainer>
                
                {/* 업체 편의정보 */}
                <View style={{marginLeft: 10}}>
                    <DescTitle size={23}>업체 편의정보</DescTitle>
                </View>

                <InfoContainer>
                    <ManageText 
                        label="수용인원"
                        TextChange
                        onChangePress={_onConveniencePress}
                        isText
                        text={personNumber ? personNumber+"명" : ""}
                    />
                    <ManageText 
                        label="주차"
                        isText
                        text={isParking ? parkingNumber+"대 가능" : "없음" }
                    />
                    
                    {/* 기타시설 list에 넣어서 관리 생각.. */}
                    <ManageText 
                        label="기타시설"
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