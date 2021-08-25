import React, { useLayoutEffect, useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import { Text, View, StyleSheet, Dimensions, Alert, ScrollView} from "react-native";
import { Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";
import { cutDateData, changeDateData } from '../utils/common';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

require('moment-timezone');
var moment = require('moment');
moment.tz.setDefault("Asia/Seoul");
exports.moment = moment;

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.background};
    padding: 10px 0 0 0;

`;

const Header = styled.View`
    width: ${WIDTH*0.98};
    height: ${HEIGHT*0.12};
`;

const Title = styled.Text`
    font-size: 30px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    align-self: flex-start;
    width: 85%;
`;

const DefaultInfo = styled.View`
    flex-direction: column;
    width: ${WIDTH*0.85};
    border-radius: 10px;
    border: 1px solid black;
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
    flex: 1; 
    width: ${WIDTH*0.85};
    background-color: ${({ theme }) => theme.background}; 
    justify-content: center;
    alignItems: center;
    flex-direction:column;
    margin-top : 5%;
    margin-bottom : 5%;
    border-radius: 10px;
    border: 1px solid black;
`;

const ScrollCon = styled.View`
    height: ${({double})=> double? HEIGHT*0.4 : HEIGHT*0.1};
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

const ButtonContainer = styled.View`
    flex-direction: row;
    flex: 1;
    margin : 15px;
    align-items: center;
    justify-content: center;
`;

const AuctioneerCon = styled.View`
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;
`;

const AucLineCon = styled.View`
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
    margin-right: 20px;
    `;

const Store = styled.TouchableOpacity`
    width: ${({double}) => double? WIDTH*0.35 : WIDTH*0.2};
    justify-content: center;
`;

const StoreText = styled.Text`
    font-size: 15px;
    color: ${({ theme }) => theme.text}; 
`;

const DeleteButton = styled.TouchableOpacity`
    position: absolute;
    right: 10px;
`;

const CheckButton = styled.View`
    position: absolute;
    right: 5px;
`;

const AuctionDetail = ({ navigation, route}) => {

    const [isStar, setIsStar] = useState(false);
    const [isUser, setIsUser] = useState(route.params.isUser); // 자신의 공고 확인일 경우 true

    const AuctionId = route.params.id;
    const {token, mode, id}  = useContext(LoginContext);
    const {spinner}  = useContext(ProgressContext);
    const {aurl, url}  = useContext(UrlContext);
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
    const [finished, setFinished] = useState(false);
    const [registered, setRegistered] = useState(false); //참여 여부 
    const [bidstoreList, setBidstoreList] = useState([]);
    const [auctioneerId, setAuctioneerId] = useState(null);
    const [isMine, setIsMine] = useState(false);

    const [data, setData] = useState([]);
    const [isLoading, setISLoading] = useState(false);

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
            setFinished(data.status==="End");
            setBidstoreList(data.auctioneers);
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    };

    const changeDateData1 = (date) =>{
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

    
    // 입찰 참여 버튼
    const _bidButtonPress = () => {
        if(registered){
            navigation.navigate("AuctionBid", {AuctionId: AuctionId, fix: true, auctioneerId: auctioneerId});
        }
        else{
            navigation.navigate("AuctionBid", {AuctionId: AuctionId});
        }

    }

    //삭제 버튼
    const handledeleteApi = async(id) => {
        let fixedUrl = aurl+"/auction/auctioneer/"+id;

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
            
        };

        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            if(res.success){
                setRegistered(false);
                alert("삭제하였습니다.");
            }
        }catch(error) {
            console.error(error);
        }
    };

    const _pressStore = (item) => {
        navigation.navigate("AuctionBidDetail", {item: item, isMine: isMine, auctionId: AuctionId, finished: status==="END"});
    }

    const _checkIsMine = async () => {
        let fixedUrl = aurl+"/auction/"+id+"/auctions";

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
            var l = res.list.filter(item => item.auctionId===AuctionId);
            if(l.length!==0){
                setIsMine(true);
            }
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    }

    const _deletePress = (id) => {
        handledeleteApi(id);
    };

    useEffect(()=> {
        handleApi();
    },[route.params, registered]);

    useEffect(() => {
        _checkIsMine();
    },[]);


    useEffect(() => {
        const list = bidstoreList.filter(item => item.storeId===id);
        if(list.length!==0){
           setRegistered(true);
           setAuctioneerId(list[0].auctioneerId); 
        }
    },[bidstoreList]);

    // 즐겨찾기 여부
    useEffect( () => {
        getApi();
        if(data!==undefined){
            let list = data.map( item => item.auctionId);
            if(list.includes(AuctionId)){
            setIsStar(true);
            }
        }
    },[isLoading]);


    // 즐겨찾기 list 가져오기
    const getApi = async () => {
        let fixedUrl = url+"/member/favorites/store";

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

            setData(res.list);

            return (res.success);

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
            setISLoading(true);
          }
    };

    // 즐겨찾기 등록 post 처리
    const postApi = async (id) => {
        let fixedUrl = url+'/member/favorites'; 

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
            body: JSON.stringify({ 
                favoritesType: "AUCTION",
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
    }


    // 즐겨찾기 삭제 delete 처리
    const deleteApi = async (id) => {

        let fixedUrl = url+"/member/favorites";

        let Info = {
            favoritesType: "AUCTION",
            objectId: id,
        };

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
            body: JSON.stringify( Info ),
        };
        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 즐겨찾기 추가/삭제
    const _onStarPress = async(id) => {
   
        try{
            spinner.start();
            let result;
            // 별이 노란색이면 즐겨찾기 삭제
            if(isStar){
                result = await deleteApi(id);
            } 
            // 즐겨찾기 추가
            else{
                result = await postApi(id);
            }

            if(!result){
                alert("다시 시도해주세요");
            }
            else{
                setIsStar(!isStar);
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    const _handleDeadline = (date) => {
        return date.slice(0,10)+" "+date.slice(11,16)+" 마감";
    };


    return (
        <KeyboardAwareScrollView
        extraScrollHeight={20}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        >
        <Container>
                <Header>
                    <View style={styles.name}>
                        <TitleBox>
                        <Title>{title}</Title>
                        {(mode === 'STORE' && status!=="END") &&
                        <>
                        {isStar ?
                            (
                                <MaterialCommunityIcons name="star" size={40} onPress={() => _onStarPress(AuctionId)} color="yellow"
                                    style={{ position: "absolute", right: '5%', opacity: 0.7 }} />
                            )
                            : (
                                <MaterialCommunityIcons name="star-outline" size={40} onPress={() => _onStarPress(AuctionId)} color="yellow"
                                    style={{ position: "absolute", right: '5%', opacity: 0.7 }} />
                        )}
                         </>}
                        </TitleBox>
                    </View>
                        <TextBox>
                        <Text style={{fontSize: 16, paddingLeft: 3}}>{userName}</Text>
                        {(status==="PROCEEDING") && <Text>{_handleDeadline(deadline)}</Text>}
                        </TextBox>
                </Header>

                <DefaultInfo>
                    <RowItemContainer>
                        <DescTitle style={{marginTop: 10}}>단체유형 및 인원수</DescTitle>
                        <Desc>{userType===""? "" : `${userType} (${groupCnt}명)`}</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>예약시간 및 날짜</DescTitle>
                        <Desc>{reservation===""? "" : changeDateData1(reservation)}</Desc>
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
                        <Desc>{(minPrice==="" || maxPrice==="")? "" : `${minPrice}원 ~ ${maxPrice}원`}</Desc>
                    </RowItemContainer>
                    <RowItemContainer border='0'>
                        <DescTitle>추가 사항</DescTitle>
                        <Desc style={{marginBottom: 10}}>{content}</Desc>
                    </RowItemContainer>
                </DefaultInfo>
           
                <InfoContainer>
                    <RowItemContainer>
                        <DescTitle size={20} >입찰현황</DescTitle>
                    </RowItemContainer>
                    
                    <ScrollCon double={bidstoreList.length > 3}>
                        <ScrollView nestedScrollEnabled={true}>   
                    {bidstoreList.map(item => (
                        <AuctioneerCon key={item.auctioneerId}>
                        <AucLineCon>
                            <Store double onPress={() =>_pressStore(item)}><StoreText style={{color: (item.storeId===id || item.success===true)? "blue" : "black"}}>{item.storeName}</StoreText></Store>
                            <Store onPress={() => _pressStore(item)}><StoreText style={{color: (item.storeId===id || item.success===true)? "blue" : "black"}}>{item.menu}</StoreText></Store>
                            <Store onPress={() => _pressStore(item)}><StoreText style={{color: (item.storeId===id || item.success===true)? "blue" : "black"}}>{item.price}원</StoreText></Store>
                        </AucLineCon>
                        {(item.storeId===id) && finished && (
                            <DeleteButton>
                                <MaterialCommunityIcons name="delete" size={20} style={{color: "blue"}} onPress={() => _deletePress(item.auctioneerId)}/>
                            </DeleteButton>
                        )}
                        {(item.success===true)&& (
                            <CheckButton>
                                <MaterialCommunityIcons name="check" size={20} style={{color: "blue"}} />
                            </CheckButton>
                        )}
                        </AuctioneerCon>
                    ))}
                    </ScrollView>
                    </ScrollCon> 
                </InfoContainer>

                {/* Store만 ButtonContainer가 보이도록 구현 필요 이미 참여했으면 수정으로 바꾸기..? */}
                { (status!=="END" &&(mode==="STORE")) &&
                 (<ButtonContainer>
                 <Button
                     title={registered? "수정":"참여"}
                     containerStyle={{ width: '100%' }}
                     onPress={_bidButtonPress}
                 />
             </ButtonContainer>)
                }
        </Container>
        </KeyboardAwareScrollView>

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
        paddingLeft: 15,
    },
});



export default AuctionDetail;