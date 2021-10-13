import React, {useState, useContext, useEffect} from 'react';
import styled from "styled-components/native";
import {FlatList} from 'react-native';
import { SmallButton } from '../../components';
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";
import moment from "moment";

const UseContainer = styled.View`
    flex-direction: row;
    padding: 15px;
    border-bottom-width: 0.5px;
    border-top-width: 0.5px;
    border-color: ${({theme}) => theme.label};
    background-color: ${({ theme }) => theme.background};
`;

const ImageContainer = styled.View`
    align-items: center;
    justify-content: center;
    margin-right: 15px;
`;

const TextContainer = styled.View`
    flex: 1;
`;

const StyledImage = styled.Image`
    background-color: ${({theme}) => theme.imageBackground};
    height: 90px;
    width: 90px;
    border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

const NameTitle = styled.Text`
    font-size: 19px;
    font-weight: bold;
    color: ${({theme})=> theme.text};
    margin-left: 2%;
`;


const DescText = styled.Text`
    font-size: 15px;
    font-weight: normal;
    color: ${({theme})=> theme.text};
    margin: 2% 0 0 3%;
`;

const ButtonContainer = styled.View`
    flex: 1;
    flex-direction: row;
    margin: 4% 0 0 3%;

`;

const Item = ({item: {id, src, storeName, menu, price, review}, onReviewPress, onUseDetail}) => {
    return (
        <UseContainer>
            <ImageContainer>
                <StyledImage source={{ uri: src }} rounded={false} />
            </ImageContainer>
            <TextContainer>
                <NameTitle>{storeName}</NameTitle>
                <DescText>낙찰가 {price}원</DescText>
                <DescText>메뉴 {menu}</DescText>
                <ButtonContainer>
                    <SmallButton 
                        title={review ? "리뷰완료" : "리뷰쓰기" }
                        onPress={onReviewPress} 
                        containerStyle={{width: '40%', height: '80%', marginRight: '4%'}}
                        disabled={review}
                        uploaded={review}
                        />
                    
                </ButtonContainer>
            </TextContainer>

        </UseContainer>
    );
};


const UseManage = ({navigation}) => {
    const {aurl} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token} = useContext(LoginContext);

    const [list, setList] = useState([]);

    const getApi = async (url) => {


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
            let response = await fetch(url,options);
            let res = await response.json();
            

            setList(res.list);
            

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    }


    useEffect( () => {
        getApi(aurl+"/auction/user/bids");

        // 화면 새로고침
        const willFocusSubscription = navigation.addListener('focus', () => {
            getApi(aurl+"/auction/user/bids");
        });

        return willFocusSubscription;

    }, []);

    const _onReviewPress = item => {
        const moment = require('moment');
        const today = moment().format('YYYYMMDDhhmm');
        const reservation = moment(item.reservation).format('YYYYMMDDhhmm');
         
        if(reservation < today){
            navigation.navigate("ReviewWrite", {successBidId : item['successBidId']});
        }
        else{
            alert("예약 시간 후에 리뷰를 작성할 수 있습니다.");
        }
    };


    return (
        <FlatList 
            horizontal={false}
            keyExtractor={item => item['successBidId'].toString()}
            data={list}
            renderItem={({item}) => (
                <Item item={item} 
                    onReviewPress={() => _onReviewPress(item)}
                    onUseDetail={() => _onUseDetail(item)}
                />

        )}/>                

    );
};


export default UseManage; 