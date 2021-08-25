import React, { useLayoutEffect, useState, useEffect, useRef, useContext } from 'react';
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {LoginContext, UrlContext, ProgressContext} from "../contexts";
import { Button } from '../components';

const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 15px 20px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
      width: 100%;
      background-color: ${({ theme }) => theme.background};
      color: ${({ theme }) => theme.text};
      padding: 20px 10px;
      font-size: 16px;
      border: 1px solid ${({ theme }) => theme.inputBorder};
      border-radius: 4px;
      margin-bottom: 10px;
  `;

const Label = styled.Text`
      font-size: 16px;
      color: ${({ theme }) => theme.text}
      align-self: flex-start;
      margin-bottom:5px;
  `;

const Title = styled.Text`
    align-self: flex-start;
    font-size: ${({ size }) => size ? size : 30}px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    margin-bottom: 10px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

const MenuContainer = styled.View`
    background-color: ${({ theme }) => theme.background}; 
    justify-content: center;
    alignItems: center;
    flex-direction:column;
    margin : 40% 10px 0 10px;
    border-radius: 10px;
    border: 1px solid black;
    padding: 15px;
`;

const RowItemContainer = styled.TouchableOpacity`
    padding: 5px 10px;
    flex-direction: row;
    border-bottom-width: ${({ border }) => border ? border : 1}px;
    border-color: ${({ theme }) => theme.label}
    width: 95%;
`;

const Menu = styled.View`
    flex: 1;
    padding: 5px 0px;
    justify-content: center;
    align-items: center;   
`;


const AuctionBid = ({ navigation, route }) => {
    const {token, id}  = useContext(LoginContext);
    const {spinner}  = useContext(ProgressContext);
    const {aurl, url}  = useContext(UrlContext);

    const [menu, setMenu] = useState("");
    const [auctioneerId, setAuctionerrId] = useState("");
    const [content, setContent] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeName, setStoreName] = useState("");
    const [isMine, setIsMine] = useState(false);
    const [created, setCreated] = useState("");
    const [finished, setFinished] = useState(false);

    const [disabled, setDisabled] = useState(true)
    const [uploaded, setUploaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("정보를 입력해주세요.");
    const [isLoading, setIsLoading] = useState(false);

    const didMountRef = useRef();

    const [isModal, setModal] = useState(false);

    const [auctionId, setAuctionId] = useState(route.params.auctionId);
    const [fix, setFix] = useState(false);

    useEffect(() => {
        var p = route.params;
    
        setIsMine(p.isMine);
        setAuctionerrId(p.item.auctioneerId);
        setContent(p.item.content);
        setMenu(p.item.menu);
        setEstimatedPrice(p.item.price);
        setStoreId(p.item.storeId);
        setStoreName(p.item.storeName);
        setCreated(p.item.createdDate);
        setFinished(p.item.finished);
    },[]);


    const finishAuctionApi = async() => {
        let fixedUrl=aurl+"/auction/"+auctionId+"/end";

        let options = {
            method: 'POST',
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
            return res.success;
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    };

    // 낙찰
    const checkAuctionApi = async(id) => {
        let fixedUrl=aurl+"/auction/"+auctionId+"/success?auctionnerId="+id;

        let options = {
            method: 'POST',
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
            if(res.success){
                var r = await finishAuctionApi();
;                if(r){
                    alert("낙찰하였습니다.");
                    navigation.pop();
                }
            }
        }catch(error) {
            console.error(error);
        }finally {
            spinner.stop();
        }
    };

    useEffect(() => {
        if(auctionId!=="" && auctioneerId!==""){
            setDisabled(false);
        }
    },[auctionId, auctioneerId]);

    const checkAuctionPress = (auctioneerId) => {
        Alert.alert(
            "", "해당 업체의 입찰을 낙찰하겠습니까?",
            [{ text: "확인", 
            onPress: () => {checkAuctionApi(auctioneerId);
            navigation.pop();} },
            { text: "취소", 
            onPress: () => {} }]
        );
    };

    return (
        <Container>
            <Title>{storeName}</Title>
            <Label>추천 메뉴</Label>
            <StyledTextInput
                value={menu}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                editable={false}
            />

            <Label>예상 가격대</Label>
            <StyledTextInput
                value={String(estimatedPrice)+"원"}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                editable={false}
            />
            <Label>어필/설명</Label>
            <StyledTextInput
                value={content}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                editable={false}
                multiline
            />

            {(isMine && route.params.finished!==true) && (
                <ButtonContainer>
                <Button
                    title="낙찰"
                    containerStyle={{ width: '100%' }}
                    onPress={() => checkAuctionPress(auctioneerId)}
                    disabled={disabled}
                />
            </ButtonContainer>
            )}
        </Container>
    );
};


export default AuctionBid;