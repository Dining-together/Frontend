import React, {useState} from 'react';
import styled from "styled-components/native";
import {IconButton} from "../components";
import { images } from '../images';
import {FlatList, View, Text, ScrollView} from "react-native";
import {popular, recomendedStore} from "../utils/data";


const Header = styled.View`
    height: 12%;
    background-color: ${({theme})=> theme.titleColor}; 
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
    color: ${({theme}) => theme.text};
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
  }))`
    background-color: ${({ theme}) => theme.background};
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
  flex: 4;
  margin: 10px 10px;
`;

const RecommededView = styled.View`
  flex: 4;
  margin: 10px 10px;
`;

const LatestView = styled.View`
  flex: 3;
  margin: 10px 10px;
`;

const Desc = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({theme})=> theme.text};
`;  

const StyledImage = styled.Image`
    margin-top: 3px;
    margin-bottom: 10px;
    background-color:${({theme}) => theme.imageBackground};
    height: 80;
    width: 80;
    border-radius: ${({rounded}) => (rounded? 50 : 0)}px;
`;

const ImageContainer = styled.View`
    flex: 1.3;
`;

const DescContainer = styled.View`
    flex: 1;
    align-items: center;
`;

const RowDescContainer = styled.View`
    align-items: flex-start;
    margin-left: 20px;
    justify-content: center;
`;

const ItemContainer = styled.TouchableOpacity`
    width: 120;
    padding-top: 10;
    align-items: center;
`;

const RowItemContainer = styled.TouchableOpacity`
     padding: 5px 10px;
     flex-direction: row;
     border-bottom-width: 1px;
     border-color:  ${({theme})=> theme.label}
`;

const LatsetTimeContainer = styled.View`
    position: absolute;
    right: 0;
    top: 5px;
    `;

const LatestTime = styled.Text`
    font-size: 15px;
    font-weight: bold;
    color: ${({theme})=> theme.label}
`;

const Item = ({item: {id, userType, count, foodType, price, src}, onPress, latest}) => {
    return (
        latest ? (
            <RowItemContainer onPress={onPress}>
                <StyledImage source={{uri: src}} rounded={true}/>
                <RowDescContainer>
                <Desc>{userType} {count}명</Desc>
                <Desc>{foodType}</Desc>
                <Desc>{price}원</Desc>
                </RowDescContainer>
                <LatsetTimeContainer>
                    <LatestTime>{count}분전</LatestTime>
                </LatsetTimeContainer>
            </RowItemContainer>
        )
        : (
        <ItemContainer onPress={onPress} >
            <ImageContainer>
                <StyledImage source={{uri: src}} rounded={true}/>
            </ImageContainer>
            <DescContainer>
                <Desc>{userType} {count}명</Desc>
                <Desc>{foodType}</Desc>
                <Desc>{price}원</Desc>
            </DescContainer>
        </ItemContainer> 
        )
    );
};

const Stroe = ({item: {id, storeName, score, reviews, foodType, src}, onPress}) => {
    return (
        <ItemContainer onPress={onPress} >
            <ImageContainer>
                <StyledImage source={{uri: src}} rounded={false}/>
            </ImageContainer>
            <DescContainer>
                <Desc>{storeName}</Desc>
                <Desc>{score}({reviews})</Desc>
                <Desc>{foodType}</Desc>
            </DescContainer>
        </ItemContainer> 
    );
};


const Main = () => {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [isUser, setIsUser] = useState(true);

    const _handleNoticePress = () => {};

    const _handleSearchPress = () => {};

    const _handleItemPress = () => {};

    const _handleStorePress = () => {};

    return (
        <>
        <Header>
            <InputContainer>
            <StyledTextInput 
            value={input}
            isFocused={isFocused}
            onChangeText={text => setInput(text)}
            onSubmitEditing={_handleSearchPress}
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
                <IconButton type={images.Search} onPress={_handleSearchPress}/>
                <IconButton type={images.Notice} onPress={_handleNoticePress}/>
            </IconContainer>
        </Header>
        <ScrollView>
        <PopularView>
            <Title>실시간 인기 공고</Title>
            <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item['id'].toString()}
            data={popular}
            renderItem={({item}) => (
                <Item item={item} onPress={_handleItemPress} />
            )} />
        </PopularView>
        <RecommededView>
         {isUser
         ? (<>
            <Title>사용자 추천 가게</Title>
            <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item['id'].toString()}
            data={recomendedStore}
            renderItem={({item}) => (
                <Stroe item={item} onPress={_handleStorePress} />
            )} />
            </>
         ) 
         : (<>
            <Title>사용자 추천 공고</Title>
            <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item['id'].toString()}
            data={popular}
            renderItem={({item}) => (
                <Item item={item} onPress={_handleItemPress} />
            )} />
            </>
            )}      
        </RecommededView> 
        <LatestView>
        <Title>실시간 최신 공고</Title>
            <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item['id'].toString()}
            data={popular}
            renderItem={({item}) => (
                <Item item={item} onPress={_handleItemPress} latest={true}/>
            )} />
        </LatestView>
           
        
        </ScrollView>
        </>
    );
};


export default Main;