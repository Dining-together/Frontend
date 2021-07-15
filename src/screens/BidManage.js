import React, {useState, useContext} from 'react';
import styled from "styled-components/native";
import {View, Dimensions, FlatList} from "react-native";
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
    margin-bottom: 5px;
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
    color: ${({theme})=> theme.opacityTextColor};
`;

const ItemBox = styled.View`
    border-radius: 1px;
    padding: 10px 8px;
    border-radius: 10px;
    border-width: 1px;
`;

const ChangeContainer = styled.View`
    align-self: flex-end;
    flex-direction: row;
    padding: 1%;
    margin: 0 3% 2% 0;
`;


const ChangeText = styled.Text`
    font-weight: bold;
    font-size: 16px;
    color: ${({theme})=> theme.titleColor};
    margin-left: 2%;
`;



const Item = ({item: {id, title, type, count, region, preMenu, prePrice, bookTime, registerTime}, 
                onPress, onChange, onRemove, isUser}) => {
    return (
        <View>
            <ItemContainer onPress={onPress} >
                <TimeTextContiner>
                    <ContentText>{bookTime}</ContentText>
                    <ContentText>마감 N분전</ContentText>
                </TimeTextContiner>
                <ItemBox>
                    <ContentTitleText>{title}</ContentTitleText>
                    <ContentText>단체 유형: {type}({count}명)</ContentText>
                    <ContentText>선호 지역: {region}</ContentText>
                    <ContentText>선호 메뉴: {preMenu}</ContentText>
                    <ContentText>선호 가격대: {prePrice}</ContentText>
                    <ContentText style={{position: "absolute", right: 5, bottom: 0}}>{registerTime}</ContentText>
                </ItemBox>
            </ItemContainer>
            <ChangeContainer>
                <ChangeText onPress={onChange}>수정</ChangeText>
                <ChangeText onPress={onRemove}>삭제</ChangeText>
            </ChangeContainer>
        </View>




    );
};

const BidManage = ({navigation, route}) => {

    const [data, setData ] = useState(AuctionList);

    const [isUser, setIsUser] = useState(route.params.isUser);

    const _onAuctionPress = item => {navigation.navigate("AuctionDetail",{id: item['id']})};

    // 입찰내역 수정으로 이동
    const _onChange = item => {
        if(isUser)
            navigation.navigate("RegisterAuction", {id: item['id']});
        else
            navigation.navigate("AuctionBid", {id: item['id']});

    };

    const _onRemove = id => {
        setData(data.filter(data => data.id !== id));
    };


    return (
        <Container>
            <BidContainer>
                <FlatList
                horizontal={false}
                keyExtractor={item => item['id'].toString()}
                data={data} 
                renderItem={({item}) => (
                    <Item item={item} 
                        isUser={isUser}
                        onPress={()=> _onAuctionPress(item)}
                        onChange={()=> _onChange(item)}
                        onRemove={() => _onRemove(item['id'])}
                    />
                )}/>
            </BidContainer>

        </Container>
    );
};

export default BidManage;  