import React, {useState} from 'react';
import {chatrooms} from "../utils/data";
import styled from "styled-components/native";
import {FlatList} from 'react-native';
import moment from 'moment';

const AlertContainer = styled.TouchableOpacity`
    flex: 1;
    align-items: center;
    flex-direction: row;
    padding: 10px;
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
    margin-bottom: 3%;
`;

const StyledImage = styled.Image`
    background-color: ${({theme}) => theme.imageBackground};
    height: 80;
    width: 80;
    border-radius: 50px;
`;

const NameTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${({theme})=> theme.text};
`;

const TimeText = styled.Text`
    font-size: 13px;
    color: ${({theme})=> theme.text};
`;

const DescText = styled.Text`
    font-size: 15px;
    font-weight: normal;
    color: ${({theme})=> theme.text};
`;

const Alert = ({item: {id, src, name, desc, time}, onPress}) => {
    return (
        <AlertContainer onPress={onPress}>
            <ImageContainer>
                <StyledImage source={{uri: src}} />
            </ImageContainer>
            <TextContainer>
                <TitleContainer>
                    <NameTitle>{name}</NameTitle>
                    <TimeText>{getDateOrTime(time)}</TimeText>
                </TitleContainer>
                <DescText>{desc}</DescText>
                </TextContainer>
        </AlertContainer>
    );
};

const getDateOrTime = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format(now.diff(target, 'days') > 0 ? 'YY/MM/DD' : 'HH:mm' );
};

const ChatManage = ({navigation}) => {
    const [data, setData] = useState(chatrooms);

    const _handleMessagePress = item => {
        navigation.navigate("Message", {name: item.name});
    };

    return (
        <FlatList 
            horizontal={false}
            keyExtractor={item => item['id'].toString()}
            data={data}
            renderItem={({item}) => (
                <Alert key={item['id'].toString()} item={item} 
                    onPress = {() => _handleMessagePress(item)}
                />

        )}/>                

    );
};



export default ChatManage; 