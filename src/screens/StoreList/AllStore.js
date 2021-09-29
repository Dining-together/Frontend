import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import {Dimensions, View, ScrollView, Alert} from "react-native";
import { ThemeContext } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import {LoginContext, UrlContext, ProgressContext} from "../../contexts";
import {_changeType} from "../../utils/common";

const HEIGHT = Dimensions.get("screen").width;

const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
`;

const StoresConteinter = styled.View`
    flex: 1;
    margin-top: 20px;
    background-color: ${({theme})=> theme.background};
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
    width: 30%;
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
    const {allow, token, mode, setAllow, latitude, longitude, stores, setStores, setLatitude, setLongitude} = useContext(LoginContext);
    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);

    const [sort,setSort] = useState(0);
    const menu = _changeType(route.name);
    const [storeListData, setStoreListData] = useState([]);
    const [distanceListData, setDistanceListData] = useState([]);
    const [reviewListData, setReviewListData] = useState([]);
    const [scoreListData, setScoreListData] = useState([]);
    const [allowLoc, setAllowLoc] = useState(allow);
    const [realLat, setRealLat] = useState(latitude);
    const [realLon, setRealLon] = useState(longitude);
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
            spinner.start()
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            if(res.list!==undefined){
                setFavorites(res.list.map(i => i.storeId));
            }
        }catch(error) {
            console.error(error);
        }finally{
            spinner.stop()
        }
    };

    const Item = React.memo(({item: {id, name, storeImages, storeType, path, reviewAvg, comment, latitude, longitude}, onPress, theme}) => {
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
    });

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
        if(menu!=="ALL") {
            res = res.filter(item => item.storeType === menu);
        }
        return res;
    };


    //현위치 
    const getLocation = async () => {
        try{
            spinner.start()
            let location = await Location.getCurrentPositionAsync({accuracy:Location.Accuracy.High}); 
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            setRealLat(location.coords.latitude);
            setRealLon(location.coords.longitude);
        }catch(e){
            console.error(e);
        }finally{
            spinner.stop();
        }
};


    const handleStoresApi = async () => {
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
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            let list = res["list"];
            console.log(list);
            setStores(list);
            var sList = filterData(list);
            setStoreListData(sList);
        }catch(error) {
            console.error(error);
        }finally{
            spinner.stop()
        }
    };

    useEffect(()=>{
        if(mode !== "STORE"){
            handleStarApi();
        }
        console.log(latitude, longitude);
    },[]);


    useEffect(()=> {
            if(!allowLoc){
                _getLocPer();
            }else {
                if(latitude===null || longitude === null){
                    getLocation();
                }
                if(stores===null){
                    handleStoresApi();
                }else{
                    setStoreListData(filterData(stores));
                }
            }
    },[allowLoc, menu]);

    const scoreSort = () => {
        var res = storeListData.sort(function(a,b){
            return b.reviewAvg - a.reviewAvg;
        });
        setScoreListData(res);
    };

    const reviewSort = () => {
        var res = storeListData.sort(function(a,b){
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
        }else if(sort === 3){
            reviewSort();
        }
    }, [sort]);

    const _onStorePress = item => {
        navigation.navigate('StoreDetailStack', { id: item.id});
    };


    return (
        <Container>
            <ButtonsContainer>
                <ButtonBox mode={mode} onPress={() => setSort(1)} checked={sort===1}>
                    <ButtonText>거리순</ButtonText>
                </ButtonBox>
                <ButtonBox mode={mode} onPress={() => setSort(2)} checked={sort===2}>
                    <ButtonText>별점순</ButtonText>
                </ButtonBox>
                <ButtonBox mode={mode} onPress={() => setSort(3)} checked={sort===3}>
                    <ButtonText>리뷰순</ButtonText>
                </ButtonBox>
            </ButtonsContainer>
            <ScrollView>
            <StoresConteinter>
                {(sort===0) && storeListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)} theme={theme}/>))}
                {(sort===1) && distanceListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)}  theme={theme}/>))}
                {(sort===2) && scoreListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)} theme={theme}/>))}
                {(sort===3) && reviewListData.map(item => (<Item item={item} key={item.id} onPress={()=> _onStorePress(item)}   theme={theme}/>))}
            </StoresConteinter>
            <AdditionalBox />
            </ScrollView>
            <View style={{
                position: "absolute",
                bottom: 10,
                right: 5,
            }}>
            
            <MapButton 
                onPress={()=> {
                        navigation.navigate("StoreMap", {longi: longitude, lati: latitude});
            }}>
                <MapText>지도로 보기</MapText>
            </MapButton>
            
            </View>
        </Container>
    );
};

export default Store; 