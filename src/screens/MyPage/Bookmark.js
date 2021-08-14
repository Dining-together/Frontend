import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import {FlatList} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { LoginContext, ProgressContext, UrlContext } from '../../contexts';
import {_changeTypeKorean, changeListData, cutDateData} from "../../utils/common";
import { localeData } from 'moment';



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

const Item = ({item: {id, src, name, menu, type, location}, onPress, onStarPress, isUser}) => {
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
                { !isUser && (<DescText>{changeListData(menu)}</DescText>)}
                <DescText>{_changeTypeKorean(type)}</DescText>
                <DescText>{location}</DescText>
            </TextContainer>
        </AlertContainer>
    );
};


const Bookmark = ({navigation, route}) => {
    const {token} = useContext(LoginContext);
    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext)
    const [isUser, setIsUser] = useState(route.params.isUser);

    const [data, setData] = useState([]);
    const [stores, setStores] = useState([]);
    const [auctions, setAuctions] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    let newadd = [];


    // 즐겨찾기 list 가져오기
    const getApi = async () => {
        let fixedUrl;

        if(isUser){
            fixedUrl = url+"/member/favorites/customer";
        }
        else{
            fixedUrl = url+"/member/favorites/store";
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

            setData(res.list);

            //console.log(data);
            
            return (res.success);

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
            setIsLoading(true);
            setIsDeleted(false);
          }
    };


    // 즐겨찾기 해당되는 업체 정보 가져오기
    const getStoreApi = async (id) => {
        let fixedUrl = url+'/member/store/'+`${id}`;
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

            const store = {
                id: res.data.id,
                name : res.data.name,
                type : res.data.storeType,
                location : res.data.addr,
            }
            newadd.push(store);

            setStores(newadd);

            
            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    };

    console.log(stores);

    // 즐겨찾기 해당되는 경매 정보 가져오기
    const getAuctionApi = async (id) => {
        let fixedUrl = url+'/auction/'+`${id}`;
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

            const data = res.data;
            
            const auction = {
                id : data.auctionId,
                name : data.title,
                menu : data.storeType,
                type : data.groupType + " " + data.groupCnt + "명",
                location : data.addr,
            };

            newadd.push(auction);

            setStores(newadd);

            setAuctions(auction);

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    };

    // 즐겨찾기 삭제 delete 처리
    const deleteApi = async (id) => {

        let fixedUrl = url+"/member/favorites";

        let Info;

        if(isUser){
            Info = {
                favoritesType: "STORE",
                objectId: id,
            }
        }
        else{
            Info = {
                favoritesType: "AUCTION",
                objectId: id,
            };
        }

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
            console.log(res);
            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 즐겨찾기 삭제 한다고 수락했을 때 delete 처리 시도
    const _onRemove = async (id) => {
        try{
            spinner.start();

            const result = await deleteApi(id);

            if(!result){
                alert("다시 시도해주세요");
            }
            else{
                setData([]);
                setIsDeleted(true);
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }



    useEffect( () => {
        getApi();
        if(isLoading){
            if(isUser){
                let list = data.map( item => item.storeId);
                list.map(item => getStoreApi(item));
                
            }else{
                let list = data.map( item => item.auctionId );
                list.map(item => getAuctionApi(item));  
            }
        }
        
    },[isLoading, isDeleted]);

    return (
        <>
        <FlatList 
            horizontal={false}
            keyExtractor={item => item['id'].toString()}
            data={ isUser ? stores : auctions }
            renderItem={({item}) => (
                <Item item={item} isUser = {isUser}
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
        </>            

    );
};


export default Bookmark; 