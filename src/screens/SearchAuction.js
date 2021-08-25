import React, {useState, useContext, useEffect} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import {Dimensions, ScrollView} from "react-native";
import {changeDateData, changeEndDateData, changeListData } from "../utils/common";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const WIDTH = Dimensions.get("screen").width; 

const AuctionsContainer = styled.View`
    flex: 1;
`;

const Container = styled.View`
    flex: 1;
    background-color: ${({theme})=> theme.background};
`;

const ItemContainer = styled.TouchableOpacity`
    align-self: center;
    width: 90%;
    margin-bottom: 10px;
`;

const TimeTextContiner = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const NodataText = styled.Text`
    margin-left: ${WIDTH*0.01}%;
    font-size: 15px;
    font-weight: bold;
    color: ${({theme})=> theme.text};
`;

const ContentTitleText = styled.Text`
    font-size: 20px;
    color: ${({theme})=> theme.text};
    margin-bottom: 5px;
`;

const ContentText = styled.Text`
    font-size: 15px;
    color: ${({theme})=> theme.opacityTextColor};
`;

const ItemBox = styled.View`
    border-radius: 1px;
    padding: 10px 8px;
    border-radius: 10px;
    border-width: 1px;
`;

const StarBox = styled.View`
    position: absolute;
    right: 5px;
    top: 5px;
`;

const SearchAuction = ({navigation, route}) => {
    const theme = useContext(ThemeContext);
    const {surl} = useContext(UrlContext);
    const {token, mode} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);

    const [isStar, setIsStar] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const _onAuctionPress = item => {navigation.navigate("AuctionDetail",{id: item['id']})};

    const _onStarPress = () => { setIsStar(!isStar) };

    const Item = React.memo(({item: {id, title, userName, reservation, userType,
        deadLine, maxPrice, minPrice, storeType }, isStar, onPress, onStarPress}) => {
            
                return (
                <ItemContainer onPress={onPress} >
                    <TimeTextContiner>
                    <ContentText>{changeDateData(reservation)} 예약</ContentText>
                    <ContentText>{changeEndDateData(deadLine).includes("-")? "마감" : `마감 ${changeEndDateData(deadLine)} 전`}</ContentText>
                    </TimeTextContiner>
                    <ItemBox>
                        <ContentTitleText>{title}</ContentTitleText>
                        { mode === 'STORE' &&
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
                        </StarBox>}
                        <ContentText>단체 유형: {userType}</ContentText>
                        <ContentText>선호 메뉴: {changeListData(storeType)}</ContentText>
                        <ContentText style={{marginBottom: 10}}>선호 가격대: {minPrice}원 ~ {maxPrice}원</ContentText> 
                    </ItemBox>
                </ItemContainer>
            );
        });

    const handleApi = async () => {
        let fixedUrl = surl+"/search/auction?keyword="+route.params.input;

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

    return (
        <Container>{!isLoading && 
            <AuctionsContainer>
            <ScrollView style={{marginTop: `${WIDTH*0.01}%`}}>
                {(searchData.length===0)&& (
                    <NodataText>검색 결과가 없습니다.</NodataText>
                )}
                {(searchData.length!==0)&& searchData.map(item => (
                    <Item item={item} key={item.id} onPress={()=>{_onAuctionPress(item)}} onStarPress={_onStarPress} isStar={isStar}/>
                ))}
           </ScrollView>
        </AuctionsContainer>
        }
        </Container>
    );
};

export default SearchAuction; 