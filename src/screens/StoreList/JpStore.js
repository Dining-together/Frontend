import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import {Dimensions, View, ScrollView, Alert} from "react-native";
import { ThemeContext } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {LoginContext, UrlContext} from "../../contexts";
import {_changeType} from "../../utils/common";
import {Spinner} from "../../components";

const HEIGHT = Dimensions.get("screen").width;

const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
`;

const StoresConteinter = styled.View`
    flex: 1;
    margin-top: 20px;
`;

const ButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-top: 10px;
`;

const AdditionalBox = styled.View`
    height: ${HEIGHT*0.2};
`;

const ButtonBox = styled.TouchableOpacity`
    background-color: ${({theme, checked})=> checked? theme.titleColor :theme.storeButton};
    width: ${({mode})=> mode==="STORE"? 45 :30}%;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    height: ${HEIGHT*0.075}
`;

const ButtonText = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-self: center;
    width: 90%;
    margin-bottom: 10px;
    padding: 10px;
    border-width: 1px;
    border-radius: 5px;
    border-color: ${({ theme }) => theme.text};
`;

const StyledImage = styled.Image`
    background-color:${({ theme }) => theme.imageBackground};
    height: 80;
    width: 80;
    border-radius: 50px;
`;

const ContentContainter = styled.View`
    padding: 0px 10px;
    justify-content: center;
`;

const ContentTitleText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color:${({ theme }) => theme.text};
`;

const ContentText = styled.Text`
    font-size: 15px;
    font-weight: bold;
    color:${({ theme }) => theme.opacityTextColor};
`;

const StarBox = styled.View`
    position: absolute;
    right: 5px;
    top: 5px;
`;

const ScoreBox = styled.View`
    position: absolute;
    right: 5px;
    bottom: 5px;
    align-items: center;
    padding: 2px 5px;
    background-color:${({ theme }) => theme.titleColor};
    flex-direction: row;
    border-radius: 50px;
`;

const ScoreText = styled.Text`
    font-size: 13px;
    font-weight: bold;
    color:${({ theme }) => theme.background};
`;

const MapButton = styled.TouchableOpacity`
    background-color:${({ theme }) => theme.mapButtonColor};
    padding: 15px 15px;
    border-radius: 30px;
`;

const MapText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color:${({ theme }) => theme.background};
`;

const Store = ({navigation, route}) => {
    const theme = useContext(ThemeContext);
    const {allow, token, mode} = useContext(LoginContext);
    const {url} = useContext(UrlContext);

    const [sort,setSort] = useState(0);
    const [loc, setLoc] = useState(null);
    const [lati, setLati] = useState(null);
    const [longi, setLongi] = useState(null);
    const menu = _changeType(route.name);
    const [reviewListData, setReviewListData] = useState([]);
    const [scoreListData, setScoreListData] = useState([]);
    const [storeListData, setStoreListData] = useState([]);
    const [distanceListData, setDistanceListData] = useState([]);
    const [allowLoc, setAllowLoc] = useState(allow);
    const [isSetting, setIsSetting] = useState(true);
    const [realLat, setRealLat] = useState("");
    const [realLon, setRealLon] = useState("");

    const [favorites, setFavorites] = useState([]);

    const _deleteStar = async (id) => {
        var fixedUrl = url+"/member/favorites";

        let options = {
            method: 'DELETE',
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
    };

    const _addStar = async (id) => {
        var fixedUrl = url+"/member/favorites";

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
    };

    const handleStarApi = async () => {
        var fixedUrl = url+"/member/favorites/customer";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };
        
        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            if(res.list!==undefined){
                setFavorites(res.list.map(i => i.storeId));
            }
        }catch(error) {
            console.error(error);
        }
    };

    const Item = ({item: {id, name, storeImages, storeType, path, reviewAvg, comment, latitude, longitude}, onPress, theme}) => {
        const [isStar, setIsStar] = useState(favorites.includes(id)===true);
        
        return (
            <ItemContainer onPress={onPress} >
                <StyledImage source={{uri: path}}/>
                <ContentContainter>
                    <ContentTitleText>{name}</ContentTitleText>
                    <ContentText>{comment}</ContentText>
                    <ContentText>{Math.round(caculDistance(realLat, realLon, latitude, longitude))}M</ContentText>
                </ContentContainter>
                {mode ==="CUSTOMER" && 
                <StarBox>
                    {isStar ?
                                (
                                    <MaterialCommunityIcons name="star" size={40} onPress={() => {_deleteStar(id);setIsStar(!isStar)}} color="yellow"
                                        style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                                )
                                : (
                                    <MaterialCommunityIcons name="star-outline" size={40} onPress={() => {_addStar(id); setIsStar(!isStar)}} color="yellow"
                                        style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                                )}
                </StarBox>}
                <ScoreBox>
                    <MaterialCommunityIcons name="star" size={15} color={theme.background}/>
                    <ScoreText>{Math.round(reviewAvg * 10)/10}</ScoreText>
                </ScoreBox>
            </ItemContainer>
        );
    };

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

    const filterData = (list) => {
        var response = list.filter(item => item.documentChecked===true);
        var res = response.filter(item => item.addr!==null);
        var r = res.filter(item => item.storeType === menu);
        return r;
    };

    const getlatlon = async () => {
        let fixedUrl = url+"/member/customer";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };

        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            var lat = res.data.latitude;
            var lon = res.data.longitude;
           setRealLat(lat);
           setRealLon(lon);
        }catch(error) {
            console.error(error);
        }
    };

    useEffect(()=>{
        if(mode !== "STORE"){
            getlatlon();  handleStarApi();
        }
      
    },[]);

    const handleApi = async () => {
        let fixedUrl = url+"/member/stores";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };

        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            let list = res["list"];
            list = await filterData(list);
            setStoreListData(list);
            getLocation();
        }catch(error) {
            console.error(error);
        }
    };

    useEffect(()=> {
        if(!allowLoc){
            _getLocPer();
        }else {
            handleApi();
        }
    },[allowLoc]);

    useEffect(()=> {
        if(lati!==null && longi!==null){
            if(mode==="CUSTOMER"&& realLat!=="" && realLon!==""){
                setIsSetting(false);
            }
            if(mode==="STORE"){
                setIsSetting(false);
            }
        }
    },[lati, longi, realLat, realLon]);

    const scoreSort = () => {
        var res = storeListData.sort(function(a,b){
            return b.reviewAvg - a.reviewAvg;
        });
        setScoreListData(res);
    };

    const reviewSort = () => {
        var res =storeListData.sort(function(a,b){
            return b.reviewCnt - a.reviewCnt;
        });
       setReviewListData(res);
    };

    const caculDistance = (lat1, lng1, lat2, lng2) => {

        function deg2rad(deg) {
             return deg * (Math.PI/180) 
        } 
        
        var R = 6371; // Radius of the earth in km 
        var dLat = deg2rad(lat2-lat1); // deg2rad below 
        var dLon = deg2rad(lng2-lng1); 
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km 
        return d;
    };

    const distanceSort = () => {
        var res = storeListData.sort(function(a,b){
            return caculDistance(realLat, realLon, a.latitude, a.longitude) - caculDistance(realLat, realLon, b.latitude, b.longitude);
        }); 
        setDistanceListData(res);
        return res;
    }; 

    useEffect(()=> {
        if(sort===1){
            distanceSort();
        }else if(sort === 2){
            scoreSort();
        }else{
            reviewSort();
        }
        const willFocusSubscription = navigation.addListener('focus', () => {
            handleApi();
        });
        return willFocusSubscription;
    }, [sort]);

    const _onStorePress = item => {
        navigation.navigate('StoreDetailStack', { id: item.id});
    };
   

    const getLocation = async () => {
        try{
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High}); 
            setLoc(location);
            setLati(location.coords.latitude);
            setLongi(location.coords.longitude);
        }catch(e){
            console.error(e);
        }
        
    return loc;
};

return (
    <Container>
        <ButtonsContainer>
            {mode!=="STORE" && (
            <ButtonBox mode={mode} onPress={() => setSort(1)} checked={sort===1}>
                <ButtonText>거리순</ButtonText>
            </ButtonBox>
            )}
            <ButtonBox mode={mode} onPress={() => setSort(2)} checked={sort===2}>
                <ButtonText>별점순</ButtonText>
            </ButtonBox>
            <ButtonBox mode={mode} onPress={() => setSort(3)} checked={sort===3}>
                <ButtonText>리뷰순</ButtonText>
            </ButtonBox>
        </ButtonsContainer>
        <ScrollView>
        <StoresConteinter>
        {(!isSetting&&sort===0) && storeListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)}  theme={theme}/>))}
                {(!isSetting&&sort===1) && distanceListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)}  theme={theme}/>))}
                {(!isSetting&&sort===2) && scoreListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)}  theme={theme}/>))}
                {(!isSetting&&sort===3) && reviewListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)}  theme={theme}/>))}
        </StoresConteinter>
        <AdditionalBox />
        </ScrollView>
        {isSetting && <Spinner />}
        <View style={{
            position: "absolute",
            bottom: 10,
            right: 5,
        }}>
        {!isSetting && (
            <MapButton 
            onPress={()=> {
                    navigation.navigate("StoreMap", {longi: longi, lati: lati});
        }}>
            <MapText>지도로 보기</MapText>
        </MapButton>
        )}
        </View>
    </Container>
);
};

export default Store; 