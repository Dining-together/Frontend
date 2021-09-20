import React,{useEffect, useState, useContext, useRef} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {Dimensions, ScrollView, FlatList, View, Text} from "react-native";
import * as Location from "expo-location";
import {LoginContext, ProgressContext, UrlContext} from "../../contexts";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.titleColor}
`;

const Memus = [{id: 0, name:"전체"}, {id: 1, name:"한식"}, {id: 2, name:"중식"},
{id: 3, name:"양식"}, {id: 4, name:"일식"}, {id: 5, name:"기타"}];

const ButtonContainer = styled.TouchableOpacity`
    width: ${WIDTH*0.2};
    border-radius: 30px;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
    background-color: ${({theme, checked})=> checked? theme.storeButton : theme.background}
`;

const ButtonText = styled.Text`
    font-size: 14px;
    font-weight: bold;
`;

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-self: center;
    width: 95%;
    margin-bottom: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    border-color: ${({ theme }) => theme.text};
    background-color: ${({theme})=> theme.background}
`;

const CurrentLocContainer = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    position: absolute;
    top: 10px;
    right: 10px;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
    background-color: ${({theme})=> theme.background}
`;

const StyledImage = styled.Image`
    background-color:${({ theme }) => theme.imageBackground};
    height: 60;
    width: 60;
    border-radius: 50px;
`;

const ContentContainter = styled.View`
    padding: 0px 10px;
`;

const ContentTitleText = styled.Text`
    font-size: 15px;
    font-weight: bold;
    margin-bottom: 5px;
    color:${({ theme }) => theme.text};
`;

const ContentText = styled.Text`
    font-size: 12px;
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
    font-size: 10px;
    font-weight: bold;
    color:${({ theme }) => theme.background};
`;

const Button = ({item:{id, name}, onPress, checked}) => {
    return(
        <ButtonContainer onPress={onPress} checked={checked}>
            <ButtonText>{name}</ButtonText>
        </ButtonContainer>
    );
};

const SortButtonContainer = styled.View`
    height: ${HEIGHT*0.06};
    width: 100%;
    padding: 5px;
`;

const StoresConteinter = styled.View`
    flex: 1;
    margin-top: 5px;
`;

const StoreMap = ({navigation, route}) => {
    const longi = route.params.longi;
    const lati = route.params.lati;
    const mapRef = useRef();
    
    const theme = useContext(ThemeContext);
    const {token, mode, setAllow} = useContext(LoginContext);
    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);

    const [storeListData, setStoreListData] = useState([]);
    const [storeList, setStoreList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sort, setSort] = useState(0);
    const [region, setRegion] = useState({
        longitude: longi,
        latitude: lati,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const [scope, setScope] = useState({
        highLat: null,
        highLon: null,
        lowLat: null,
        lowLon: null,
    });

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
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();

            return res["success"];

        } catch (error) {
            console.error(error);
        }finally {
            spinner.stop();
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
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            let list = res["list"];
            setStoreListData(list);
            await getScope();
            if(mode!=="STORE"){
                await handleStarApi();
            }
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    }

    const checkScope = (lat, lon) => {
        if(lat > scope.lowLat && lat < scope.highLat && lon > scope.lowLon && lon < scope.highLon){
            return true;
        }
        return false;
    }

    const _changeType = (type) => {
        let text;
    
        switch(type){
            case 1:
                text = "KOREAN"; break;
            case 2:
                text = "CHINESE"; break;
            case 3:
                text = "JAPANESE"; break;
            case 4:
                text = "WESTERN"; break;
            case 5:
                text = "기타"; break;
        }
        return text;
    }

    const filterRegion = async () => {
        try{
            spinner.start();
            if(sort === 0){
                var list = storeListData;
            }else{
                var type = _changeType(sort);
                var list = storeListData.filter(item => item.storeType === type);
            }
            list = list.filter((item)=> checkScope(item.latitude, item.longitude)===true);
            setStoreList(list);
            setIsLoading(false);
        }catch(e){
            console.log(e);
        }finally{
            spinner.stop();
        }
    };

    const getScope = async () => {
        var boundary = await mapRef.current.getMapBoundaries();
        setScope({
            highLat: boundary.northEast.latitude,
            highLon: boundary.northEast.longitude,
            lowLat: boundary.southWest.latitude,
            lowLon: boundary.southWest.longitude,
        })
    };

    useEffect(()=> {
        handleApi();
    },[]);

    useEffect(()=> {
        if(scope.highLat!==null && storeListData!==[]){
            filterRegion();
        }
    },[scope, sort, storeListData]);

    const _onStorePress = item => {
        navigation.navigate('StoreDetailStack', { id: item.id, name: item.storeName });
    };

    const ButtonPress = item => {
        setSort(item['id']);
    };


    const Store = React.memo(({item: {id, name, comment, path, reviewAvg}, onPress, theme}) => {
        const [isStar, setIsStar] = useState(favorites.includes(id)===true);

        return (
            <ItemContainer onPress={onPress} >
                <StyledImage source={{uri: path}}/>
                <ContentContainter>
                    <ContentTitleText>{name}</ContentTitleText>
                    <ContentText>{comment}</ContentText>
                    <ContentText>0M</ContentText>
                </ContentContainter>
                {mode ==="CUSTOMER" && 
                <StarBox>
                    {isStar ?
                                (
                                    <MaterialCommunityIcons name="star" size={30} onPress={() => {_deleteStar(id);setIsStar(!isStar)}} color="yellow"
                                        style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                                )
                                : (
                                    <MaterialCommunityIcons name="star-outline" size={30} onPress={() => {_addStar(id); setIsStar(!isStar)}} color="yellow"
                                        style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                                )}
                    </StarBox>}
                <ScoreBox>
                    <MaterialCommunityIcons name="star" size={12} color={theme.background}/>
                    <ScoreText>{Math.round(reviewAvg * 10)/10}</ScoreText>
                </ScoreBox>
            </ItemContainer>
        );
    });

    return ( 
        <Container> 
        <MapView 
        ref={mapRef}
        style={{
            width: WIDTH,
            height: HEIGHT*0.4,
        }}
        initialRegion={{
            longitude: longi,
            latitude: lati,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }}
        region={region}
        onRegionChangeComplete={async (r) => {
            setRegion(r);
            var boundary = await mapRef.current.getMapBoundaries();
            setScope({
                highLat: boundary.northEast.latitude,
                highLon: boundary.northEast.longitude,
                lowLat: boundary.southWest.latitude,
                lowLon: boundary.southWest.longitude,
            })
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        loadingEnabled={true}
        showsMyLocationButton={false}
        >
            {storeList.map(item => (
                <Marker key={item.id}
                    coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                    }}
                    pinColor="blue"
                    onPress={()=> _onStorePress(item)}
                >
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 12, color: "blue", fontWeight: "bold", position: "relative", top: 5}}>{item.name}</Text>
                    <MaterialCommunityIcons name="map-marker" size={40} color="blue"></MaterialCommunityIcons>
                    </View>
                </Marker>
            ))}
        </MapView>
        <CurrentLocContainer
             onPress={()=> setRegion({
             longitude: longi,
             latitude: lati,
             latitudeDelta: 0.01,
             longitudeDelta: 0.01,
        })}>
            <MaterialCommunityIcons name="apple-safari" size={30} color="black"/>
        </CurrentLocContainer>

        <SortButtonContainer>
            <FlatList
            showsHorizontalScrollIndicator={false}
             horizontal={true}
             data={Memus}
             keyExtractor={item => item['id'].toString()}
             renderItem={({item}) => (
                 <Button item={item} onPress={()=> ButtonPress(item)} checked={sort===item['id']}/>
             )} />
        </SortButtonContainer>

        <ScrollView>
            {!isLoading && (
            <StoresConteinter>
                {storeList.map(item => ( <Store item={item} key={item.id} onPress={()=> _onStorePress(item)}  theme={theme} />))}
            </StoresConteinter>)} 
            
        </ScrollView>
    </Container>
    );
};

export default StoreMap;