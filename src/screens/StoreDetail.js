import React,{useState, useRef, useContext, useLayoutEffect, useEffect} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Dimensions} from "react-native";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Button} from "../components";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";

const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color:${({theme}) => theme.background};
`;

const HEIGHT = Math.round(Dimensions.get("window").height * 0.4);
const WINDOW_WIDTH =  Dimensions.get('window').width;
const WIDTH = Math.round(WINDOW_WIDTH * 0.95);

// const StyledImage = styled.Image`
//     width: ${WIDTH}px;
//     height: ${HEIGHT}px;
//     background-color:${({theme}) => theme.imageBackground};
//     border-radius: 10px;
// `;

const StyledImageView = styled.View`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background-color:${({theme}) => theme.imageBackground};
    border-radius: 10px;
`;

const DescInfoContainer = styled.View`
    flex: 1;
    width: 80%;
    align-self: center;
    margin-bottom: 20px;
`;

const InfoBox = styled.View`
    flex: 1;
    width: 95%;
    background-color:${({theme}) => theme.textBackground};
    border-bottom-right-radius: ${({isLast}) => isLast? 10 : 0}px;
    border-bottom-left-radius: ${({isLast}) => isLast? 10 : 0}px;
    border-top-right-radius: ${({isFirst}) => isFirst? 10 : 0}px;
    border-top-left-radius: ${({isFirst}) => isFirst? 10 : 0}px;
    margin-bottom: ${({isLast}) => isLast? 20 : 0}px;
`;

const DesTextBox = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 5%;
`;

const DesContainer = styled.View`
    width: 100%;
    height: 35%;
    background-color:${({theme}) => theme.opacityBackground};
    position: absolute;
    bottom: 0;
    border-bottom-right-radius:10px;
    border-bottom-left-radius:10px;
    padding-top: 4%;
    padding-bottom: 4%;
`;

const PhotoMentCon = styled.View`
    position: absolute;
    bottom: 35%;
`;

const FirstInfo = styled.View`
    flex: 1;
    padding: 20px 0px;
    justify-content: center;
    align-items: center;   
`;

const SecondInfo = styled.View`
    flex: ${({double}) => double? 0 : 1};
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.text};
    padding: 20px 0px;
    justify-content: center;
    align-items: center;  
`;

const ThirdInfo = styled.View`
    flex: ${({double}) => double? 2 : 1};
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.text};
    padding: 20px 0px;
    justify-content: center;
    align-items: center; 
    
`;

const InfoText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.text};
`;

const InfoTextContainer = styled.View`  
    flex-direction: row;
`;

const Title = styled.Text`
    font-size: 25px;
    font-weight: bold;
    color: ${({theme}) => theme.background};
`;

const DesText = styled.Text`
    font-size: 17px;
    font-weight: bold;
    opacity: 0.6;
    color: ${({theme}) => theme.background};
    margin-top: 5px;
    margin-left: 10px;
`;

const StarContainer = styled.View`
    width: 100%;
    height: 35%;
    position: absolute;
    top: 0;
`;

const ReviewButton = styled.TouchableOpacity`

`;



const StoreDetail = ({navigation, route}) => {
    const theme = useContext(ThemeContext);
    const {mode, token} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);
    const {url} = useContext(UrlContext);

    const carouselRef = useRef();
    const [indexSelected, setIndexSelected] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setISLoading] = useState(false);

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

    const _changeFac = (type) => {
        let text;

        switch(type){
            case "ROOM":
                text = "룸"; break;
            case "GROUPSEAT":
                text = "단체석"; break;
            case "SEDENTARY":
                text = "좌식"; break;
            case "INTERNET":
                text = "무선 인터넷"; break;
            case "HIGHCHAIR":
                text = "유아용 의자"; break; 
            case "HANDICAP":
                text = "장애인 편의시설"; break;
            case "PET":
                text = "반려동물"; break;   
        }
        return text;
    }

    // 영업시간 시간 type 변경
    const setTime = (time) => {
        const moment = require('moment');
        
        let h = moment(time).format('HH');
        let m = moment(time).format('mm');


        return (h+"시 "+m+"분");
    };

    const StoreImage = ({item: {id, src, des}, onStarPress, isStar,theme, onReviewPress}) => {
        const {mode} = useContext(LoginContext);
        return (
            <>
                {/* <StyledImage source={{uri: src}} /> */}
                <StyledImageView />
                { mode === "CUSTOMER" &&
                    <StarContainer>
                    {isStar? 
                    (
                        <MaterialCommunityIcons name="star" size={40} onPress={onStarPress} color="yellow"
                  style={{marginLeft: 15, marginTop: 5, opacity: 0.7}}/>
                    ) 
                    : (
                        <MaterialCommunityIcons name="star-outline" size={40} onPress={onStarPress} color="yellow"
                  style={{marginLeft: 15, marginTop: 5, opacity: 0.7}}/>
                    )}
                </StarContainer>}
                {(id !== 0 && id <= menus.length) && <PhotoMentCon><DesText style={{color: "blue"}}>{menus[id-1].description}</DesText></PhotoMentCon>}
                <DesContainer>
                    <DesTextBox>
                        <Title>{storeName}</Title>
                        <ReviewButton onPress={onReviewPress}><Title>리뷰 별점</Title></ReviewButton>
                    </DesTextBox>
                    <DesTextBox>
                        <DesText>{storeType}</DesText>
                        <ReviewButton onPress={onReviewPress}><DesText>리뷰 수</DesText></ReviewButton>
                    </DesTextBox>
                </DesContainer>
            </>
        );
    };

    const onSelect = indexSelected => {
        setIndexSelected(indexSelected);
    };

    const [id, setId] = useState(route.params.id);
    const [storeName, setStoreName] = useState(null);
    const [storeType, setStoreType] = useState(null);
    const [menus, setMenus] = useState([]);
    const [addr, setAddr] = useState(null);
    const [phoneNum, setPhoneNumber] = useState(null);
    const [openTime, setOpenTime] = useState(null);
    const [closeTime, setCloseTime] = useState(null);
    const [parking, setParking] = useState(null);
    const [parkingCount, setParkingCount] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [capacity, setCapacity]=useState(null);
    const [changedFac, setChangedFac] = useState(null);

    const _handleFacilities = () => {
        if(facilities===[]){
            return null;
        }
        let list = [];
        for(var i = 0; i<facilities.length; i++){
            list.push(_changeFac(facilities[i].facilityType));
        }
        var listStr = list.join(", ");

        setChangedFac(listStr)
    };

    //id로  이미지 및 정보 불러옴
    const handleAPI = async () => {
        let fixedUrl = url+"/member/store/"+route.params.id;
        let menuUrl = url+"/member/"+route.params.id+"/menus";

         let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };

        try {
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            let menuResponse = await fetch(menuUrl, options);
            let menuRes = await menuResponse.json();
            setStoreName(res.data.name);
            setStoreType(_changeType(res.data.storeType));
            setMenus(menuRes.list);
            setAddr(res.data.addr);
            setPhoneNumber(res.data.phoneNum);
            setOpenTime(setTime(res.data.openTime));
            setCloseTime(setTime(res.data.closedTime));
            var uploaded = (res.data.facility===null);
            if(!uploaded){
                setParking(res.data.facility.parking);
                setParkingCount(res.data.facility.parkingCount);
                setCapacity(res.data.facility.capacity);
                setFacilities(res.data.facility.facilityEtcs);
            }
            
            
        }catch(error){
            console.error(error);
        }finally{
            spinner.stop();
        }
    };
    
    useEffect(()=> {
        _handleFacilities();
    },[facilities]);

    useEffect(() => {
        handleAPI();
    },[]);

    // 즐겨찾기 여부
    useEffect( () => {
        getApi();
        let list = data.map( item => item.storeId);
        if(list.includes(id)){
            setIsStar(true);
        }
    },[isLoading]);

    const [isStar, setIsStar] = useState(false);
    
    const _onMessagePress = () => {navigation.navigate("Message", {name: "가게 이름"+id})};

    const _onReviewPress = () => {navigation.navigate("Review",{id: id})};

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerRight: () => (
                mode!=="STORE" ?(<MaterialCommunityIcons name="send" size={35} onPress={_onMessagePress}
                    style={{ marginRight: 15, marginBottom: 3, marginTop: 3, opacity: 0.7 }} />) : null
            )
        });
    }, []);

    
    // 즐겨찾기 list 가져오기
    const getApi = async () => {
        let fixedUrl = url+"/member/favorites/customer";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },

        };
        try {
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();

            setData(res.list);

            //console.log(data);
            
            return (res.success);

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
            setISLoading(true);
          }
    };

    // 즐겨찾기 등록 post 처리
    const postApi = async (id) => {
        let fixedUrl = url+'/member/favorites'; 

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
            body: JSON.stringify({ 
                favoritesType: "STORE",
                objectId: id,
            }),
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


    // 즐겨찾기 삭제 delete 처리
    const deleteApi = async (id) => {

        let fixedUrl = url+"/member/favorites";

        let Info = {
            favoritesType: "STORE",
            objectId: id,
        };

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
            body: JSON.stringify( Info ),
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

    // 즐겨찾기 추가/삭제
    const _onStarPress = async(id) => {
        console.log(id);
        try{
            spinner.start();
            let result;
            // 별이 노란색이면 즐겨찾기 삭제
            if(isStar){
                result = await deleteApi(id);
            } 
            // 즐겨찾기 추가
            else{
                result = await postApi(id);
            }
            
            if(!result){
                alert("다시 시도해주세요");
            }
            else{
                setIsStar(!isStar);
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    
   
     return (
        <KeyboardAwareScrollView
        extraScrollHeight={20}
        >
        <Container>
            
           <Carousel 
           layout="default"
           ref={carouselRef}
           data={photos}
           renderItem={({item}) => (
                <StoreImage item={item} onReviewPress={_onReviewPress} onStarPress={() => _onStarPress(id)} isStar={isStar} theme={theme} />
            )}
            sliderWidth={WIDTH}
            itemWidth={WIDTH}
            onSnapToItem={index => onSelect(index)}
           />
           <Pagination 
            inactiveDotColor={theme.label}
            dotColor={theme.titleColor}
            activeDotIndex={indexSelected}
            dotsLength={photos.length}
            animatedDuration={50}
            inactiveDotScale={1}
           />

            {menus.length===0? (
                <InfoBox isFirst={true}>
                <InfoTextContainer>
                    <FirstInfo><InfoText>메뉴</InfoText></FirstInfo>
                    <SecondInfo><InfoText></InfoText></SecondInfo>
                    <ThirdInfo><InfoText></InfoText></ThirdInfo>
                </InfoTextContainer>
            </InfoBox>
            ):null}

            {menus.map(menu => (
                <InfoBox isFirst={menu.menuId===1}>
                    <InfoTextContainer>
                        <FirstInfo><InfoText>{menu.menuId===1? "메뉴" : ""}</InfoText></FirstInfo>
                        <SecondInfo><InfoText>{menu.name}</InfoText></SecondInfo>
                        <ThirdInfo><InfoText>{String(menu.price)+"원"}</InfoText></ThirdInfo>
                    </InfoTextContainer>
                </InfoBox>
            ))}

           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>위치</InfoText></FirstInfo>
                    <SecondInfo double><InfoText></InfoText></SecondInfo>
                    {(addr !== null && addr.length > 19) ? (<ThirdInfo double><InfoText style={{fontSize: 15}}>{addr}</InfoText></ThirdInfo>) 
                    : (<ThirdInfo double><InfoText style={{fontSize: 17}}>{addr}</InfoText></ThirdInfo>)}
               </InfoTextContainer>
           </InfoBox>

           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>연락처</InfoText></FirstInfo>
                    <SecondInfo double><InfoText></InfoText></SecondInfo>
                    <ThirdInfo double><InfoText>{phoneNum}</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>

           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>영업시간</InfoText></FirstInfo>
                    <SecondInfo double><InfoText></InfoText></SecondInfo>
                    <ThirdInfo double><InfoText>{openTime} ~ {closeTime}</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>

           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>최대수용인원</InfoText></FirstInfo>
                    <SecondInfo double><InfoText></InfoText></SecondInfo>
                    <ThirdInfo double><InfoText>{capacity!==null? `${capacity}명` :""}</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>

           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>주차시설</InfoText></FirstInfo>
                    <SecondInfo double><InfoText></InfoText></SecondInfo>
                    {capacity!==null? (
                        <ThirdInfo double><InfoText>{parking? parkingCount+"대 가능" : "주차불가"}</InfoText></ThirdInfo>
                    ) : (
                        <ThirdInfo double><InfoText></InfoText></ThirdInfo>
                    )}
               </InfoTextContainer>
           </InfoBox>
            {capacity!==null? (
                  <InfoBox isLast={true}>
                  <InfoTextContainer>
                      <FirstInfo><InfoText>기타시설</InfoText></FirstInfo>
                      <SecondInfo double><InfoText></InfoText></SecondInfo>
                      {(changedFac !== null && changedFac.length > 19) ? (<ThirdInfo double><InfoText style={{fontSize: 15}}>{changedFac}</InfoText></ThirdInfo>) 
                      : (<ThirdInfo double><InfoText style={{fontSize: 17}}>{changedFac}</InfoText></ThirdInfo>)}
                 </InfoTextContainer>
             </InfoBox>
            ) : (
                <InfoBox isLast={true}>
                <InfoTextContainer>
                    <FirstInfo><InfoText>기타시설</InfoText></FirstInfo>
                    <SecondInfo double><InfoText></InfoText></SecondInfo>
                    <ThirdInfo double><InfoText></InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>
            )}
         
           
            <InfoBox isFirst={true}>
                    <InfoTextContainer>
                    <FirstInfo><InfoText>추가 설명</InfoText></FirstInfo>
                    <SecondInfo><InfoText></InfoText></SecondInfo>
                    <ThirdInfo><InfoText></InfoText></ThirdInfo>
                    </InfoTextContainer>
            </InfoBox>
            <InfoBox isLast={true}>
                <DescInfoContainer>
                    <InfoText>{text}</InfoText>
                </DescInfoContainer>
                
            </InfoBox>
            
           

        </Container>
        </KeyboardAwareScrollView>
    );
};
var text = "One\nTwo\nThree";
const photos = [
    {
        id: 0,
        src: "",
        des: "찌개"
    },
    {
        id: 1,
        src: "",
        des: "고기"
    },
    {
        id: 2,
        src: "",
        des: "밥"
    },
    {
        id: 3,
        src: "",
        des: "반찬"
    },
    {
        id: 4,
        src: "",
        des: "물"
    },
]; 

export default StoreDetail;