import React, {useState} from 'react';
import styled from "styled-components/native";
import {Dimensions, FlatList} from "react-native";
import {AuctionList} from "../utils/data";

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


const Item = ({item: {id, title, type, count, region, preMenu, prePrice, bookTime, registerTime, bidsuccess}, onPress,isUser}) => {
    return (
        <ItemContainer onPress={onPress} >
            <TimeTextContiner>
                <ContentText>{bookTime}</ContentText>
            </TimeTextContiner>
            <ItemBox>
                <TitleContainer>
                    <ContentTitleText>{title}</ContentTitleText>
                    { !isUser &&
                    <BidResultText color = { bidsuccess ? "green" : "red"}>{ bidsuccess ? "낙찰" : "실패"}</BidResultText>
                    }
                </TitleContainer>

                <ContentText>단체 유형: {type}({count}명)</ContentText>
                <ContentText>선호 지역: {region}</ContentText>
                <ContentText>선호 메뉴: {preMenu}</ContentText>
                <ContentText>선호 가격대: {prePrice}</ContentText>
                <ContentText style={{position: "absolute", right: 5, bottom: 0}}>{registerTime}</ContentText>
            </ItemBox>
        </ItemContainer>
    );
};

const BidManageFinished = ({navigation, route}) => {

    const [isUser, setIsUser] = useState(route.params.isUser);

    const _onAuctionPress = item => {
        navigation.navigate("AuctionDetail",{id: item['id']});
    };
    return (
        <Container>
            <BidContainer>
                <FlatList
                    keyExtractor={item => item['id'].toString()}
                    data={AuctionList} 
                    renderItem={({item}) => (
                        <Item item={item} 
                            onPress={()=> _onAuctionPress(item)} 
                            isUser={isUser}/>
                    )}/>
            </BidContainer>

        </Container>
    );
};

export default BidManageFinished;  