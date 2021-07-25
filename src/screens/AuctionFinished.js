import React, {useState, useContext, useEffect} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import {Text, Dimensions, FlatList} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {AuctionList} from "../utils/data";

const WIDTH = Dimensions.get("screen").width; 



const AuctionsContainer = styled.View`
    flex: 1;
    width: 95%;
    margin-top: ${WIDTH*0.15}
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

const Item = ({item: {id, title, type, count, region, preMenu, prePrice, bookTime, registerTime}, onPress}) => {
    return (
        <ItemContainer onPress={onPress} >
            <TimeTextContiner>
                <ContentText>{bookTime}</ContentText>
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
    );
};

const Auction = ({navigation, route}) => {
    const theme = useContext(ThemeContext);

    const [open1, setOpen1] = useState(false);
    const [selected1, setSelected1] = useState(null);
    const [list1, setList1] = useState([
        {label: "최신순", value: "최신순"},
        {label: "마감순", value: "마감순"},
    ]);

    const [open2, setOpen2] = useState(false);
    const [selected2, setSelected2] = useState(null);
    const [list2, setList2] = useState([
        {label: "전체", value: "전체"},
        {label: "한식", value: "한식"},
        {label: "중식", value: "중식"},
        {label: "양식", value: "양식"},
        {label: "일식", value: "일식"},
        {label: "기타", value: "기타"},
    ]);

    // 시도로 범위를 크게 vs 시도별 시군구까지 => api ? 
    const [open3, setOpen3] = useState(false);
    const [selected3, setSelected3] = useState(null);
    const [list3, setList3] = useState([
        {label: "서울특별시", value: "정렬기준1"},
        {label: "부산광역시", value: "정렬기준2"},
        {label: "대구광역시", value: "정렬기준3"}
    ]);

    useEffect(()=> {
        //data 정렬
    }, [selected1, selected2, selected3]);

    const _onAuctionPress = item => {
        navigation.navigate("AuctionDetail",{id: item['id']});
    };
    return (
        <Container>
            
                <DropDownPicker
                open={open1}
                value={selected1}
                items={list1}
                setOpen={setOpen1}
                setValue={setSelected1}
                setItems={setList1}
                containerStyle={{width: WIDTH*0.28, position: "absolute", left: 5, top: 10,}}
                textStyle={{color: theme.text, fontSize: 14, fontWeight: "bold"}}
                placeholder="정렬"
                placeholderStyle={{color: theme.text, fontSize: 14, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}
                />

                <DropDownPicker
                open={open2}
                value={selected2}
                items={list2}
                setOpen={setOpen2}
                setValue={setSelected2}
                setItems={setList2}
                textStyle={{color: theme.text, fontSize: 14, fontWeight: "bold"}}
                containerStyle={{width: WIDTH*0.28, position: "absolute", marginLeft: WIDTH*0.36, top: 10}}
                placeholder="메뉴"
                placeholderStyle={{color: theme.text, fontSize: 14, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}/>

                <DropDownPicker 
                open={open3}
                value={selected3}
                items={list3}
                setOpen={setOpen3}
                setValue={setSelected3}
                setItems={setList3}
                textStyle={{color: theme.text, fontSize: 14, fontWeight: "bold"}}
                containerStyle={{width: WIDTH*0.28, position: "absolute", right: 5, top: 10}}
                placeholder="지역"
                placeholderStyle={{color: theme.text, fontSize: 14, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}/>

        <AuctionsContainer>
            <FlatList
            horizontal={false}
            keyExtractor={item => item['id'].toString()}
            data={AuctionList} 
            renderItem={({item}) => (
                <Item item={item} onPress={()=> _onAuctionPress(item)} />
            )}/>
        </AuctionsContainer>

        </Container>
    );
};

export default Auction; 