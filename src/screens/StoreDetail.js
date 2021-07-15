import React,{useState, useRef, useContext,useLayoutEffect} from 'react';
import styled, {ThemeContext} from "styled-components/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Dimensions} from "react-native";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Button} from "../components";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color:${({theme}) => theme.background};
`;

const HEIGHT = Math.round(Dimensions.get("window").height * 0.4);
const WINDOW_WIDTH =  Dimensions.get('window').width;
const WIDTH = Math.round(WINDOW_WIDTH * 0.95);

const StyledImage = styled.Image`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background-color:${({theme}) => theme.imageBackground};
    border-radius: 10px;
`;

const DescInfoContainer = styled.View`
    flex: 1;
    width: 80%;
    align-self: center;
    margin-bottom: 20px;
`;

const InfoBox = styled.View`
    flex: 1;
    width: 95%;
    background-color:${({theme}) => theme.textBackground};
    border-bottom-right-radius: ${({isLast}) => isLast? 10 : 0}px;
    border-bottom-left-radius: ${({isLast}) => isLast? 10 : 0}px;
    border-top-right-radius: ${({isFirst}) => isFirst? 10 : 0}px;
    border-top-left-radius: ${({isFirst}) => isFirst? 10 : 0}px;
    margin-bottom: ${({isLast}) => isLast? 20 : 0}px;
`;

const DesTextBox = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 5%;
`;

const DesContainer = styled.View`
    width: 100%;
    height: 35%;
    background-color:${({theme}) => theme.opacityBackground};
    position: absolute;
    bottom: 0;
    border-bottom-right-radius:10px;
    border-bottom-left-radius:10px;
    padding-top: 4%;
    padding-bottom: 4%;
`;

const FirstInfo = styled.View`
    flex: 1;
    padding: 20px 0px;
    justify-content: center;
    align-items: center;   
`;

const SecondInfo = styled.View`
    flex: 1;
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.text};
    padding: 20px 0px;
    justify-content: center;
    align-items: center;  
`;

const ThirdInfo = styled.View`
    flex: 1;
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.text};
    padding: 20px 0px;
    justify-content: center;
    align-items: center; 
    
`;

const InfoText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${({theme}) => theme.text};
`;

const InfoTextContainer = styled.View`  
    flex-direction: row;
`;

const Title = styled.Text`
    font-size: 25px;
    font-weight: bold;
    color: ${({theme}) => theme.background};
`;

const DesText = styled.Text`
    font-size: 17px;
    font-weight: bold;
    opacity: 0.6;
    color: ${({theme}) => theme.background};
    margin-top: 5px;
    margin-left: 10px;
`;

const StarContainer = styled.View`
    width: 100%;
    height: 35%;
    position: absolute;
    top: 0;
`;

const ReviewButton = styled.TouchableOpacity`

`;

const StoreImage = ({item: {id, src, des}, onStarPress, isStar,theme, onReviewPress, storeId}) => {
    return (
        <>
            <StyledImage source={{uri: src}} />
            <StarContainer>
                {isStar? 
                (
                    <MaterialCommunityIcons name="star" size={40} onPress={onStarPress} color="yellow"
              style={{marginLeft: 15, marginTop: 5, opacity: 0.7}}/>
                ) 
                : (
                    <MaterialCommunityIcons name="star-outline" size={40} onPress={onStarPress} color="yellow"
              style={{marginLeft: 15, marginTop: 5, opacity: 0.7}}/>
                )}
            </StarContainer>
            <DesContainer>
                <DesTextBox>
                    <Title>가게 이름{storeId}</Title>
                    <ReviewButton onPress={onReviewPress}><Title>리뷰 별점</Title></ReviewButton>
                </DesTextBox>
                <DesTextBox>
                    <DesText>한식</DesText>
                    <ReviewButton onPress={onReviewPress}><DesText>리뷰 수</DesText></ReviewButton>
                </DesTextBox>
            </DesContainer>
        </>
    );
};

const StoreDetail = ({navigation, route}) => {
    const theme = useContext(ThemeContext);

    const carouselRef = useRef();
    const [indexSelected, setIndexSelected] = useState(0);
    const [isUser, setIsUset] = useState(true);

    const onSelect = indexSelected => {
        setIndexSelected(indexSelected);
    };

    const [id, setId] = useState(route.params.id);
    //id로  이미지 및 정보 불러옴

    const [isStar, setIsStar] = useState(false);
    
    const _onMessagePress = () => {navigation.navigate("Message", {name: "가게 이름"+id})};

    const _onStarPress = () => {setIsStar(!isStar)};

    const _onReviewPress = () => {navigation.navigate("Review",{id: id})};

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerRight: () => (
                isUser ?(<MaterialCommunityIcons name="send" size={35} onPress={_onMessagePress}
                    style={{ marginRight: 15, marginBottom: 3, marginTop: 3, opacity: 0.7 }} />) : null
            )
        });
    }, []);
    
   
     return (
        <KeyboardAwareScrollView
        extraScrollHeight={20}
        >
        <Container>
            
           <Carousel 
           layout="default"
           ref={carouselRef}
           data={photos}
           renderItem={({item}) => (
                <StoreImage item={item} onReviewPress={_onReviewPress} onStarPress={_onStarPress} isStar={isStar} theme={theme} storeId={id}/>
            )}
            sliderWidth={WIDTH}
            itemWidth={WIDTH}
            onSnapToItem={index => onSelect(index)}
           />
           <Pagination 
            inactiveDotColor={theme.label}
            dotColor={theme.titleColor}
            activeDotIndex={indexSelected}
            dotsLength={photos.length}
            animatedDuration={50}
            inactiveDotScale={1}
           />

           <InfoBox isFirst={true}>
               <InfoTextContainer>
                    <FirstInfo><InfoText>메뉴</InfoText></FirstInfo>
                    <SecondInfo><InfoText>대표메뉴1</InfoText></SecondInfo>
                    <ThirdInfo><InfoText>000원</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>
           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText></InfoText></FirstInfo>
                    <SecondInfo><InfoText>대표메뉴2</InfoText></SecondInfo>
                    <ThirdInfo><InfoText>000원</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>
           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>위치</InfoText></FirstInfo>
                    <SecondInfo><InfoText></InfoText></SecondInfo>
                    <ThirdInfo><InfoText>주소</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>
           <InfoBox>
                <InfoTextContainer>
                    <FirstInfo><InfoText>연락처</InfoText></FirstInfo>
                    <SecondInfo><InfoText></InfoText></SecondInfo>
                    <ThirdInfo><InfoText>번호</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>
           <InfoBox isLast={true}>
                <InfoTextContainer>
                    <FirstInfo><InfoText>최대 인원</InfoText></FirstInfo>
                    <SecondInfo><InfoText></InfoText></SecondInfo>
                    <ThirdInfo><InfoText>000</InfoText></ThirdInfo>
               </InfoTextContainer>
           </InfoBox>
           
            <InfoBox isFirst={true}>
                    <InfoTextContainer>
                    <FirstInfo><InfoText>추가 설명</InfoText></FirstInfo>
                    <SecondInfo><InfoText></InfoText></SecondInfo>
                    <ThirdInfo><InfoText></InfoText></ThirdInfo>
                    </InfoTextContainer>
            </InfoBox>
            <InfoBox isLast={true}>
                <DescInfoContainer>
                    <InfoText>{text}</InfoText>
                </DescInfoContainer>
                
            </InfoBox>
            
           

        </Container>
        </KeyboardAwareScrollView>
    );
};
var text = "One\nTwo\nThree";
const photos = [
    {
        id: 0,
        src: "",
        des: "찌개"
    },
    {
        id: 1,
        src: "",
        des: "고기"
    },
    {
        id: 2,
        src: "",
        des: "밥"
    },
    {
        id: 3,
        src: "",
        des: "반찬"
    },
    {
        id: 4,
        src: "",
        des: "물"
    },
]; 

export default StoreDetail;