import React, {useState, useContext, useEffect} from 'react';
import {chatrooms} from "../../utils/data";
import styled from "styled-components/native";
import {FlatList} from 'react-native';
import moment from 'moment';
import {UrlContext, ProgressContext, LoginContext} from '../../contexts';

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

const Alert = ({item: {roomId, user}, onPress}) => {
    return (
        <AlertContainer onPress={onPress}>
            <ImageContainer>
                <StyledImage source={{uri: user["path"]}} />
            </ImageContainer>
            <TextContainer>
                <TitleContainer>
                    <NameTitle>{user.name}</NameTitle>
                    {/* <TimeText>{getDateOrTime(time)}</TimeText> */}
                </TitleContainer>
                <DescText>클릭하여 채팅을 시작하세요</DescText>
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
    const [data, setData] = useState([]);
    const {token, mode, id} = useContext(LoginContext);
    const {curl, url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const [userName, setUserName] = useState("");
    

    const getNameApi = async() => {
        if(mode==="CUSTOMER"){
            var fixedUrl = url+"/member/customer";
        }else{
            var fixedUrl = url+"/member/store";
        }
        
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
        setUserName(res.data.name);

      } catch (error) {
        console.error(error);
      } finally {
        spinner.stop();
      }
        };

    const filterList = async(list) => {
        let users = [];
        if(mode === "STORE"){
            list.map(l => users.push({user: l.customer, roomId: l.id}));
        }else{
            list.map(l => users.push({user: l.store, roomId: l.id}));
        }
        return users;
    };

    // 채팅방 리스트 
 const getListApi = async () => {
    let fixedUrl = curl+"/chat/user_room";
    

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
        
        console.log(res.list);
        let filtered = await filterList(res.list);
        setData(filtered);
        console.log("filtered?")
        console.log(filtered);
        
      } catch (error) {
        console.error(error);
      } finally {
        spinner.stop();
      }
};

    useEffect(() => {
        getListApi();
        getNameApi();
    },[]);


    const _handleMessagePress = item => {
        navigation.navigate("Message", {name: item.user.name, id: item.user.id, path: item.user.path, type: item.user.type, roomId: item.roomId, sender: userName});
    };

    return (
        <FlatList 
            horizontal={false}
            keyExtractor={item => item.user['id'].toString()}
            data={data}
            renderItem={({item}) => (
                <Alert key={item.user['id'].toString()} item={item} 
                    onPress = {() => _handleMessagePress(item)}
                />

        )}/>                

    );
};



export default ChatManage; 