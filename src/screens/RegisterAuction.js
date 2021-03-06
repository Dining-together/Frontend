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
  const {url, aurl} = useContext(UrlContext);
  const {spinner} = useContext(ProgressContext);
  const [allowLoc, setAllowLoc] = useState(allow);

  //??? ???????????? ?????? state 
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
    const [errorMessage, setErrorMessage] = useState("?????? ????????? ??????????????????.");
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

  
    // ?????? ????????????  
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

    // ?????? ???????????? 
    const [open2, setOpen2] = useState(false);
    const [selectedSex, setSelectedSex] = useState("");
    const [sexes, setSexes] = useState([
      {label: "??????", value: "??????"},
      {label: "??????", value: "??????"},
      {label: "??????", value: "??????"},
    ]); 

  //?????? ??????
  const [loc, setLoc] = useState(null); //?????? ?????? 
  const [lati, setLati] = useState(latitude);
  const [longi, setLongi] = useState(longitude);
  const [region, setRegion] = useState({
    longitude: longi,
    latitude: lati,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
});
const [selectedLocation, setSelectedLocation] = useState(null);

// ?????? ??????
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

    //?????? ?????? 
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

  //?????? -> ?????? ??????
  const convertKoreanLocation = async(res) => {
    let result = "";
    if (res.localityInfo.administrative.length >= 4){
      let gu = res.localityInfo.administrative[3].name;
      if (gu[gu.length-1]==="???"){
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

  // ?????? ?????? API
  const handleApi = async () => {
    let fixedUrl = aurl+"/auction";

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

    //?????? ????????? ?????? 
    useEffect(() => {
      if(didMountRef.current) {
        let _errorMessage="";
        if(!title){
          _errorMessage = "?????? ????????? ???????????????";
        }else if(!bookDate){
          _errorMessage = "?????? ????????? ???????????????";
        }else if(!bookTime){
          _errorMessage = "?????? ????????? ???????????????";
        }else if(!_bookCheck()) {
          _errorMessage = "?????? ????????? ?????? ?????????????????????";
        }else if(!meetingType){
          _errorMessage = "?????? ????????? ???????????????";
        }
        else if(foodType.length == 0){
          _errorMessage = "?????? ????????? ???????????????";
        }else if(!numOfPeople){
          _errorMessage = "?????? ?????? ???????????????";
        }else if(String(numOfPeople).includes(","))
        {
          _errorMessage = "?????? ?????? ????????? ???????????????";
        }else if(String(numOfPeople).includes("."))
        {
          _errorMessage = "?????? ?????? ????????? ???????????????";
        }else if (parseInt(numOfPeople)< 1) {
          _errorMessage = "?????? ?????? ????????? ???????????????";
        } else if(!minPrice){
          _errorMessage = "?????????????????? ?????? ????????? ???????????????";
        }else if(String(minPrice).includes(","))
        {
          _errorMessage = "?????? ????????? ????????? ???????????????";
        }else if(String(minPrice).includes("."))
        {
          _errorMessage = "?????? ????????? ????????? ???????????????";
        }else if(parseInt(minPrice) <0){
          _errorMessage = "?????? ????????? ????????? ???????????????";
        }else if(!maxPrice){
          _errorMessage = "?????????????????? ?????? ????????? ???????????????";
        }else if(String(maxPrice).includes(","))
        {
          _errorMessage = "?????? ????????? ????????? ???????????????";
        }else if(String(maxPrice).includes("."))
        {
          _errorMessage = "?????? ????????? ????????? ???????????????";
        }else if (parseInt(maxPrice) <0) {
          _errorMessage = "?????? ????????? ????????? ???????????????";
        }else if(parseInt(minPrice) > parseInt(maxPrice)) {
          _errorMessage = "?????? ????????? ?????? ????????? ????????? ???????????????";
        }
        else if(!selectedLocation){
          _errorMessage = "??????????????? ???????????????";
        }
        else if(!endDate){
          _errorMessage = "?????? ?????? ????????? ???????????????";
        }
        else if(!endTime){
          _errorMessage = "?????? ?????? ????????? ???????????????";
        }else if(!_endCheck()) {
          _errorMessage = "?????? ?????? ????????? ?????? ?????????????????????";
        }else if(realBook < realEnd){
          _errorMessage = "?????? ?????? ????????? ?????? ?????? ???????????? ??????????????????."
        }
        else if(!additionalContent) {
          _errorMessage = "?????? ????????? ???????????????.";
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


    //?????? ?????? ?????? ??????: ?????? ?????? ??? ?????? ?????? ???????????? ?????? ?????? ??? ????????? ??????
    const _onPress = async () => {
      try{
        spinner.start();
        const result = await handleApi();
        if (!result) {
          alert("????????? ?????????????????????. ????????? ?????? ??????????????????.");
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
            setErrorMessage("?????? ????????? ??????????????????");
            setDisabled(true);
            setUploaded(false);
            
            navigation.navigate("AuctionDetailStack", {isUser: true, id: auctionId });
          }else {
            alert("????????? ?????????????????????. ????????? ?????? ??????????????????.");
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

        // ?????? vs ?????? ?????? ??????
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

         // ?????? vs ?????? ?????? ??????
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


      //date picker ??? ?????? input??? ?????? action 
        const _handleBookDatePress =() => {
            setBookDateVisible(true);
        };


        const days=["?????????","?????????","?????????","?????????","?????????","?????????","?????????"];

        const _setBookDate = date => {
          var realdate = moment(date).format("YYYY??? MM??? DD???");
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
        var real = moment(time).format("HH??? mm???");
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
      var realdate = moment(date).format("YYYY??? MM??? DD???");
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
    var real = moment(time).format("HH??? mm???");
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
    var date = data.slice(0,4)+"??? "+data.slice(5,7)+"??? "+data.slice(8,10)+"???";
    console.log(date)
    return date;
  };

  const setTimeData = (data) => {
    var time = data.slice(11,13)+"??? "+data.slice(14,16)+"???";
    console.log(time)
    return time;
  };

  // ????????? ?????? ?????? ????????????
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

  




  // ?????? put ?????????
  const putApi = async () => {

    let fixedUrl = aurl+"/auction/"+`${auctionId}`;

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

// ?????? ?????? ??????
const _ChangeAuction = async() => {
  try{
    spinner.start();
    var result;

    result = await putApi();

    if (!result) {
      alert("????????? ?????????????????????. ????????? ?????? ??????????????????.");
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
        setErrorMessage("?????? ????????? ??????????????????");
        setDisabled(true);
        setUploaded(false);

        navigation.navigate("AuctionDetailStack", {isUser: true, id: auctionId });
      }else {
        alert("????????? ?????????????????????. ????????? ?????? ??????????????????.");
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
          <Label>?????? ??????</Label>
           <StyledTextInput 
           value={title}
           onChangeText={text => setTitle(text)}
           placeholder="?????? ????????? ???????????????."
           returnKeyType="done"
           maxLength={20}
           autoCapitalize="none"
          autoCorrect={false}
          textContentType="none" // iOS only
          underlineColorAndroid="transparent" // Android only
           />
           <Label>?????? ?????? ??? ??????</Label>
           <DateContainer onPress={_handleBookDatePress} >
             <ButtonTitle>{bookDate? bookDate :"????????? ????????? ???????????????."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={bookDateVisible} mode="date" handleConfirm={_setBookDate} handleCancel={_hideBookDatePicker}/>
        
            <DateContainer onPress={_handleBookTimePress} >
             <ButtonTitle>{bookTime? bookTime :"????????? ????????? ???????????????."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={bookTimeVisible} mode="time" handleConfirm={_setBookTime} handleCancel={_hideBookTimePicker}/>

           
            <TripleLabel>?????? ??????</TripleLabel>
            <RadioContiner>
            <RadioButton 
            label="??????"
            value={(meetingType==="??????")}
            status={(meetingType==="??????"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="??????"){
                    setMeetingType("");
                }else {
                    setMeetingType("??????");
                }
            }}
            />
            <RadioButton 
            label="?????? ??????"
            value={(meetingType==="?????? ??????")}
            status={(meetingType==="?????? ??????"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="?????? ??????"){
                    setMeetingType("");
                }else {
                    setMeetingType("?????? ??????");
                }
            }}
            />
            <RadioButton 
            label="?????? ??????"
            value={(meetingType==="?????? ??????")}
            status={(meetingType==="?????? ??????"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="?????? ??????"){
                    setMeetingType("");
                }else {
                    setMeetingType("?????? ??????");
                }
            }}
            />
            <RadioButton 
            label="??????"
            value={(meetingType==="??????")}
            status={(meetingType==="??????"? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(meetingType==="??????"){
                    setMeetingType("");
                }else {
                    setMeetingType("??????");
                }
            }}
            />
            </RadioContiner>

            <TripleLabel>?????? ??????</TripleLabel>
            <RadioContiner>
            <RadioButton 
            label="??????"
            value={(foodType.includes("??????"))}
            status={(foodType.includes("??????")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
                if(foodType.includes("??????")){
                  let array = foodType.filter((el) => el !=="??????");
                  setFoodType(array);  
                }else {
                  let array = foodType.slice();
                  array.push("??????");
                  setFoodType(array);  
                }
            }}
            />
            <RadioButton 
            label="??????"
            value={(foodType.includes("??????"))}
            status={(foodType.includes("??????")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("??????")){
                let array = foodType.filter((el) => el !=="??????");
                setFoodType(array);  
              }else {
                let array = foodType.slice();
                array.push("??????");
                setFoodType(array);  
              }
            }}
            />
           <RadioButton 
            label="??????"
            value={(foodType.includes("??????"))}
            status={(foodType.includes("??????")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("??????")){
                let array = foodType.filter((el) => el !=="??????");
                setFoodType(array);  
              }else {
                let array = foodType.slice();
                array.push("??????");
                setFoodType(array);  
              }
            }}
            />
            <RadioButton 
            label="??????"
            value={(foodType.includes("??????"))}
            status={(foodType.includes("??????")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("??????")){
                let array = foodType.filter((el) => el !=="??????");
                setFoodType(array);  
              }else {
                let array = foodType.slice();
                array.push("??????");
                setFoodType(array);  
              }
            }}
            />
            <RadioButton 
            label="??????"
            value={(foodType.includes("??????"))}
            status={(foodType.includes("??????")? "checked" : "unchecked")}
            containerStyle={{ marginLeft: 0, marginRight: 0}}
            onPress={() => {
              if(foodType.includes("??????")){
                let array = foodType.filter((el) => el !=="??????");
                setFoodType(array);  
              }else {
                let array = foodType.slice();
                array.push("??????");
                setFoodType(array);  
              }
            }}
            />
            </RadioContiner>
           <RadioContiner>
           <TripleLabel>?????????</TripleLabel>
          <TripleLabel>???????????????</TripleLabel>
           </RadioContiner>
           
            <InputContiner>
                  <StyledTextInputs 
                value={numOfPeople.toString()}
                onChangeText={text => setNumOfPeople(removeWhitespace(text))}
                autoCapitalize="none"
                autoCapitalize="none"
                keyboardType="number-pad"
                autoCorrect={false}
                placeholder="?????????"
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                />

                <StyledTextInputs 
                value={minPrice.toString()}
                onChangeText={text => setMinPrice(removeWhitespace(text))}
                autoCapitalize="none"
                keyboardType="number-pad"
                placeholder="????????????"
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
                placeholder="????????????"
                autoCorrect={false}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                />

        </InputContiner>

        <RadioContiner style={{marginBottom: 5}}>
            <TripleLabel>?????? ??????</TripleLabel>
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
    Alert.alert("Location Permission Error","?????? ????????? ??????????????????.");
  }
}}>
<MaterialCommunityIcons name="apple-safari" size={30} color="black"/>
</CurrentButton>
</MapContainer>
<Label style={{width: WIDTH*0.9, borderRadius: 5, borderWidth: 1, paddingLeft: 5, marginTop: 5, paddingTop: 10, paddingBottom: 10}}>
  {(selectedLocation && loc !== null)? String(loc) : "????????? ???????????? ???????????????."}</Label>



            <Label>?????? ?????? ?????? ??? ??????</Label>
            <DateContainer onPress={_handleEndDatePress} >
             <ButtonTitle>{endDate? endDate :"????????? ????????? ????????? ???????????????."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={endDateVisible} mode="date" handleConfirm={_setEndDate} handleCancel={_hideEndDatePicker}/>

            <DateContainer onPress={_handleEndTimePress} >
             <ButtonTitle>{endTime? endTime :"????????? ????????? ????????? ???????????????."}</ButtonTitle>
           </DateContainer>
            <DateTimePicker visible={endTimeVisible} mode="time" handleConfirm={_setEndTime} handleCancel={_hideEndTimePicker}/>

            <RadioContiner style={{marginBottom: 2}}>
            <TripleLabel>??????</TripleLabel>
           </RadioContiner>

           <StyledTextInputs 
           value={additionalContent}
           onChangeText={text => setAdditionalContent(text)}
           autoCapitalize="none"
           placeholder="?????? ??????"
           autoCorrect={false}
           textContentType="none" // iOS only
           underlineColorAndroid="transparent" // Android only
           style={{height: 100, width: WIDTH * 0.9, marginTop: 2}}
           multiline
           />
          
          

        </Container>
            <AdditionContainer></AdditionContainer>
        <Container>
          <InfoLabel>?????? ??????</InfoLabel>
        <RadioContiner>
           <DoubleLabel>?????? ?????????</DoubleLabel>
            <DoubleLabel>?????? ??????</DoubleLabel>
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
              placeholder="???????????????"
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
              placeholder="????????????"
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