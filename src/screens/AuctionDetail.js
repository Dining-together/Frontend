import React, { useLayoutEffect, useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import { Text, View, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import { Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";

const WIDTH = Dimensions.get("screen").width;

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.background};
    padding: 10px 0 0 0;

`;

const Header = styled.View`
    width: ${WIDTH*0.98};
    height: 12%;
    margin-bottom: 20px;
`;

const Title = styled.Text`
    font-size: 30px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    align-self: flex-start;
    width: 85%;
`;

const TitleBox = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
`;

const TextBox = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 20
    padding-right: 10
`;


const InfoContainer = styled.View`
    flex: ${({ flex }) => flex ? flex : 7};
    background-color: ${({ theme }) => theme.background}; 
    justify-content: center;
    alignItems: center;
    flex-direction:column;
    margin : 5%;
    border-radius: 10px;
    border: 1px solid black;
`;


const RowItemContainer = styled.View`
    padding: 5px 10px;
    flex-direction: column;
    border-bottom-width: ${({ border }) => border ? border : 1}px;
    border-color: ${({ theme }) => theme.label}
    width: 95%;
`;

const DescTitle = styled.Text`
    font-size: ${({ size }) => size ? size : 18}px;
    font-weight: bold;
    color: ${({ theme }) => theme.text}; 
    margin-top: 5px;

`;

const Desc = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.text}; 
    margin-top: 7px;
`;

const Store = styled.View`
    flex: 1;
    padding: 5px 0px;
    justify-content: center;
    align-items: center;   
`;


const ButtonContainer = styled.View`
    flex-direction: row;
    flex: 1;
    margin : 15px;
    align-items: center;
    justify-content: center;

`;

const AuctionDetail = ({ navigation, route}) => {

    const [isStar, setIsStar] = useState(false);
    const _onStarPress = () => { setIsStar(!isStar) };
    const [isUser, setIsUser] = useState(route.params.isUser); // 자신의 공고 확인일 경우 true

    const AuctionId = route.params.id;
    const {token, mode, id}  = useContext(LoginContext);
    const {spinner}  = useContext(ProgressContext);
    const {aurl}  = useContext(UrlContext);
    const [title, setTitle] = useState("");
    const [userName, setUserName] = useState("");
    const [userType, setUserType] = useState("");
    const [reservation, setReservation] = useState("");
    const [storeType, setStoreType] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("");
    const [content, setContent] = useState("");
    const [addr, setAddr] = useState("");
    const [groupCnt, setGruopCnt] = useState(0);

    const [bidstoreList, setBidstoreList] = useState([]);

    const _onMessagePress = () => { navigation.navigate("Message" , {name: "닉네임"+AuctionId}) };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerRight: () => (
                (mode==="Store") ?(<MaterialCommunityIcons name="send" size={35} onPress={_onMessagePress}
                    style={{ marginRight: 15, marginBottom: 3, marginTop: 3, opacity: 0.7 }} />) : null
            )
        });
    }, []);
    
    const handleApi = async() => {
        let fixedUrl = aurl+"/auction/"+AuctionId;

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
            let data = res.data;

            setTitle(data.title);
            setUserName(data.userName);
            setUserType(data.groupType);
            setReservation(data.reservation);
            setStoreType(data.storeType);
            setMaxPrice(data.maxPrice);
            setMinPrice(data.minPrice);
            setDeadline(data.deadline);
            setStatus(data.status);
            setContent(data.content);
            setGruopCnt(data.groupCnt);
            setAddr(data.addr);
            setBidstoreList(data.auctioneers);

        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    };


    const changeDateData = (date) =>{
        var y = date.slice(0,4);
        var m = date.slice(5,7);
        var d = date.slice(8,10);
        var h = date.slice(11,13);
        var min = date.slice(14,16);
        return y+"년 "+m+"월 "+d+"일 "+h+"시 "+min+"분";
    }; 

    
    const changeListData = (list) => {
        var sliced = list.slice(1,list.length-1);
        var changed = sliced.replace(/"/gim, "");
        var completed = changed.replace(/,/gim, ", ");
        return completed;
    };

    const changeEndDateData = (date) => {
        var now = new Date().toJSON();
        var now_y = now.slice(0,4);
        var now_m = now.slice(5,7);
        var now_d = now.slice(8,10);
        var now_h = now.slice(11,13);
        var now_min = now.slice(14,16); 
        var y = date.slice(0,4);
        var m = date.slice(5,7);
        var d = date.slice(8,10);
        var h = date.slice(11,13);
        var min = date.slice(14,16);
        var yy = y - now_y;

        var res = "";
        if (yy > 0){
            if (m == now_m){
                res = "약 "+yy+"년 ";
            }else if (m > now_m){
                var mm = m - now_m;
                res = "약 "+yy+"년 "+mm+"달";
            }else {
                var mm = now_m - m;
                res = "약 "+(yy-1)+"년 "+mm+"달";
            }
        }else if(m - now_m > 0){
            res = "약 "+(m-now_m)+"달";
        }else if(d - now_d){
            res = "약 "+(d-now_d)+"일";
        }else if(h - now_h > 0){
            res = "약 "+ (h-now_h) +"시간";
        }else {
            res = "약 "+ (min-now_min) +"분";
        }

        return res;
    };

    
    // 입찰 참여 버튼
    const _bidButtonPress = () => {
        const list = bidstoreList.map(item => item.storeId);
        if(list.includes(id)){
            alert("이미 입찰 참여한 공고입니다.");
        }
        else{
            navigation.navigate("AuctionBid", {AuctionId: AuctionId});
        }
        
    }


    useEffect(()=> {
        handleApi();

        const willFocusSubscription = navigation.addListener('focus', () => {
            handleApi();
        });

        return willFocusSubscription;
    },[]);

    return (

        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}
                showsVerticalScrollIndicator={false}
            >
                <Header>
                    <View style={styles.name}>
                        <TitleBox>
                        <Title>{title}</Title>
                        { mode === 'STORE' &&
                        <>
                        {isStar ?
                            (
                                <MaterialCommunityIcons name="star" size={40} onPress={_onStarPress} color="yellow"
                                    style={{ position: "absolute", right: '5%', opacity: 0.7 }} />
                            )
                            : (
                                <MaterialCommunityIcons name="star-outline" size={40} onPress={_onStarPress} color="yellow"
                                    style={{ position: "absolute", right: '5%', opacity: 0.7 }} />
                        )}
                        </>}
                        </TitleBox>
                    </View>
                        <TextBox>
                        <Text style={{fontSize: 16, paddingLeft: 3}}>{userName}</Text>
                        {(status==="PROCEEDING") && <Text>마감 {changeEndDateData(deadline)} 전</Text>}
                        </TextBox>
                </Header>

                {/* 공고 조회에서 클릭시 데이터 연동 구현 필요 */}
                <InfoContainer>
                    <RowItemContainer>
                        <DescTitle style={{marginTop: 10}}>단체유형 및 인원수</DescTitle>
                        <Desc>{userType} ({groupCnt}명)</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>예약시간 및 날짜</DescTitle>
                        <Desc>{changeDateData(reservation)}</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>선호 위치</DescTitle>
                        <Desc>{addr}</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>선호 메뉴</DescTitle>
                        <Desc>{changeListData(storeType)}</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>선호 가격</DescTitle>
                        <Desc>{minPrice}원 ~ {maxPrice}원</Desc>
                    </RowItemContainer>
                    <RowItemContainer border='0'>
                        <DescTitle>추가 사항</DescTitle>
                        <Desc style={{marginBottom: 10}}>{content}</Desc>
                    </RowItemContainer>
                </InfoContainer>


                <InfoContainer flex={3}>
                    <RowItemContainer>
                        <DescTitle size={20} >입찰현황</DescTitle>
                    </RowItemContainer>

                    {bidstoreList.map(item => (
                        <TouchableOpacity style={styles.row} key={item.auctioneerId}
                            onPress={() => {
                                if(isUser){
                                    navigation.navigate("BidDetail", {id: item.storeId})
                                }
                            }}>
                            <Store><Desc>{item.storeName}</Desc></Store>
                            <Store><Desc>{item.menu}</Desc></Store>
                            <Store><Desc>{item.price}원</Desc></Store>
                        </TouchableOpacity>
                    ))} 
                </InfoContainer>

                {/* Store만 ButtonContainer가 보이도록 구현 필요 이미 참여했으면 수정으로 바꾸기..? */}
                {(status==="PROCEEDING") && (mode==="STORE") &&
                 (<ButtonContainer>
                 <Button
                     title="참여"
                     containerStyle={{ width: '100%' }}
                     onPress={_bidButtonPress}
                 />
             </ButtonContainer>)
                }
               
            </KeyboardAwareScrollView>
        </Container>

    );
};

const styles = StyleSheet.create({
    name: {
        marginLeft: 20,
        flexDirection: 'row',
        alignContent: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
});



export default AuctionDetail;