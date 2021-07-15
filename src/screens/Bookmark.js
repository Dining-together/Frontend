import React, {useState, useEffect} from 'react';
import {auctionBookmarks, storeBookmarks} from "../utils/data";
import styled from "styled-components/native";
import {FlatList} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";


const AlertContainer = styled.TouchableOpacity`
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

const TitleContainer = styled.View`
    width: 95%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

`;

const StyledImage = styled.Image`
    background-color: ${({theme}) => theme.imageBackground};
    height: 85px;
    width: 85px;
    border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

const NameTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${({theme})=> theme.text};
`;


const DescText = styled.Text`
    font-size: 15px;
    font-weight: normal;
    color: ${({theme})=> theme.text};
`;

const Item = ({item: {id, src, name, menu, type, location}, onPress, onStarPress}) => {
    return (
        <AlertContainer onPress={onPress}>
            <ImageContainer>
                <StyledImage source={{ uri: src }} rounded={false} />
            </ImageContainer>
            <TextContainer>
                <TitleContainer>
                    <NameTitle>{name}</NameTitle>
                    <MaterialCommunityIcons name="star" size={40} onPress={onStarPress} color="yellow"
                    style={{marginLeft: 15, marginTop: 5, opacity: 0.7}}/>
                </TitleContainer>
                <DescText>{menu}</DescText>
                <DescText>{type}</DescText>
                <DescText>{location}</DescText>
            </TextContainer>
        </AlertContainer>
    );
};


const Bookmark = ({navigation, route}) => {
    const [isUser, setIsUser] = useState(route.params.isUser);

    const [data, setData] = useState(storeBookmarks);


    const _onRemove = id => {
        setData(data.filter(item => item.id !== id));
    };

    useEffect(() => {
        if(isUser){
            setData(storeBookmarks);
        }else{
            setData(auctionBookmarks);
        };
    },[]);

    return (
        <FlatList 
            horizontal={false}
            keyExtractor={item => item['id'].toString()}
            data={data}
            renderItem={({item}) => (
                <Item item={item} 
                onStarPress={() => _onRemove(item['id'])}
                onPress = {() => {
                    if(!isUser){
                        navigation.navigate("AuctionDetail", {id: item['id']});
                    }else {
                        navigation.navigate("StoreDetail", {id: item['id']});
                    }
                }}
                />

        )}/>                

    );
};


export default Bookmark; 