import React, {useState} from 'react';
import {UseList} from "../utils/data";
import styled from "styled-components/native";
import {FlatList} from 'react-native';
import { SmallButton } from '../components';

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

const Item = ({item: {id, src, name, menu, desc, bidPrice, date, reviewUploaded}, onReviewPress, onUseDetail}) => {
    return (
        <UseContainer>
            <ImageContainer>
                <StyledImage source={{ uri: src }} rounded={false} />
            </ImageContainer>
            <TextContainer>
                <NameTitle>{name}</NameTitle>
                <DescText>낙찰가 {bidPrice}원</DescText>
                <DescText>메뉴 {menu}</DescText>
                <ButtonContainer>
                    <SmallButton 
                        title={reviewUploaded ? "리뷰완료" : "리뷰쓰기" }
                        onPress={onReviewPress} 
                        containerStyle={{width: '30%', height: '80%', marginRight: '4%'}}
                        disabled={reviewUploaded}
                        uploaded={reviewUploaded}
                        />
                    <SmallButton 
                        title="이용상세" 
                        onPress={onUseDetail} 
                        containerStyle={{width: '30%', height: '80%'}}/>
                </ButtonContainer>
            </TextContainer>

        </UseContainer>
    );
};


const UseManage = ({navigation}) => {
    const [data, setData] = useState(UseList);

    const _onReviewPress = () => {
        navigation.navigate("ReviewWrite");
    };

    const _onUseDetail = item => {
        navigation.navigate("OrderDetail", {name: item['id']});
    };

    return (
        <FlatList 
            horizontal={false}
            keyExtractor={item => item['id'].toString()}
            data={data}
            renderItem={({item}) => (
                <Item item={item} 
                    onReviewPress={_onReviewPress}
                    onUseDetail={() => _onUseDetail(item)}
                />

        )}/>                

    );
};


export default UseManage; 