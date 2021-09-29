import React, {useLayoutEffect, useState, useEffect, useRef, useContext} from 'react';
import styled from "styled-components/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {CheckBoxLetter, DateTimePicker,  RadioButton} from "../components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {removeWhitespace} from "../utils/common";
import DropDownPicker from "react-native-dropdown-picker";
import {Dimensions, Alert} from "react-native";
import { theme } from '../theme';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from "expo-location";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";
import {changeListData} from "../utils/common";


const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;



var moment = require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
exports.moment = moment;

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
background-color:  ${({ theme }) => theme.background};
`;


const RegisterAuction = ({navigation, route}) => {
  const {allow, token, setAllow, longitude, latitude, setLatitude, setLongitude} = useContext(LoginContext);
  const {url} = useContext(UrlContext);
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
    let auctionId = route.params.id;


    const [isChange, setIsChange] = useState(route.params.isChange);
    const [buttonPress, setButtonPress] = useState(false);
  

    const [bookYear, setBookYear] = useState();
    const [bookMonth, setBookMonth] = useState();
    const [bookDay, setBookDay] = useState();
    const [bookHour, setBookHour] = useState();
    const [bookMinute, setBookMinute] = useState();

    const [endYear, setEndYear] = useState();
    const [endMonth, setEndMonth] = useState();
    const [endDay, setEndDay] = useState();
    const [endHour, setEndHour] = useState();
    const [endMinute, setEndMinute] = useState();

  const [realBook , setRealBook] = useState();
  const [realEnd , setRealEnd] = useState();

  
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
  const [lati, setLati] = useState(latitude);
  const [longi, setLongi] = useState(longitude);
  const [region, setRegion] = useState({
    longitude: longi,
    latitude: lati,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
});
const [selectedLocation, setSelectedLocation] = useState(null);

// 위치 허용
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
        if(allowLoc){
          let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High}); 
          setLati(location.coords.latitude);
          setLongi(location.coords.longitude);
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
        }
      return loc;
  };

  //위치 -> 시도 변경
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
    let result = await convertKoreanLocation(res);
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
    if(longitude===null || latitude === null){
      if(!allowLoc){
        _getLocPer();
      }else{
        getLocation();
      }
    }
  }, [allowLoc]);

  // 공고 생성 API
  const handleApi = async () => {
    let fixedUrl = url+"/auction";

    let Info = {
      content: additionalContent,
      deadline: realEnd,
      maxPrice: maxPrice,
      minPrice: minPrice,
      reservation: realEnd,
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
      spinner.start();
      let response = await fetch(fixedUrl, options);
      let res = await response.json();
      var success = res["success"];
      if (success){
        auctionId = res["data"]["auctionId"];
      }
      return success;
   
  }catch (error) {
    console.error(error);
  }finally{
    spinner.stop();
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
        }else if(!_bookCheck()) {
          _errorMessage = "예약 시간을 잘못 입력하였습니다";
        }else if(!meetingType){
          _errorMessage = "단체 유형을 입력하세요";
        }
        else if(foodType.length == 0){
          _errorMessage = "선호 메뉴을 입력하세요";
        }else if(!numOfPeople){
          _errorMessage = "인원 수를 입력하세요";
        }else if(String(numOfPeople).includes(","))
        {
          _errorMessage = "인원 수를 제대로 입력하세요";
        }else if(String(numOfPeople).includes("."))
        {
          _errorMessage = "인원 수를 제대로 입력하세요";
        }else if (parseInt(numOfPeople)< 1) {
          _errorMessage = "인원 수를 제대로 입력하세요";
        } else if(!minPrice){
          _errorMessage = "선호가격대의 최소 가격을 입력하세요";
        }else if(String(minPrice).includes(","))
        {
          _errorMessage = "최소 가격을 제대로 입력하세요";
        }else if(String(minPrice).includes("."))
        {
          _errorMessage = "최소 가격을 제대로 입력하세요";
        }else if(parseInt(minPrice) <0){
          _errorMessage = "최소 가격을 제대로 입력하세요";
        }else if(!maxPrice){
          _errorMessage = "선호가격대의 최대 가격을 입력하세요";
        }else if(String(maxPrice).includes(","))
        {
          _errorMessage = "최대 가격을 제대로 입력하세요";
        }else if(String(maxPrice).includes("."))
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
        }else if(!_endCheck()) {
          _errorMessage = "공고 마감 시간을 잘못 입력하였습니다";
        }else if(realBook < realEnd){
          _errorMessage = "공고 마감 시간을 예약 시간 이전으로 설정해주세요."
        }
        else if(!additionalContent) {
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


    useEffect(() => {
      if (buttonPress) {
        if(!isChange){
          var r = _onPress();
        } else{
          var r = _ChangeAuction();
        }
        
      }
    },[buttonPress]);


    //공고 등록 버튼 액션: 공고 등록 후 공고 상세 보여주기 함수 연동 후 스피너 추가
    const _onPress = async () => {
      try{
        spinner.start();
        const result = await handleApi();
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
              longitude: longitude,
              latitude: latitude,
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
              : (<MaterialCommunityIcons name="check" size={35} onPress={ _onButtonPress} 
              style={{marginRight: 10, marginBottom:3, opacity: 1}}/>)
            )});
        },[disabled]);

        // 예약 vs 현재 시간 비교
        const _bookCheck =() => {
          var now = moment().format()
          if(realBook === undefined){
            return false;
          } else if(realBook<now){
            return false;
          }else{
            return true;
          }
        };

         // 마감 vs 현재 시간 비교
         const _endCheck =() => {
          var now = moment().format()
          if(realEnd === undefined){
            return false;
          } else if(realEnd<now){
            return false;
          }else{
            return true;
          }
        };



       

        useEffect(()=>{
          if(bookMonth!==undefined && bookHour!== undefined && bookMinute !== undefined && bookDay !== undefined && bookYear !== undefined){
            var time = moment(bookYear+"-"+bookMonth+"-"+bookDay+" "+bookHour+":"+bookMinute).format('YYYY-MM-DDTHH:mm:ss[Z]');
            setRealBook(time);
          }
        }, [bookMonth, bookDay, bookYear, bookHour, bookMinute]);

        useEffect(()=>{
          if(endMonth!==undefined && endHour !== undefined && endMinute !== undefined && endDay !== undefined && endYear!==undefined){
            var time = moment(endYear+"-"+endMonth+"-"+endDay+" "+endHour+":"+endMinute).format('YYYY-MM-DDTHH:mm:ss[Z]');
          
            setRealEnd(time);
          }
       }, [endMonth, endDay, endYear, endHour, endMinute]);


      //date picker 각 시간 input에 대한 action 
        const _handleBookDatePress =() => {
            setBookDateVisible(true);
        };


        const days=["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];

        const _setBookDate = date => {
          var realdate = moment(date).format("YYYY년 MM월 DD일");
          var year =  moment(date).format("YYYY");
          var month =  moment(date).format("MM");
          var day =  moment(date).format("DD");
          setBookYear(year);
          setBookMonth(month);
          setBookDay(day);
          setBookDate(realdate);
          setBookDateVisible(false);
        };

        const _hideBookDatePicker = () => {
          setBookDateVisible(false);
        };

        const _handleBookTimePress =() => {
          setBookTimeVisible(true);
      };

      const _setBookTime = time => {
        var real = moment(time).format("HH시 mm분");
        var hour =  moment(time).format("HH");
        var minute =  moment(time).format("mm");
        setBookHour(hour);
        setBookMinute(minute);
        setBookTime(real);
        setBookTimeVisible(false);
      };

      const _hideBookTimePicker = () => {
        setBookTimeVisible(false);
      };

      const _handleEndDatePress =() => {
        setEndDateVisible(true);
    };

    const _setEndDate = date => {
      var realdate = moment(date).format("YYYY년 MM월 DD일");
      var year =  moment(date).format("YYYY");
      var month =  moment(date).format("MM");
      var day =  moment(date).format("DD");
      setEndYear(year);
      setEndMonth(month);
      setEndDay(day);
      setEndDate(realdate);
      setEndDateVisible(false);
    };

    const _hideEndDatePicker = () => {
      setEndDateVisible(false);
    };

    const _handleEndTimePress =() => {
      setEndTimeVisible(true);
  };

  const _setEndTime = time => {
    var real = moment(time).format("HH시 mm분");
    var hour =  moment(time).format("HH");
    var minute =  moment(time).format("mm");
    setEndHour(hour);
    setEndMinute(minute);
    setEndTime(real);
    setEndTimeVisible(false);
  };

  const _hideEndTimePicker = () => {
    setEndTimeVisible(false);
  };

  const setDateData = (data) => {
    var date = data.slice(0,4)+"년 "+data.slice(5,7)+"월 "+data.slice(8,10)+"일";
    console.log(date)
    return date;
  };

  const setTimeData = (data) => {
    var time = data.slice(11,13)+"시 "+data.slice(14,16)+"분";
    console.log(time)
    return time;
  };

  // 수정할 공고 정보 불러오기
  useEffect( () => {
    if(isChange){

      setTitle(route.params.title);
      setMeetingType(route.params.groupType);
      setFoodType(changeListData(route.params.storeType).split(", "));
      setNumOfPeople(route.params.groupCnt);
      setSelectedAge(route.params.age);
      setSelectedSex(route.params.gender);
      setSelectedLocation(route.params.addr);
      setAdditionalContent(route.params.content);
      setButtonPress(false);
      setLoc(route.params.addr);
      setMinPrice(route.params.minPrice);
      setMaxPrice(route.params.maxPrice);
      setBookDate(setDateData(route.params.reservation));
      setBookTime(setTimeData(route.params.reservation));
      setEndDate(setDateData(route.params.deadline));
      setEndTime(setTimeData(route.params.deadline));
      setRealBook(route.params.reservation);
      setRealEnd(route.params.deadline)
    }
  },[route.params]);

  




  // 수정 put 보내기
  const putApi = async () => {

    let fixedUrl = url+"/auction/"+`${auctionId}`;

    let Info = {
      content: additionalContent,
      deadline: realEnd,
      maxPrice: maxPrice,
      minPrice: minPrice,
      reservation: realBook,
      storeType: JSON.stringify(foodType),
      title: title,
      groupType: meetingType,
      groupCnt: numOfPeople,
      gender: selectedSex,
      age: selectedAge,
      addr: String(loc),
    };

    let options = {
      method: 'PUT',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-AUTH-TOKEN' : token,
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

// 공고 수정 액션
const _ChangeAuction = async() => {
  try{
    spinner.start();
    var result;

    result = await putApi();

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
          longitude: longitude,
          latitude: latitude,
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
}

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
                  setFoodType(array);  
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
                setFoodType(array);  
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
                setFoodType(array);  
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
                setFoodType(array);  
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
                setFoodType(array);  
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
      onPress={() => {setSelectedLocation(region); getGeocodeAsync(region); }}
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
<MaterialCommunityIcons name="apple-safari" size={30} color="black"/>
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
           <DoubleLabel>평균 연령대</DoubleLabel>
            <DoubleLabel>평균 성별</DoubleLabel>
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