import React, { useState, useEffect, useContext } from 'react';
import styled from "styled-components/native";
import { IconButton } from "../components";
import { images } from '../images';
import { FlatList, ScrollView, Dimensions } from "react-native";
import { popular, recomendedStore, StoreList } from "../utils/data";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemeContext } from "styled-components";
import {LoginContext, UrlContext, ProgressContext} from "../contexts";
import {_sortLatest, cutDateData, changeListData, createdDate, changeCreatedDateData, removeWhitespace, _sortPopular} from "../utils/common";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const BackCon = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const Header = styled.View`
    height: ${HEIGHT*0.1};
    background-color: ${({ theme }) => theme.titleColor}; 
    justify-content: center;
    flex-direction:row;
`;

const IconContainer = styled.View`
    flex:3;
    height: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`;

const InputContainer = styled.View`
    flex: 7;
    justify-content: center;
`;

const Title = styled.Text`
    font-size: 25px;
    font-weight: bold;
    padding-left: 3%;
    color: ${({ theme, isLoading }) => isLoading? theme.background: theme.text};
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    height: 65%;
    font-size: 16px;
    border: 1px solid
      ${({ theme, isFocused }) => (isFocused ? theme.text : theme.inputBorder)};
    border-radius: 4px;
    margin-left: 10px;
    padding: 0 10px;
  `;

const PopularView = styled.View`
  flex: 2;
  margin: 10px 0px;
`;

const LatestView = styled.View`
  flex: 3;
  margin-top: 10px;
`;

const Desc = styled.Text`
  font-size: ${({ size }) => size ? size : 18}px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-right:  ${({ marginRight }) => marginRight ? marginRight : 0}px;
`;

const StyledImage = styled.Image`
    margin-top: 3px;
    margin-bottom: 10px;
    background-color:${({ theme }) => theme.imageBackground};
    height: 80;
    width: 80;
    border-radius: ${({ rounded }) => (rounded ? 50 : 0)}px;
`;

const ImageContainer = styled.View`
    align-items: center;
    justify-content: center;
`;

const DescContainer = styled.View`
    flex: 1;
    align-items: center;
`;

const RowDescContainer = styled.View`
    align-items: flex-start;
    margin-left: 20px;
    justify-content: center;
    margin-top: 5px;
    margin-bottom: 5px;
    width: 50%;
`;

const ItemContainer = styled.TouchableOpacity`
    width: ${WIDTH*0.35};
    padding-top: 10;
    align-items: center;
`;

const ReviewContatiner = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RowItemContainer = styled.TouchableOpacity`
     padding: 5px 10px;
     flex-direction: row;
     border-bottom-width: 1px;
     border-color:  ${({ theme }) => theme.label}
     margin-left: 3%;
     align-items: center;
`;

const LatsetTimeContainer = styled.View`
    position: absolute;
    right: 5%;
    top: 5%;
    `;

const LatestTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    margin-bottom: 3px;
  `;
    
const LatestTime = styled.Text`
    font-size: 15px;
    font-weight: bold;
    color: ${({ theme, notTime }) => notTime? theme.text : theme.label}
`;

const Item = React.memo(({ item: {auctionId, auctioneers, content, createdDate, deadline, maxPrice, minPrice, reservation, status, storeType, title, updatedDate, userName, groupType, groupCnt, addr, age, gender, path}, onPress, latest }) => {
    return (
        latest ? (
            <RowItemContainer onPress={onPress}>
                <StyledImage source={{ uri: path }} rounded={true} />
                <RowDescContainer>
                    <LatestTitle>{title}</LatestTitle>
                    <LatestTime notTime>{groupType} {groupCnt}명</LatestTime>
                    <LatestTime notTime>{changeListData(storeType)}</LatestTime>
                    <LatestTime notTime>{minPrice}원 ~ {maxPrice}원</LatestTime>
                </RowDescContainer>
                <LatsetTimeContainer>
                    <LatestTime>{changeCreatedDateData(createdDate)} 전</LatestTime>
                </LatsetTimeContainer>
            </RowItemContainer>
        )
            : (
                <ItemContainer onPress={onPress} >
                    <ImageContainer>
                        <StyledImage source={{ uri: path }} rounded={true} />
                    </ImageContainer>
                    <DescContainer>
                        <Desc>{title}</Desc>
                        <Desc size={14}>{groupType} {groupCnt}명</Desc>
                        <Desc size={14}>{(changeListData(storeType).length < 12)? changeListData(storeType) : changeListData(storeType).slice(0,10)+"..."}</Desc>
                    </DescContainer>
                </ItemContainer>
            )
    );
});

const Store = ({ item: { id, storeName, score, reviews, foodType, path }, onPress, theme }) => {
    return (
        <ItemContainer onPress={onPress} >
            <ImageContainer>
                <StyledImage source={{ uri: path }} rounded={false} />
            </ImageContainer>
            <DescContainer>
                <Desc>{storeName}</Desc>
                <ReviewContatiner>
                    <MaterialCommunityIcons name="star" size={25} style={{ color: theme.starColor, marginRight: 2 }} />
                    <Desc marginRight={2}>{score}</Desc>
                    <Desc size={15}>({reviews})</Desc>
                </ReviewContatiner>
                <Desc>{foodType}</Desc>
            </DescContainer>
        </ItemContainer>
    );
};


const Main = ({ navigation }) => {
    const theme = useContext(ThemeContext);
    const { aurl, url} = useContext(UrlContext);
    const {allow, autoLogin, doc, mode, token} = useContext(LoginContext);
    const {spinner} = useContext(ProgressContext);

    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [auctionData, setAuctionData] = useState("first");
    const [latestAuctions, setLatestAuctions] = useState("first");
    const [popularAuctions, setPopularAuctions] = useState("first");
    const [isLoading, setIsLoading] = useState(true);

    const _handleNoticePress = () => { navigation.navigate("Notice") };

    const _handleSearchPress = () => { 
        navigation.navigate("SearchTab", {input: removeWhitespace(input)});
        setInput("");
     };

    const _handleItemPress = item => {
        navigation.navigate('AuctionDetail', { id: item.auctionId })
    };

    const _handleStorePress = item => {
        navigation.navigate('StoreDetail', { id: item.id, name: item.storeName })
    };

    const handleAuctionApi = async () => {
        let fixedUrl = aurl+"/auction/auctions";

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token,
            },
        };

        try {
            setIsLoading(true);
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            var a = await _sortLatest(res.list);
            var b = await _sortPopular(res.list);
            setLatestAuctions(a.reverse().slice(0,10));
            setPopularAuctions(b.slice(0,10));
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
            setIsLoading(false);
        }
    };

    useEffect(()=> {
        handleAuctionApi();
       
    },[]);


    return (
        <BackCon>
            <Header>
                <InputContainer>
                    <StyledTextInput
                        value={input}
                        isFocused={isFocused}
                        onChangeText={text => setInput(text)}
                        onSubmitEditing={() =>_handleSearchPress()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="검색하세요."
                        returnKeyType="done"
                        autoCorrect={false}
                        textContentType="none" // iOS only
                        underlineColorAndroid="transparent" // Android only
                    />
                </InputContainer>
                <IconContainer>
                    <IconButton type={images.Search} onPress={_handleSearchPress} />
                    <IconButton type={images.Notice} onPress={_handleNoticePress} />
                </IconContainer>
            </Header>

            {!isLoading &&
                <>       
                <PopularView>
                    <Title isLoading={isLoading}>실시간 인기 공고</Title>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {popularAuctions!=="first" && popularAuctions.map(item => (
                            <Item item={item} onPress={() => _handleItemPress(item)} key={item.id}/>
                        ))}
                    </ScrollView>
                </PopularView>


                <LatestView>
                    <Title isLoading={isLoading}>실시간 최신 공고</Title>
                    <ScrollView>
                        {latestAuctions!=="first" && latestAuctions.map(item => (
                            <Item item={item} onPress={() => _handleItemPress(item)} latest={true} key={item.id}/>
                        ))}
                    </ScrollView>
                 </LatestView>
                      
                </>}
              


            
        </BackCon>
    );
};


export default Main;