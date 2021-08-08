import React, {useLayoutEffect, useState, useEffect, useRef, useContext} from 'react';
import styled from "styled-components/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {DateTimePicker,  RadioButton} from "../components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {removeWhitespace} from "../utils/common";
import DropDownPicker from "react-native-dropdown-picker";
import {Dimensions, Alert} from "react-native";
import { theme } from '../theme';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from "expo-location";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";


const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({theme})=> theme.background};
    padding: 10px 20px;
`;

  const StyledTextInput  = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
  }))`
      width: 100%;
      background-color: ${({ theme}) => theme.background};
      color: ${({ theme }) => theme.text};
      padding: 20px 10px;
      font-size: 16px;
      border: 1px solid ${({ theme}) => theme.inputBorder};
      border-radius: 4px;
      margin-bottom: 10px;
  `;

  const DateContainer = styled.TouchableOpacity`
    background-color: ${({theme})=> theme.background}
    align-items: flex-start;
    border-radius: 4px;
    width: 100%;
    padding: 20px 10px;
    border: 1px solid ${({ theme}) => theme.inputBorder};
    margin-bottom: 10px;
  `;


  const ButtonTitle = styled.Text`
    font-size: 16px;
    color: ${({theme})=> theme.inputPlaceholder}
  `;

  const CheckedText = styled.Text`
  font-size: 20px;
  color: ${({theme})=> theme.inputPlaceholder}
`;

  const Label = styled.Text`
      font-size: 16px;
      color: ${({theme})=> theme.text}
      align-self: flex-start;
      margin-bottom:5px;
  `;

  const InfoLabel = styled.Text`
      font-size: 20px;
      color: ${({theme})=> theme.text}
      font-weight: bold;
      align-self: flex-start;
      margin-bottom:10px;
  `;

  const TripleLabel = styled.Text`
  font-size: 16px;
  color: ${({theme})=> theme.text}
  align-self: flex-start;
  width: 30%;
  margin-left: 1%;
`;

const DoubleLabel = styled.Text`
font-size: 16px;
color: ${({theme})=> theme.text}
align-self: flex-start;
width: 51%;
margin-bottom: 2px;
`;

const RadioContiner = styled.View`
  margin-left: 2px;
  width: 100%;
  flex-direction: row;
`;

const InputContiner = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const RegionContiner = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const SmallContainer = styled.View`
  height: 50%;
  align-self: center;
`;

const StyledTextInputs  = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
  }))`
    width: 30%;
    background-color: ${({ theme}) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 10px 10px;
    font-size: 16px;
    border: 1px solid ${({ theme}) => theme.inputBorder};
    border-radius: 4px;
    margin-bottom: 10px;
    margin-top: 5px;
  `;

  const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    font-size: 13px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.errorText};
`;

const AddContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const AdditionContainer = styled.View`
  background-color:  ${({ theme }) => theme.label};
  height: 1px;
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
right: 10px;
justify-content: center;
align-items: center;
border-radius: 50px;
border-width: 1px;
`;


const RegisterAuction = ({navigation}) => {
  const {allow, token} = useContext(LoginContext);
  const {aurl} = useContext(UrlContext);
  const {spinner} = useContext(ProgressContext);
  const [allowLoc, setAllowLoc] = useState(allow);

  //각 변수들에 대한 state 
    const [title, setTitle] = useState("");
    const [book, setBook] = useState(''); //String ver.
    const [end, setEnd] = useState("");
    const [bookDateVisible, setBookDateVisible] = useState(false);
    const [bookDate, setBookDate] = useState("");
    const [bookTime, setBookTime] = useState("");
    const [bookTimeVisible, setBookTimeVisible] = useState(false);
    const [endDateVisible, setEndDateVisible] = useState(false);
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [endTimeVisible, setEndTimeVisible] = useState(false);
    const [meetingType, setMeetingType] = useState(null);
    const [numOfPeople, setNumOfPeople] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [errorMessage, setErrorMessage] = useState("아래 정보를 입력해주세요.");
    const [disabled, setDisabled] = useState(true);
    const [uploaded, setUploaded] = useState(false);
    const [additionalContent, setAdditionalContent] = useState("");
    const didMountRef = useRef();
    const [foodType, setFoodType] = useState([]);
    let bookFullData = "";
    let endFullData = "";
    let auctionId = "";
    const [buttonPress, setButtonPress] = useState(false);
  
    //날짜 데이터
    const [BD, setBD] = useState("");
    const [BT, setBT] = useState("");
    const [ED, setED] = useState("");
    const [ET, setET] = useState("");

    // 나이 드롭다운  
    const [open1, setOpen1] = useState(false);
    const [selectedAge, setSelectedAge] = useState("");
    const [ages, setAges] = useState([
      {label: "~19", value: "~19"},
      {label: "20~25", value: "20~25"},
      {label: "26~30", value: "26~30"},
      {label: "31~35", value: "31~35"},
      {label: "36~40", value: "36~40"},
      {label: "41~50", value: "41~50"},
      {label: "51~60", value: "51~60"},
      {label: "60~", value: "60~"},
    ]);

    // 성별 드롭다운 
    const [open2, setOpen2] = useState(false);
    const [selectedSex, setSelectedSex] = useState("");
    const [sexes, setSexes] = useState([
      {label: "남자", value: "남자"},
      {label: "여자", value: "여자"},
      {label: "반반", value: "반반"},
    ]); 

  //현재 위치
  const [loc, setLoc] = useState(null); //선택 지역 
  const initialLati = 37.535887;
  const initialLongi = 126.984063;
  const [lati, setLati] = useState(37.535887);
  const [longi, setLongi] = useState(126.984063);
  const [region, setRegion] = useState({
    longitude: longi,
    latitude: lati,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
});
const [selectedLocation, setSelectedLocation] = useState(null);

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

    //현재 위치 
    const getLocation = async () => {
        if(allow){
          let location = await Location.getCurrentPositionAsync({}); 
          setLati(location.coords.latitude);
          setLongi(location.coords.longitude);
        }
      return loc;
  };

  const convertKoreanLocation = async(res) => {
    let result = "";
    if (res.localityInfo.administrative.length >= 4){
      let gu = res.localityInfo.administrative[3].name;
      if (gu[gu.length-1]==="구"){
        result = `${res.principalSubdivision} ${res.localityInfo.administrative[2].name} ${res.localityInfo.administrative[3].name}`;
      }else {
        result = `${res.principalSubdivision} ${res.localityInfo.administrative[2].name}`;
      }
    }else{
      result = `${res.principalSubdivision} ${res.localityInfo.administrative[2].name}`;
    }

    return result;
  };

  const getKoreanLocation = async (lat, lng, api) => {
    let response = await fetch(api);
    let res = await response.json();
    let result = convertKoreanLocation(res);
    return result;
  };

  const getGeocodeAsync = async (location) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    let region = geocode[0]["region"]
    let city = geocode[0]["city"]
    let street = geocode[0]["street"];

    let selectedLatitude = location["latitude"];
    let selectedLongitude = location["longitude"];
    let aapi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${selectedLatitude}&longitude=${selectedLongitude}&localityLanguage=ko`;
    
    let res = await getKoreanLocation(selectedLatitude, selectedLongitude, aapi);
    setLoc(res);


  };

  useEffect(() => {
    if(!allowLoc){
      _getLocPer();
    }else {
      const result = getLocation();
    }
  }, [allowLoc]);

  const handleApi = async () => {
    let fixedUrl = aurl+"/auction";

    let Info = {
      content: additionalContent,
      deadline: endFullData,
      maxPrice: maxPrice,
      minPrice: minPrice,
      reservation: bookFullData,
      storeType: JSON.stringify(foodType),
      title: title,
      groupType: meetingType,
      groupCnt: numOfPeople,
      gender: selectedSex,
      age: selectedAge,
      addr: String(loc),
    };

    let options = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN' : token,
      },
      body: JSON.stringify( Info ),
  };

  try{
      let response = await fetch(fixedUrl, options);
      let res = await response.json();
      console.log(res);
      console.log(options)
      console.log(fixedUrl);
      var success = res["success"];
      if (success){
        auctionId = res["data"]["auctionId"];
      }
      return success;
   
  }catch (error) {
    console.error(error);
  }
  };

    //에러 메세지 설정 
    useEffect(() => {
      if(didMountRef.current) {
        let _errorMessage="";
        if(!title){
          _errorMessage = "공고 제목을 입력하세요";
        }else if(!bookDate){
          _errorMessage = "예약 날짜를 입력하세요";
        }else if(!bookTime){
          _errorMessage = "예약 시각을 입력하세요";
        }else if(parseInt(book)<parseInt(getNowString())) {
          _errorMessage = "예약 시간을 잘못 입력하였습니다";
        }else if(!meetingType){
          _errorMessage = "단체 유형을 입력하세요";
        }
        else if(foodType.length == 0){
          _errorMessage = "선호 메뉴을 입력하세요";
        }else if(!numOfPeople){
          _errorMessage = "인원 수를 입력하세요";
        }else if(numOfPeople.includes(","))
        {
          _errorMessage = "인원 수를 제대로 입력하세요";
        }else if(numOfPeople.includes("."))
        {
          _errorMessage = "인원 수를 제대로 입력하세요";
        }else if (parseInt(numOfPeople)< 1) {
          _errorMessage = "인원 수를 제대로 입력하세요";
        } else if(!minPrice){
          _errorMessage = "선호가격대의 최소 가격을 입력하세요";
        }else if(minPrice.includes(","))
        {
          _errorMessage = "최소 가격을 제대로 입력하세요";
        }else if(minPrice.includes("."))
        {
          _errorMessage = "최소 가격을 제대로 입력하세요";
        }else if(parseInt(minPrice) <0){
          _errorMessage = "최소 가격을 제대로 입력하세요";
        }else if(!maxPrice){
          _errorMessage = "선호가격대의 최대 가격을 입력하세요";
        }else if(maxPrice.includes(","))
        {
          _errorMessage = "최대 가격을 제대로 입력하세요";
        }else if(maxPrice.includes("."))
        {
          _errorMessage = "최대 가격을 제대로 입력하세요";
        }else if (parseInt(maxPrice) <0) {
          _errorMessage = "최대 가격을 제대로 입력하세요";
        }else if(parseInt(minPrice) > parseInt(maxPrice)) {
          _errorMessage = "최소 가격과 최대 가격을 제대로 입력하세요";
        }
        else if(!selectedLocation){
          _errorMessage = "선호지역을 입력하세요";
        }
        else if(!endDate){
          _errorMessage = "공고 마감 날짜를 입력하세요";
        }
        else if(!endTime){
          _errorMessage = "공고 마감 시각을 입력하세요";
        }else if(parseInt(end)<parseInt(getNowString())) {
          _errorMessage = "공고 마감 시간을 잘못 입력하였습니다";
        }else if(parseInt(end)>parseInt(book)){
          _errorMessage = "공고 마감 시간을 예약 시간 이전으로 설정해주세요."
        }else if(!additionalContent) {
          _errorMessage = "추가 사항을 입력하세요.";
        }
        else {
          _errorMessage = "";
        }
        setErrorMessage(_errorMessage);

      }else {
        didMountRef.current = true;
      }
    },[title, bookDate,bookTime,endDate,endTime,foodType,numOfPeople,minPrice, maxPrice,selectedLocation,book,end, additionalContent, meetingType, selectedAge, selectedSex,loc]);

    useEffect(()=> {
      setDisabled(errorMessage!=="");
    },[errorMessage]);


    useEffect(()=> {
      var _book = bookDate.slice(0,4)+bookDate.slice(6,8)+bookDate.slice(10,12)+bookTime.slice(0,2)+bookTime.slice(4,6);
      var _end =  endDate.slice(0,4)+endDate.slice(6,8)+endDate.slice(10,12)+endTime.slice(0,2)+endTime.slice(4,6);
      setBook(_book);
      setEnd(_end);
    },[bookTime,bookDate,endDate,endTime]);

    useEffect(() => {
      if (buttonPress) {
        var r = _onPress();
      }
    },[buttonPress]);

    const _setData = async () => {
      bookFullData = BD+BT;
      endFullData = ED+ET;
      return true;
    };

    const f = async (callback1, callback2) => {
      var d = await callback1();
      var res = await callback2();
      return res;
    };

    //공고 등록 버튼 액션: 공고 등록 후 공고 상세 보여주기 함수 연동 후 스피너 추가
    const _onPress = async () => {
      try{
        spinner.start();
        const result = await f(_setData, handleApi);
        if (!result) {
          alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
        }else {
          setUploaded(true);
          if(!disabled){
            setTitle('');
            setBookDate("");
            setBookTime("");
            setEndDate("");
            setEndTime("");
            setMeetingType("");
            setFoodType([]);
            setNumOfPeople("");
            setSelectedAge("");
            setSelectedSex("");
            setSelectedLocation("");
            setAdditionalContent("");
            setButtonPress(false);
            setLoc("");
            setMinPrice("");
            setMaxPrice("");
            setRegion({
              longitude: initialLongi,
              latitude: initialLati,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
          });
            setErrorMessage("아래 정보를 입력해주세요");
            setDisabled(true);
            setUploaded(false);
            
            navigation.navigate("AuctionDetailStack", {isUser: true, id: auctionId });
          }else {
            alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
          };
        }
      }catch(e){
        Alert.alert("Register Error", e.message);
      }finally{
        spinner.stop();
      }
      };

      const _onButtonPress = () => {
        foodType.sort(function(a, b) {
          if(a < b) return 1;
          if(a > b) return -1;
          if(a === b) return 0;
        });
        setButtonPress(true);
      };

      useLayoutEffect(()=> {
        navigation.setOptions({
            headerRight: () => (
              disabled? (<MaterialCommunityIcons name="check" size={35} onPress={() => {setUploaded(true);}} 
              style={{marginRight: 10, marginBottom:3, opacity: 0.3}}/>)
              : (<MaterialCommunityIcons name="check" size={35} onPress={_onButtonPress} 
              style={{marginRight: 10, marginBottom:3, opacity: 1}}/>)
            )});
        },[disabled]);

        const getNowString =() => {
          var now = new Date();
          var nowYear = String(now.getFullYear()); 
          var nowMonth = now.getMonth()+1;
          if(nowMonth < 10){
            nowMonth = "0" + String(nowMonth);
          }else{
            nowMonth = String(nowMonth);
          }
          var nowDate = now.getDate();
          if(nowDate < 10){
            nowDate = "0" + String(nowDate);
          }else {
            nowDate = String(nowDate);
          }
          var nowHour = now.getHours();
          if(nowHour < 10){
            nowHour = "0" + String(nowHour);
          }else {
            nowHour = String(nowHour);
          }
          var nowMinute = now.getMinutes();
          if(nowMinute < 10){
            nowMinute = "0" + String(nowMinute);
          }else {
            nowMinute = String(nowMinute);
          }
          var nowString = nowYear+nowMonth+nowDate+nowHour+nowMinute;

          return nowString;
        };



      //date picker 각 시간 input에 대한 action 
        const _handleBookDatePress =() => {
            setBookDateVisible(true);
        };


        const days=["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];

        const _setBookDate = date => {
          var strD = date.toJSON();
          var sliced = strD.slice(0,11);
          setBD(sliced);
          var y = date.getFullYear();
          var m = date.getMonth()+1;
          if(m < 10){
            m = "0"+m;
          }
          var d = date.getDate();
          if(d< 10){
            d = "0"+d;
          }
          var w = days[date.getDay()];
          setBookDate(y+"년 "+m+"월 "+d+"일 "+w);
          setBookDateVisible(false);
        };

        const _hideBookDatePicker = () => {
          setBookDateVisible(false);
        };

        const _handleBookTimePress =() => {
          setBookTimeVisible(true);
      };

      const _setBookTime = time => {
        var strT = time.toJSON();
        var sliced = strT.slice(11,time.length);
        setBT(sliced)
        var h = time.getHours();
        var m = time.getMinutes();
        if(h < 10){
          h = "0"+h;
        }
        
        if(m< 10){
          m = "0"+m;
        }
        setBookTime(h+"시 "+m+"분");
        setBookTimeVisible(false);
      };

      const _hideBookTimePicker = () => {
        setBookTimeVisible(false);
      };

      const _handleEndDatePress =() => {
        setEndDateVisible(true);
    };

    const _setEndDate = date => {
      var strD = date.toJSON();
      var sliced = strD.slice(0,11);
      setED(sliced);
      var y = date.getFullYear();
      var m = date.getMonth()+1;
      if(m < 10){
        m = "0"+m;
      }
      var d = date.getDate();
      if(d< 10){
        d = "0"+d;
      }
      var w = days[date.getDay()];
      setEndDate(y+"년 "+m+"월 "+d+"일 "+w);
      setEndDateVisible(false);
    };

    const _hideEndDatePicker = () => {
      setEndDateVisible(false);
    };

    const _handleEndTimePress =() => {
      setEndTimeVisible(true);
  };

  const _setEndTime = time => {
    var strT = time.toJSON();
    var sliced = strT.slice(11,time.length);
    setET(sliced);
    var h = time.getHours();
    var m = time.getMinutes();
    if(h < 10){
      h = "0"+h;
    }
    
    if(m< 10){
      m = "0"+m;
    }
    setEndTime(h+"시 "+m+"분");
    setEndTimeVisible(false);
  };

  const _hideEndTimePicker = () => {
    setEndTimeVisible(false);
  };


    return (
      <KeyboardAwareScrollView
        extraScrollHeight={20}
        >
        <Container>
          {errorMessage!=="" && uploaded && disabled && <ErrorText>{errorMessage}</ErrorText>}
          <Label>공고 제목</Label>
           <StyledTextInput 
           value={title}
           onChangeText={text => setTitle(text)}
           placeholder="공고 제목을 입력하세요."
           returnKeyType="done"
           maxLength={20}
           autoCapitalize="none"
          autoCorrect={false}
          textContentType="none" // iOS only
          underlineColorAndroid="transparent" // Android only
           />
           <Label>예약 날짜 및 시각</Label>
           <DateContainer onPress={_handleBookDatePress} >
             <ButtonTitle>{bookDate? bookDate :"예약할 날짜를 입력하세요."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={bookDateVisible} mode="date" handleConfirm={_setBookDate} handleCancel={_hideBookDatePicker}/>
        
            <DateContainer onPress={_handleBookTimePress} >
             <ButtonTitle>{bookTime? bookTime :"예약할 시간을 입력하세요."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={bookTimeVisible} mode="time" handleConfirm={_setBookTime} handleCancel={_hideBookTimePicker}/>

           
            <TripleLabel>단체 유형</TripleLabel>
            <RadioContiner>
            <RadioButton 
            label="회식"
            value={(meetingType==="회식")}
            status={(meetingType==="회식"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="회식"){
                    setMeetingType("");
                }else {
                    setMeetingType("회식");
                }
            }}
            />
            <RadioButton 
            label="친구 모임"
            value={(meetingType==="친구 모임")}
            status={(meetingType==="친구 모임"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="친구 모임"){
                    setMeetingType("");
                }else {
                    setMeetingType("친구 모임");
                }
            }}
            />
            <RadioButton 
            label="가족 모임"
            value={(meetingType==="가족 모임")}
            status={(meetingType==="가족 모임"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="가족 모임"){
                    setMeetingType("");
                }else {
                    setMeetingType("가족 모임");
                }
            }}
            />
            <RadioButton 
            label="기타"
            value={(meetingType==="기타")}
            status={(meetingType==="기타"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="기타"){
                    setMeetingType("");
                }else {
                    setMeetingType("기타");
                }
            }}
            />
            </RadioContiner>

            <TripleLabel>선호 메뉴</TripleLabel>
            <RadioContiner>
            <RadioButton 
            label="한식"
            value={(foodType.includes("한식"))}
            status={(foodType.includes("한식")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(foodType.includes("한식")){
                  let array = foodType.filter((el) => el !=="한식");
                  setFoodType(array);
                }else {
                  let array = foodType.slice();
                  array.push("한식");
                  setFoodType(array)
                }
            }}
            />
            <RadioButton 
            label="양식"
            value={(foodType.includes("양식"))}
            status={(foodType.includes("양식")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("양식")){
                let array = foodType.filter((el) => el !=="양식");
                setFoodType(array);
              }else {
                let array = foodType.slice();
                array.push("양식");
                setFoodType(array)
              }
            }}
            />
           <RadioButton 
            label="중식"
            value={(foodType.includes("중식"))}
            status={(foodType.includes("중식")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("중식")){
                let array = foodType.filter((el) => el !=="중식");
                setFoodType(array);
              }else {
                let array = foodType.slice();
                array.push("중식");
                setFoodType(array)
              }
            }}
            />
            <RadioButton 
            label="일식"
            value={(foodType.includes("일식"))}
            status={(foodType.includes("일식")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("일식")){
                let array = foodType.filter((el) => el !=="일식");
                setFoodType(array);
              }else {
                let array = foodType.slice();
                array.push("일식");
                setFoodType(array)
              }
            }}
            />
            <RadioButton 
            label="기타"
            value={(foodType.includes("기타"))}
            status={(foodType.includes("기타")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("기타")){
                let array = foodType.filter((el) => el !=="기타");
                setFoodType(array);
              }else {
                let array = foodType.slice();
                array.push("기타");
                setFoodType(array)
              }
            }}
            />
            </RadioContiner>
           <RadioContiner>
           <TripleLabel>인원수</TripleLabel>
          <TripleLabel>선호가격대</TripleLabel>
           </RadioContiner>
           
            <InputContiner>
                  <StyledTextInputs 
                value={numOfPeople.toString()}
                onChangeText={text => setNumOfPeople(removeWhitespace(text))}
                autoCapitalize="none"
                keyboardType="number-pad"
                autoCorrect={false}
                placeholder="인원수"
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                />

                <StyledTextInputs 
                value={minPrice.toString()}
                onChangeText={text => setMinPrice(removeWhitespace(text))}
                autoCapitalize="none"
                keyboardType="number-pad"
                placeholder="최소가격"
                autoCorrect={false}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                />
                <SmallContainer>
                  <Label>~</Label>
                </SmallContainer>
                <StyledTextInputs
                value={maxPrice.toString()}
                onChangeText={text => setMaxPrice(removeWhitespace(text))}
                autoCapitalize="none"
                keyboardType="number-pad"
                placeholder="최대가격"
                autoCorrect={false}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                />

        </InputContiner>

        <RadioContiner style={{marginBottom: 5}}>
            <TripleLabel>선호 지역</TripleLabel>
        </RadioContiner>

<MapContainer>
<MapView 
  style={{
    width: WIDTH*0.9,
    height: HEIGHT*0.2,
  }}
  initialRegion={{
    longitude: longi,
    latitude: lati,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  }}
  region={region}
  onRegionChangeComplete={(r) => setRegion(r)}
  provider={PROVIDER_GOOGLE}
  showsUserLocation={true}
  loadingEnabled={true}
  showsMyLocationButton={false}
  >
    <Marker
      coordinate={region}
      pinColor="blue"
      onPress={() => {setSelectedLocation(region); getGeocodeAsync(region);}}
    />
</MapView>
<CurrentButton onPress= {()=> {
  if(allow) {
    setRegion({
      longitude: longi,
      latitude: lati,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01, })
  }else {
    Alert.alert("Location Permission Error","위치 정보를 허용해주세요.");
  }
}}>
<MaterialCommunityIcons name="map-marker" size={30} color="black"/>
</CurrentButton>
</MapContainer>
<Label style={{width: WIDTH*0.9, borderRadius: 5, borderWidth: 1, paddingLeft: 5, marginTop: 5, paddingTop: 10, paddingBottom: 10}}>
  {(selectedLocation && loc !== null)? String(loc) : "지역이 선택되지 않았습니다."}</Label>



            <Label>공고 마감 날짜 및 시각</Label>
            <DateContainer onPress={_handleEndDatePress} >
             <ButtonTitle>{endDate? endDate :"공고를 마감할 날짜를 입력하세요."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={endDateVisible} mode="date" handleConfirm={_setEndDate} handleCancel={_hideEndDatePicker}/>

            <DateContainer onPress={_handleEndTimePress} >
             <ButtonTitle>{endTime? endTime :"공고를 마감할 시간을 입력하세요."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={endTimeVisible} mode="time" handleConfirm={_setEndTime} handleCancel={_hideEndTimePicker}/>

            <RadioContiner style={{marginBottom: 2}}>
            <TripleLabel>내용</TripleLabel>
           </RadioContiner>

           <StyledTextInputs 
           value={additionalContent}
           onChangeText={text => setAdditionalContent(text)}
           autoCapitalize="none"
           placeholder="추가 사항"
           autoCorrect={false}
           textContentType="none" // iOS only
           underlineColorAndroid="transparent" // Android only
           style={{height: 100, width: WIDTH * 0.9, marginTop: 2}}
           multiline
           />
          
          

        </Container>
            <AdditionContainer></AdditionContainer>
        <Container>
          <InfoLabel>추가 정보</InfoLabel>
        <RadioContiner>
           <DoubleLabel>평균 성별</DoubleLabel>
            <DoubleLabel>평균 연령대</DoubleLabel>
           </RadioContiner>
            <AddContainer>
           <DropDownPicker 
              open={open1}
              value={selectedAge}
              items={ages}
              setOpen={setOpen1}
              setValue={setSelectedAge}
              setItems={setAges}
              containerStyle={{width: WIDTH*0.43, alignSelf: "flex-start"}}
              placeholder="평균연령대"
              placeholderStyle={{color: theme.label, fontSize: 16}}
              listMode="SCROLLVIEW"
              maxHeight={130}
              /> 
            
          <DropDownPicker 
              open={open2}
              value={selectedSex}
              items={sexes}
              setOpen={setOpen2}
              setValue={setSelectedSex}
              setItems={setSexes}
              containerStyle={{width: WIDTH*0.43, alignSelf: "flex-start"}}
              placeholder="평균성별"
              placeholderStyle={{color: theme.label, fontSize: 16}}
              listMode="SCROLLVIEW"
              maxHeight={130}
              />  
              <Container style={{height: 200}}></Container>
              </AddContainer>

            
        </Container>
        </KeyboardAwareScrollView>
    );
};


export default RegisterAuction;