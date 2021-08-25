import React, {useState} from 'react';
import styled from "styled-components/native";
import {Dimensions, View} from "react-native";


const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    background-color: ${({ theme }) => theme.background};
    padding: 4%;
    flex: 1;
`;

const Image = styled.Image`
    background-color:${({theme}) => theme.imageBackground};
    width: ${WIDTH*0.9}px;
    height: ${HEIGHT*0.3}px;
`;

const StoreContainer = styled.View`
    padding: 3%;
`;

const MenuContainer = styled.View`
    padding: 0 3% 0 3%;
    justify-content: space-between;
    flex-direction: row;
`;

const DescText = styled.Text`
    font-weight: ${({ title }) => title ? 'bold' : 'normal'};
    font-size: ${({ title }) => title ? 22 : 18}px;
    padding: 2%;
    border-bottom-width: ${({ title }) => title ? 1 : 0}px;
`;

const ChangeContainer = styled.View`
    align-self: flex-end;
    flex-direction: row;
    padding: 2%;
    margin: 0 0 2% 0;
`;

const ChangeText = styled.Text`
    font-weight: bold;
    font-size: 18px;
    color: ${({theme})=> theme.titleColor};
    margin-left: 5%;
`;

const List = styled.ScrollView`
    flex: 1;
`;


const OrderSet = ({order: {id, date, src, name, number, bidPrice, menu}}) => {
    return (
        <View>
            <DefaultText>{date}</DefaultText>
            <UserInfoContainer>
                <UserContainer>
                    <UserImage source={{uri: userSrc}}/>
                    <TitleText>{name}</TitleText>
                </UserContainer>
                    <StarContainer>
                        <TitleText>별점: </TitleText>
                        <Stars score={score}/>
                    </StarContainer>
            </UserInfoContainer>
            <ReviewImage source={{uri: src}}/>
            <MentContainer><DefaultText>{ment}</DefaultText></MentContainer>
        </View>
    );
};


const OrderDetail = ({navigation, route,}) => {

    const [order, setOrder] = useState(Order[0]);
 

    return (
        <Container>
            <List>
                <Image source={{uri: Order.src}}/>
                <StoreContainer>
                    <DescText title>업체명{route.params.name}</DescText>
                    <DescText>인원수 {order.number}명</DescText>
                    <DescText>가격 {order.bidPrice}원</DescText>
                    <DescText title>메뉴</DescText>
                    {order.menu.map(item =>
                        <MenuContainer>
                            <DescText key={item.id}>{item.menuname}</DescText>
                            <DescText key={item.id}>{item.price}원</DescText>
                        </MenuContainer>
                    )}  

                </StoreContainer>

                <ChangeContainer>
                    <ChangeText>업체 전화</ChangeText>
                    <ChangeText onPress={() => {navigation.navigate("StoreDetail",{ id: Order.id });}}>업체 상세</ChangeText>
                </ChangeContainer>

            </List>
        </Container>
    );
};


const Order = [
    {
        id : 0,
        date: "2021-04-27 오후 4시",
        src: "",
        name: "업체이름",
        number : 5,
        bidPrice: 50000,
        menu: [
            {
                menuname : "제육볶음",
                price: 7000,
            },
            {
                menuname : "된장찌개",
                price: 6000,
            },
            {
                menuname : "공기밥",
                price : 1000,
            },

        ],

    },
]

export default OrderDetail; 