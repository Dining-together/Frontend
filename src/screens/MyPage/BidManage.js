import React, {useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import {View, Dimensions, FlatList, Alert} from "react-native";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";
import {changeDateData, changeEndDateData, changeListData, cutDateData} from "../../utils/common";
import { MaterialIcons } from '@expo/vector-icons'; 

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



const Item = ({item: {auctionId, title, storeType, groupType, groupCnt, deadline, addr, minPrice, maxPrice, reservation, createdDate}, 
                onPress, onChange, onRemove, isUser, onChartPress}) => {

    return (
        <View>
            <ItemContainer onPress={() => onPress(auctionId)} >
                <TimeTextContiner>
                    <ContentText>{changeDateData(reservation)} 예약</ContentText>
                    <ContentText>마감 {changeEndDateData(deadline)} 전</ContentText>
                </TimeTextContiner>
                <ItemBox>
                    <ContentTitleText>{title}</ContentTitleText>
                    {isUser && 
                        <MaterialIcons name="insert-chart-outlined" size={26}  onPress={onChartPress} 
                        style={{position:'absolute', alignSelf:'flex-end', margin: '1%'}}/>
                    }
                    <ContentText>단체 유형: {groupType} ({groupCnt}명)</ContentText>
                    <ContentText>선호 지역: {addr}</ContentText>
                    <ContentText>선호 메뉴: {changeListData(storeType)}</ContentText>
                    <ContentText style={{marginBottom: 10}}>선호 가격대: {minPrice}원 ~ {maxPrice}원</ContentText>
                    <ContentText style={{position: "absolute", right: 5, bottom: 0}}>{changeDateData(createdDate)} 등록</ContentText>
                </ItemBox>
            </ItemContainer>
            {isUser &&
            <ChangeContainer>
                <ChangeText onPress={onChange}>수정</ChangeText>
                <ChangeText onPress={onRemove}>삭제</ChangeText>
            </ChangeContainer> }
            
        </View>

    );
};

const BidManage = ({navigation, route}) => {

    const {aurl} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token,  id} = useContext(LoginContext);

    const [data, setData ] = useState([]);
    const [auctioneerId, setAuctioneerId] = useState([]);
    const [isUser, setIsUser] = useState(route.params.isUser);

    const _onAuctionPress = itemId => {navigation.navigate("AuctionDetail",{id: itemId})};


    // 입찰내역 수정으로 이동
    const _onChange = item => {
        if(isUser){
            // 공고 수정
            navigation.navigate("RegisterAuction", 
            {id: item['auctionId'], isChange : true, title: item['title'], reservation: item['reservation'],
            groupType: item['groupType'], storeType: item['storeType'], groupCnt: item['groupCnt'], 
            maxPrice: item['maxPrice'], minPrice: item['minPrice'], addr: item['addr'], content: item['content'],
            age: item['age'], gender: item['gender'], deadline: item['deadline'], fix: true });
        }
        else{
            // 입찰 수정
            navigation.navigate("AuctionBid", {id: item['id']});}
    };

    // 입찰내역 삭제 / 공고
    const _onRemove = id => {
        if(isUser)
            // 공고 삭제
            Alert.alert(
                "", "삭제하시겠습니까?",
                [{ text: "확인", onPress: () => {_onDelete(id)} },
                { text: "취소", style: "cancel" },]
              );
        else
            // 입찰 삭제
            Alert.alert(
                "", "삭제하시겠습니까?",
                [{ text: "확인", onPress: () => {_onBidDelete(id)} },
                { text: "취소", style: "cancel" },]
              );
    };

    // 공고 삭제 delete 처리
    const deleteApi = async (url) => {

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 공고 삭제 한다고 수락했을 때 delete 처리 시도
    const _onDelete = async(id) => {
        try{
            spinner.start();

            const result = await deleteApi(aurl+"/auction/"+`${id}`);

            if(!result){
                alert("다시 공고를 삭제해주세요.");
            }
            else{
                alert("공고가 삭제되었습니다.");
                getApi();
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }


    // 입찰 삭제 delete 처리
    const deleteBidApi = async (url) => {

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 입찰 삭제 한다고 수락했을 때 delete 처리 시도
    const _onBidDelete = async(id) => {
        try{
            spinner.start();

            const result = await deleteBidApi(aurl+"/auction/auctioneer/"+`${id}`);

            if(!result){
                alert("다시 시도해주세요.");
            }
            else{
                alert("입찰이 삭제되었습니다.");
                getApi();
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }


    // 진행중 공고 불러오기
    const getApi = async () => {

        let fixedUrl = (isUser ? aurl+"/auction/"+`${id}`+"/auctions" : aurl+"/auction/"+`${id}`+"/auction");
       

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
            let list = [];
            if((res.list!==[]) && (res.list !==undefined)){
                list = res.list.map( item => item.auction );
            }

           
            if(isUser){
                setData(_setLatestList(_filterProceeding(list)));
            } else {
                setData(_setLatestList(_filterProceeding(list)));
            }
        

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    }

    useEffect( () => {
        getApi();

        // 화면 새로고침(navigation 이동 후 돌아왔을 때 새로고침)
        const willFocusSubscription = navigation.addListener('focus', () => {
            getApi();
        });

        return willFocusSubscription;

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
            let array = prev.filter((obj) => obj.status === 'PROCEEDING');
            return array;
        }
};

    // 로그 분석으로 이동
    const onChartPress = (id) => {
        navigation.navigate("AucLogManageTab", {auctionId: id})
    }


    return (
        <Container>
            <BidContainer>
                {data!==undefined && (
                    <FlatList
                    horizontal={false}
                    keyExtractor={item => item['auctionId'].toString()}
                    data={data} 
                    renderItem={({item}) => (
                        <Item item={item} 
                            isUser={isUser}
                            onPress={()=> _onAuctionPress(item['auctionId'])}
                            onChange={()=> _onChange(item)}
                            onRemove={() => _onRemove(item['auctionId'])}
                            onChartPress={() => onChartPress(item['auctionId'])}
                        />
                    )}/>
                )}
            </BidContainer>

        </Container>
    );
};

export default BidManage;  