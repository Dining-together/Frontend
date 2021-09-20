import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import {Text, Dimensions, FlatList, View, ScrollView, Alert} from "react-native";
import { ThemeContext } from "styled-components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {LoginContext, ProgressContext, UrlContext} from "../contexts"

const WIDTH = Dimensions.get("screen").width;

const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
`;

const StoresConteinter = styled.View`
    flex: 1;
`;

const NodataText = styled.Text`
    margin-left: ${WIDTH*0.01}%;
    font-size: 15px;
    font-weight: bold;
    color: ${({theme})=> theme.text};
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
`;

const ContentTitleText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
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

const SearchStore = ({navigation, route}) => {
    const theme = useContext(ThemeContext);

    const {surl} = useContext(UrlContext);
    const {token, mode} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);

    const [isStar, setIsStar] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
   
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

    const Item = ({item: {comment, title, storeImagePath, storeType}, onPress, isStar, onStarPress}) => {
    
        return (
            <ItemContainer onPress={onPress} >
                <StyledImage source={{uri: storeImagePath}}/>
                <ContentContainter>
                    <ContentTitleText>{title}</ContentTitleText>
                    <ContentText>{comment}</ContentText>
                    <ContentText>{_changeType(storeType)}</ContentText>
                </ContentContainter>
                {mode!=="STORE" && (
                    <StarBox>
                    {isStar ?
                                (
                                    <MaterialCommunityIcons name="star" size={40} onPress={onStarPress} color="yellow"
                                        style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                                )
                                : (
                                    <MaterialCommunityIcons name="star-outline" size={40} onPress={onStarPress} color="yellow"
                                        style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                                )}
                    </StarBox>
                )}
            </ItemContainer>
        );
    };

    const handleApi = async () => {
        let fixedUrl = surl+"/search/store?keyword="+route.params.input;

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
            if(res.list!==undefined){
                setSearchData(res.list);
            }else{
                setSearchData([]);
            }
            
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    };

    useEffect(() => {
        handleApi();
    },[]);

    useEffect(() => {
        setIsLoading(false);
    },[searchData]);

    const _onStorePress = item => {navigation.navigate("StoreDetail", {id: item['id']})};
    const _onStarPress = () => {setIsStar(!isStar);}

    return (
        <Container>{!isLoading &&
            <StoresConteinter>
                <ScrollView style={{marginTop: `${WIDTH*0.01}%`}}>
                    {(searchData.length===0)&& (
                        <NodataText>검색 결과가 없습니다.</NodataText>
                    )}
                    {(searchData.length!==0)&& searchData.map(item => (
                        <Item item={item} key={item.id} onPress={()=>{_onStorePress(item)}} onStarPress={_onStarPress} isStar={isStar}/>
                    ))}
                </ScrollView>
            </StoresConteinter>}
        </Container>
    );
};

export default SearchStore; 