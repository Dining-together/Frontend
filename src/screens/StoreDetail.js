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

const StyledImage = styled.Image`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background-color:${({theme}) => theme.imageBackground};
    border-radius: 10px;
`;

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

const PhotoMenuCon = styled.View`
    position: absolute;
    top: 5;
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
    flex-direction: row;
    align-items: center;
`;



const StoreDetail = ({navigation, route}) => {
    const theme = useContext(ThemeContext);
    const {mode, token} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);
    const {url, curl} = useContext(UrlContext);

    const carouselRef = useRef();
    const [indexSelected, setIndexSelected] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setISLoading] = useState(false);

    const Stars = ({score}) => {
        var list = [];
        var one = parseInt(score);
        var half = parseInt(score/0.5); 
        let i = 0;
        if(score % 2 == 0){
            for(i = 0; i<one;i++)
            {
                list.push(<MaterialCommunityIcons name="star" size={25} color="yellow"/>)
            }
            for(i = 0; i<5-one;i++)
            {
                list.push(<MaterialCommunityIcons name="star-outline" size={25} color="yellow"/>)
            }
        }else {
            for(i = 0; i<one;i++)
            {
                list.push(<MaterialCommunityIcons name="star" size={25} color="yellow"/>)
            }
            if((half - one*2) !== 0){
                list.push(<MaterialCommunityIcons name="star-half" size={25} color="yellow"/>)
                for(i = 0; i<5-one-1;i++)
                {
                    list.push(<MaterialCommunityIcons name="star-outline" size={25} color="yellow"/>)
                }
            }else{
                for(i = 0; i<5-one;i++)
                {
                    list.push(<MaterialCommunityIcons name="star-outline" size={25} color="yellow"/>)
                }
            }
        }
        return list;
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

    const StoreImage = ({item: {id, path, ment, name}, onStarPress, isStar,theme, onReviewPress, reviewAvg, reviewCnt}) => {
        const {mode} = useContext(LoginContext);
        let score = Math.round(reviewAvg * 10)/10
        return (
            <>
                {path===""? (
                    <StyledImageView />
                ):(
                    <StyledImage source={{uri: path}} />
                )}
                { mode === "CUSTOMER" &&
                    <StarContainer>
                    {isStar? 
                    (
                        <MaterialCommunityIcons name="star" size={40} onPress={onStarPress} color="yellow"
                  style={{position: 'absolute', right: 5, marginTop: 5, opacity: 0.7}}/>
                    ) 
                    : (
                        <MaterialCommunityIcons name="star-outline" size={40} onPress={onStarPress} color="yellow"
                  style={{position: 'absolute', right: 5, marginTop: 5, opacity: 0.7}}/>
                    )}
                </StarContainer>}
                {(name!=="")&& <PhotoMenuCon><DesText style={{color: "blue", backgroundColor: "white"}}>{name}</DesText></PhotoMenuCon>}
                {(ment!=="") && <PhotoMentCon><DesText style={{color: "blue", backgroundColor: "white"}}>{ment}</DesText></PhotoMentCon>}
                <DesContainer>
                    <DesTextBox>
                        <Title>{storeName}</Title>
                        <ReviewButton onPress={onReviewPress}><DesText>별점: </DesText><Stars score={score}/></ReviewButton>
                    </DesTextBox>
                    <DesTextBox>
                        <DesText>{storeType}</DesText>
                        <ReviewButton onPress={onReviewPress}><DesText>{reviewCnt}개의 리뷰</DesText></ReviewButton>
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
    const [comment, setComment] = useState(null);
    const [reviewAvg, setReviewAvg] = useState(null);
    const [reviewCnt, setReviewCnt]= useState(null) ;
    const [path, setPath] = useState(null);
    const [picData, setPicData] = useState([]);
    const [photos, setPhotos] = useState([{ment: "", name: "", path: ""}]);
    const [menuPics, setMenuPics] = useState([]);
    var store_name = "";
    var store_path = "";

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
            console.log(res.data);
            setStoreName(res.data.name);
            setStoreType(_changeType(res.data.storeType));
            setMenus(menuRes.list);
            setAddr(res.data.addr);
            setPhoneNumber(res.data.phoneNum);
            setOpenTime(setTime(res.data.openTime));
            setCloseTime(setTime(res.data.closedTime));
            setComment(res.data.comment);
            setReviewAvg(res.data.reviewAvg);
            setReviewCnt(res.data.reviewCnt);
            setPicData(res.data.storeImages);
            setPath(res.data.path);
            store_name = res.data.name;
            store_path = res.data.path;
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
    
    const _handlePic = () => {
        var list = [];
        if(picData.length>=2){
            var additional1 = { path: picData[0].path, ment: "", name: "" };
            var additional2 = { path: picData[1].path, ment: "", name: "" };
            list.push(additional1);
            list.push(additional2);
        }else if(picData.length===1){
            var additional = { path: picData[0].path, ment: "", name: "" };
            list.push(additional);
        }
        if(menus.length!==0){
            menus.map(m => {
                list.push({
                    path: m.path, ment: m.description, name: m.name,
                })
            });
        }
        setPhotos(list);
    };  

    useEffect(()=> {
        _handleFacilities();
    },[facilities]);

    useEffect(() => {
        handleAPI();
    },[]);

    useEffect(()=> {
        if(picData.length!==0){
            _handlePic();
        }
    },[picData]);

    

    // 즐겨찾기 여부
    useEffect( () => {
        getApi();
        if(data!==undefined){
            let list = data.map(item => item.storeId);
            if(list.includes(id)){
            setIsStar(true);
        }
        }
    },[isLoading]);

    const check_store = async(list) => {
        let s = true;
        for(let i = 0; i < list.length; i++){
          let si = list[i].store.id;
          if (si === id){
            s = false
            var roomId = list[i].id;
            var sender = list[i].customer.name;
          }
        }
        var info = {
            result: s,
            roomId: roomId,
            sender: sender
        };

        return info; 
      }

      const CreateChatRoom = async() => {
        let fixedUrl = curl+"/chat/room";

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
            body: JSON.stringify({ 
              id: id,
              name: store_name,
              path: store_path,
              type: "STORE",
          }),
        };

        try{
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            let roomId = res.data.id;
            let sender = res.data.customer.name;
            navigation.navigate("Message", {id: id, name: store_name, path: store_path, type: "STORE", roomId: roomId, sender: sender});
        } catch (error) {
            console.error(error); 
          } finally {
            spinner.stop();
          }
      };

    // 채팅방 존재 여부 확인
    const CheckChatApi = async () => {
        let fixedUrl = curl+"/chat/user_room";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };

        try{
            spinner.start()
            let response = await fetch(fixedUrl, options);
            console.log("yes");
            let res = await response.json();
            console.log("res");
            var result = await check_store(res.list);
            console.log("result");
            if(result.result === false){
                navigation.navigate("Message", {id: id, name: store_name, path: store_path, type: "STORE", roomId: result.roomId, sender: result.sender});
            }else{
                CreateChatRoom();
            }

        }catch (error) {
        console.error(error);
        } finally {
            spinner.stop();
        }
    };

    const [isStar, setIsStar] = useState(false);
    
    const _onMessagePress = () => {CheckChatApi();};

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

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 즐겨찾기 추가/삭제
    const _onStarPress = async(id) => {
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
                <StoreImage item={item} key={item.name} onReviewPress={_onReviewPress} onStarPress={() => _onStarPress(id)} isStar={isStar} theme={theme} 
                reviewAvg={reviewAvg} reviewCnt={reviewCnt}/>
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
                <InfoBox isFirst={menus.indexOf(menu)==0} key={menu.menuId}>
                    <InfoTextContainer>
                        <FirstInfo><InfoText>{menus.indexOf(menu)==0? "메뉴" : ""}</InfoText></FirstInfo>
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
                    <ThirdInfo double><InfoText>{openTime===null? "" : `${openTime} ~ ${closeTime}`}</InfoText></ThirdInfo>
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
                    <FirstInfo><MaterialCommunityIcons name="comment" size={25} color="black" style={{position: "absolute", left: 20}}/></FirstInfo>
                    </InfoTextContainer>
            </InfoBox>
            <InfoBox isLast={true}>
                <DescInfoContainer>
                    <InfoText>{comment}</InfoText>
                </DescInfoContainer>
                
            </InfoBox>
            
           

        </Container>
        </KeyboardAwareScrollView>
    );
};


export default StoreDetail;