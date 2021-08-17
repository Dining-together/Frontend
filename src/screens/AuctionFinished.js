import React, {useState, useContext, useEffect} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import {Dimensions, ScrollView} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";
import {changeDateData, changeEndDateData, changeListData, cutDateData} from "../utils/common";
import {Spinner} from "../components";
import {selectsigungoo, setRegionList} from "../utils/regionData";

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
    padding-left: 1%;
    color: ${({theme})=> theme.text};
`;


const ItemBox = styled.View`
    border-radius: 1px;
    padding: 10px 8px;
    border-radius: 10px;
    background-color: ${({theme})=> theme.opacityTextColor};
`;



const ButtonContainer = styled.TouchableOpacity`
    position: absolute;
    bottom: 3%;
    right: 5%;
    justify-content: center;
    align-items: center;
    `;

const Item = React.memo(({item: {auctionId, auctioneers, content, createdDate, deadline, maxPrice, minPrice, reservation, status, storeType, title, updatedDate, userName, groupType, groupCnt, addr, age, gender}, onPress, onStarPress, isStar}) => {
    return (
        <ItemContainer onPress={() => onPress(auctionId)} >
            <TimeTextContiner>
                <ContentText>{changeDateData(reservation)} 예약</ContentText>
            </TimeTextContiner>
            <ItemBox>
                <ContentTitleText>{title}</ContentTitleText>
                <ContentText>단체 유형: {groupType} ({groupCnt}명)</ContentText>
                <ContentText>선호 지역: {addr}</ContentText>
                <ContentText>선호 메뉴: {changeListData(storeType)}</ContentText>
                <ContentText style={{marginBottom: 10}}>선호 가격대: {minPrice}원 ~ {maxPrice}원</ContentText>
                <ContentText style={{position: "absolute", right: 5, bottom: 0}}>{changeDateData(createdDate)} 등록</ContentText> 
            </ItemBox>
        </ItemContainer>
    );
});


const AuctionFinished = ({navigation}) => {
    const theme = useContext(ThemeContext);
    const {token} = useContext(LoginContext);
    const {aurl} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);

    const [isStar, setIsStar] = useState(false);
    const [auctionListData, setAuctionListData] = useState([]); 
    const [allData, setAllData] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

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
        {label: "전체", value: "전체"},
        {label: "서울특별시", value: "서울특별시"},
        {label: "인천광역시", value: "인천광역시"},
        {label: "대전광역시", value: "대전광역시"},
        {label: "광주광역시", value: "광주광역시"},
        {label: "대구광역시", value: "대구광역시"},
        {label: "울산광역시", value: "울산광역시"},
        {label: "부산광역시", value: "부산광역시"},
        {label: "경기도", value: "경기도"},
        {label: "강원도", value: "강원도"},
        {label: "충청북도", value: "충청북도"},
        {label: "충청남도", value: "충청남도"},
        {label: "전라북도", value: "전라북도"},
        {label: "전라남도", value: "전라남도"},
        {label: "경상북도", value: "경상북도"},
        {label: "경상남도", value: "경상남도"},
        {label: "제주도", value: "제주도"},
    ]);

    const [open4, setOpen4] = useState(false);
    const [selected4, setSelected4] = useState(null);
    const [list4, setList4] = useState([
        {label: "시군구 선택", value: "시군구 선택"},
    ]);

    const handleApi = async () => {
        let fixedUrl = aurl+"/auction/auctions/end";

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
            var list = res["list"];
            setAllData(list);
            setAuctionListData(list);
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    };


    const _setLatestAuctionList = (prev) => {
        var res = prev.sort(function (a,b){
            return Number(cutDateData(b.createdDate)) - Number(cutDateData(a.createdDate));
        });
        return res;
    };

    const _setHurryingAuctionList = (prev) => {
        var res = prev.sort(function (a,b){
            return Number(cutDateData(a.deadline)) - Number(cutDateData(b.deadline));
        });
        return res;
    };

    const _filterSelected2 = (prev, selected) => {
        let array = prev.filter((obj) => obj.storeType.includes(selected)===true);
        return array;
};

    useEffect(()=> {
        handleApi();
    }, []);

    useEffect(()=> {
        setIsLoading(false)
    },[isChanged]);

    const _filterSelected3 = (prev, selected) => {
        let array = prev.filter((obj) => obj.addr.includes(selected)===true);
        return array;
    };

    useEffect(()=> {
        setIsLoading(true);
        setOpen1(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
       
        var list = allData;
        if (selected1 === "마감순"){
            list = _setHurryingAuctionList(list);
        }else if(selected1 === "최신순"){
            list = _setLatestAuctionList(list);
        }else {
            list = allData;
        }
        
        if(selected2 !== null && selected2!=="전체"){
            list = _filterSelected2(list, selected2);
        }

        if (selected3 !== null){
            let l = selectsigungoo(selected3);
            let stateList = setRegionList(l, l.length);
            setList4(stateList);
            if(selected3!=="전체"){
                list = _filterSelected3(list, selected3);
            }
        }
        
        if (selected4 !== null && selected4!=="전체") {
            list = _filterSelected3(list, selected4);
        }
        setAuctionListData(list);
        setIsChanged(!isChanged);
    },[selected1, selected2, selected3, selected4]);

    const _onAuctionPress = itemId => {
        navigation.navigate("AuctionDetail",{id: itemId})
    };

    const _onStarPress = () => { setIsStar(!isStar) };

    const _checkSize = str => {
        if (str == null){
            return 14;
        }
        else if(str.length > 2){
            return 10;
        }else
        {
            return 12;
        }
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
                textStyle={{color: theme.text, fontSize: 12, fontWeight: "bold"}}
                containerStyle={{width: WIDTH*0.23, position: "absolute", left: WIDTH*0.015, top: 10}}
                arrowIconStyle={{width:  WIDTH*0.03}}
                arrowIconContainerStyle={{position: "absolute", right: 5}}
                placeholder="정렬"
                placeholderStyle={{color: theme.text, fontSize: 12, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}
                maxHeight={WIDTH*0.2}
                />

                <DropDownPicker
                open={open2}
                value={selected2}
                items={list2}
                setOpen={setOpen2}
                setValue={setSelected2}
                setItems={setList2}
                textStyle={{color: theme.text, fontSize: 12, fontWeight: "bold"}}
                containerStyle={{width: WIDTH*0.23, position: "absolute", left: WIDTH*0.25, top: 10}}
                arrowIconStyle={{width:  WIDTH*0.03}}
                arrowIconContainerStyle={{position: "absolute", right: 5}}
                placeholder="메뉴"
                placeholderStyle={{color: theme.text, fontSize: 12, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}
                maxHeight={WIDTH*0.3}/>

                <DropDownPicker 
                open={open3}
                value={selected3}
                items={list3}
                setOpen={setOpen3}
                setValue={setSelected3}
                onClose={() => setSelected4(null)}
                setItems={setList3}
                textStyle={{color: theme.text, fontSize: _checkSize(selected3), fontWeight: "bold"}}
                containerStyle={{width: WIDTH*0.25, position: "absolute", left:  WIDTH*0.485, top: 10}}
                arrowIconStyle={{width:  WIDTH*0.03}}
                arrowIconContainerStyle={{position: "absolute", right: 5}}
                placeholder="시도"
                placeholderStyle={{color: theme.text, fontSize: 12, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}
                maxHeight={WIDTH*0.3}/>

                <DropDownPicker 
                open={open4}
                value={selected4}
                items={list4}
                setOpen={setOpen4}
                setValue={setSelected4}
                setItems={setList4}
                textStyle={{color: theme.text, fontSize: _checkSize(selected4), fontWeight: "bold"}}
                containerStyle={{width: WIDTH*0.25, position: "absolute", right: WIDTH*0.01, top: 10}}
                arrowIconStyle={{width:  WIDTH*0.03}}
                arrowIconContainerStyle={{position: "absolute", right: 5}}
                placeholder="시군구"
                placeholderStyle={{color: theme.text, fontSize: 12, fontWeight: "bold"}}
                listMode="SCROLLVIEW" 
                style={{height: WIDTH*0.1}}
                maxHeight={WIDTH*0.3}/>
        <AuctionsContainer>
            {!isLoading &&
                <ScrollView>
                {auctionListData.map(item => (<Item item={item} key={item.auctionId} onPress={_onAuctionPress} onStarPress={_onStarPress} isStar={isStar}/>))}
            </ScrollView>}
        </AuctionsContainer>
        <ButtonContainer>
        <MaterialCommunityIcons name="refresh-circle" size={65} 
            onPress={() => {
                setSelected1(null);
                setSelected2(null);
                setSelected3(null);
                setSelected4(null);
                setOpen1(false);
                setOpen2(false);
                setOpen3(false);
                setOpen4(false);
                setList4([{label: "시군구 선택", value: "시군구 선택"}])
                handleApi()
                }} color={theme.titleColor}/>
        </ButtonContainer>
        {isLoading && <Spinner />}
        </Container>
    );
};

export default AuctionFinished; 