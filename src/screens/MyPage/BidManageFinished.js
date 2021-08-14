import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import {Dimensions, FlatList} from "react-native";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";
import {changeDateData, changeListData, cutDateData} from "../../utils/common";


const WIDTH = Dimensions.get("screen").width; 

const BidContainer = styled.View`
    flex: 1;
    width: 95%;
    margin-top: ${WIDTH*0.05}
`;

const Container = styled.View`
    flex: 1;
    justify-content: space-around;
    align-items: center;
    padding: 1% 0;
    background-color: ${({theme})=> theme.background};
`;

const ItemContainer = styled.TouchableOpacity`
    align-self: center;
    width: 95%;
    margin-bottom: 10px;
`;

const TimeTextContiner = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

const ContentTitleText = styled.Text`
    font-size: 20px;
    color: ${({theme})=> theme.text};
    margin-bottom: 5px;
`;

const ContentText = styled.Text`
    font-size: 15px;
    color: ${({theme})=> theme.text};
`;

const ItemBox = styled.View`
    border-radius: 1px;
    padding: 10px 8px;
    border-radius: 10px;
    background-color: ${({theme})=> theme.opacityTextColor};
`;

const BidResultText = styled.Text`
    font-weight: bold;
    font-size: 19px;
    padding: 0 3%;
    color: ${({ color }) => color };
`;

const TitleContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;


const Item = ({item: {auctionId, title, storeType, groupType,  groupCnt, deadline, addr, minPrice, maxPrice, reservation, createdDate, success}, onPress,isUser}) => {
    return (
        <ItemContainer onPress={() => onPress(auctionId)} >
            <TimeTextContiner>
                <ContentText>{changeDateData(reservation)} 예약</ContentText>
            </TimeTextContiner>
            <ItemBox>
                <TitleContainer>
                    <ContentTitleText>{title}</ContentTitleText>
                    { !isUser &&
                    <BidResultText color = { success ? "green" : "red"}>{ success ? "낙찰" : "실패"}</BidResultText>
                    }
                </TitleContainer>

                <ContentText>단체 유형: {groupType} ({groupCnt}명)</ContentText>
                <ContentText>선호 지역: {addr}</ContentText>
                <ContentText>선호 메뉴: {changeListData(storeType)}</ContentText>
                <ContentText>선호 가격대: {minPrice}원 ~ {maxPrice}원</ContentText>
                <ContentText style={{position: "absolute", right: 5, bottom: 0}}>{changeDateData(createdDate)} 등록</ContentText>
            </ItemBox>
        </ItemContainer>
    );
};

const BidManageFinished = ({navigation, route}) => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token,  id} = useContext(LoginContext);

    const [data, setData ] = useState([]);
    const [isUser, setIsUser] = useState(route.params.isUser);

    const _onAuctionPress = itemId => {navigation.navigate("AuctionDetail",{id: itemId})};

    // 마감된 공고 불러오기
    const getApi = async () => {

        let fixedUrl = (isUser ? url+"/auction/"+`${id}`+"/auctions" : url+"/auction/"+`${id}`+"/auction");
        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },

        };
        try {
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            console.log(res);

            if(res.list!==undefined){
            if(isUser){
                setData(_setLatestList(_filterProceeding(res['list'])));
            } else {
                setData(_setLatestList(_filterProceeding(res.list.auction)));
            }}

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    }

    useEffect( () => {
        getApi();

    },[]);


    // 최신순
    const _setLatestList = (prev) => {
        if(prev===undefined){
            return;
        }
        var res = prev.sort(function (a,b){
            return Number(cutDateData(b.createdDate)) - Number(cutDateData(a.createdDate));
        });
        return res;
    };

    const _filterProceeding = (prev) => {
        if(prev===undefined){
            return;
        }else{
            let array = prev.filter((obj) => obj.status.includes('END') === true);
            return array;
        }
};
    return (
        <Container>
            <BidContainer>
                <FlatList
                    keyExtractor={item => item['auctionId'].toString()}
                    data={data} 
                    renderItem={({item}) => (
                        <Item item={item} 
                            onPress={()=> _onAuctionPress(item['auctionId'])} 
                            isUser={isUser}/>
                    )}/>
            </BidContainer>

        </Container>
    );
};

export default BidManageFinished;  