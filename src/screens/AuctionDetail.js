import React, { useLayoutEffect, useState } from 'react';
import styled from "styled-components/native";
import { Text, View, StyleSheet, Dimensions} from "react-native";
import { Button } from '../components';
import { theme } from '../theme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WIDTH = Dimensions.get("screen").width;

const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.background};
    padding: 10px 0 0 0;

`;

const Header = styled.View`
    width: ${WIDTH*0.98};
    height: 12%;
    background-color: ${({ theme }) => theme.background}; 
    flex-direction: row;
`;

const Title = styled.Text`
    font-size: 30px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    align-self: flex-start;
`;

const Endtime = styled.View`
    flex: 1; 
    margin-right: 10px;
    flex-direction: column;
    justify-content: flex-end;
    alignItems: flex-end;
    margin-bottom: 5px;
`;

const InfoContainer = styled.View`
    flex: ${({ flex }) => flex ? flex : 7};
    background-color: ${({ theme }) => theme.background}; 
    justify-content: center;
    alignItems: center;
    flex-direction:column;
    margin : 15px;
    border-radius: 10px;
    border: 1px solid black;
`;


const RowItemContainer = styled.View`
    padding: 5px 10px;
    flex-direction: column;
    border-bottom-width: ${({ border }) => border ? border : 1}px;
    border-color: ${({ theme }) => theme.label}
    width: 95%;
`;

const DescTitle = styled.Text`
    font-size: ${({ size }) => size ? size : 18}px;
    font-weight: bold;
    color: ${({ theme }) => theme.text}; 
    margin-top: 5px;

`;

const Desc = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.text}; 
    margin-top: 7px;
`;

const Store = styled.View`
    flex: 1;
    padding: 5px 0px;
    justify-content: center;
    align-items: center;   
`;


const ButtonContainer = styled.View`
    flex-direction: row;
    flex: 1;
    margin : 15px;
    align-items: center;
    justify-content: center;

`;

const AuctionDetail = ({ navigation, route}) => {

    const [isStar, setIsStar] = useState(false);
    const _onStarPress = () => { setIsStar(!isStar) };
    const [isFinished, setIsFinished] = useState(false);
    const [isUser, setIsUser] = useState(false);

    const _onMessagePress = () => { navigation.navigate("Message" , {name: "닉네임"+AuctionId}) };
    
    const AuctionId = route.params.id;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerRight: () => (
                !isUser ?(<MaterialCommunityIcons name="send" size={35} onPress={_onMessagePress}
                    style={{ marginRight: 15, marginBottom: 3, marginTop: 3, opacity: 0.7 }} />) : null
            )
        });
    }, []);
    

    return (

        <Container>
            <KeyboardAwareScrollView
                extraScrollHeight={20}
                showsVerticalScrollIndicator={false}
            >
                <Header>
                    <View style={styles.name}>
                        <Title>공고 제목{AuctionId}</Title>
                        <Text>닉네임</Text>
                    </View>
                    <Endtime>
                        {isStar ?
                            (
                                <MaterialCommunityIcons name="star" size={40} onPress={_onStarPress} color="yellow"
                                    style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                            )
                            : (
                                <MaterialCommunityIcons name="star-outline" size={40} onPress={_onStarPress} color="yellow"
                                    style={{ marginLeft: 15, marginBottom: 5, opacity: 0.7 }} />
                            )}
                        <Text>마감{ }시간전</Text>
                    </Endtime>
                </Header>

                {/* 공고 조회에서 클릭시 데이터 연동 구현 필요 */}
                <InfoContainer>
                    <RowItemContainer>
                        <DescTitle>단체유형 및 인원수</DescTitle>
                        <Desc>단체유형</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>예약시간 및 날짜</DescTitle>
                        <Desc>0000년 00월 00일 00시 00분</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>선호 위치</DescTitle>
                        <Desc>00시 00구</Desc>
                    </RowItemContainer>
                    <RowItemContainer>
                        <DescTitle>선호 메뉴</DescTitle>
                        <Desc>제육볶음</Desc>
                    </RowItemContainer>
                    <RowItemContainer border='0'>
                        <DescTitle>선호 가격</DescTitle>
                        <Desc>0000000원</Desc>
                    </RowItemContainer>
                </InfoContainer>

                {/* 후에 입찰한 가게가 있을 시, 가게 수만큼 출력하도록 구현 필요  */}
                <InfoContainer flex={3}>
                    <RowItemContainer>
                        <DescTitle size={20} >입찰현황</DescTitle>
                    </RowItemContainer>
                    <View style={styles.row}>
                        <Store><Desc>가게이름1</Desc></Store>
                        <Store><Desc>추천메뉴1</Desc></Store>
                        <Store><Desc>000000원</Desc></Store>
                    </View>
                    <View style={styles.row}>
                        <Store><Desc>가게이름1</Desc></Store>
                        <Store><Desc>추천메뉴1</Desc></Store>
                        <Store><Desc>000000원</Desc></Store>
                    </View>
                    <View style={styles.row}>
                        <Store><Desc>가게이름1</Desc></Store>
                        <Store><Desc>추천메뉴1</Desc></Store>
                        <Store><Desc>000000원</Desc></Store>
                    </View>
                </InfoContainer>

                {/* Store만 ButtonContainer가 보이도록 구현 필요 이미 참여했으면 수정으로 바꾸기..? */}
                {!isFinished &&
                 (<ButtonContainer>
                 <Button
                     title="참여"
                     containerStyle={{ width: '100%' }}
                     onPress={() => {
                         navigation.navigate("AuctionBid");
                     }}
                 />
             </ButtonContainer>)
                }
               
            </KeyboardAwareScrollView>
        </Container>

    );
};

const styles = StyleSheet.create({
    name: {
        marginLeft: 20,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
    },
});

export default AuctionDetail;