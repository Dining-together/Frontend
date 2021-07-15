import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 15px 20px;
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


const AuctionBid = ({ navigation }) => {

    const [menuRecommend, setMenuRecommend] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [explain, setExplain] = useState("");

    const [disabled, setDisabled] = useState(false)
    const [uploaded, setUploaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("정보를 입력해주세요.");

    const didMountRef = useRef();

    const [isModal, setModal] = useState(false);



    //에러 메세지 설정 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
            if (!menuRecommend) {
                _errorMessage = "추천 메뉴를 입력하세요";
            } else if (!estimatedPrice) {
                _errorMessage = "예상 가격대를 입력하세요";
            } else if (!explain) {
                _errorMessage = "어필/설명을 입력하세요";
            }
            else {
                _errorMessage = "";
            }
            setErrorMessage(_errorMessage);

        } else {
            didMountRef.current = true;
        }
    }, [menuRecommend, estimatedPrice, explain]);

    useEffect(() => {
        setDisabled(!(menuRecommend && estimatedPrice && explain && !errorMessage));
    }, [menuRecommend, estimatedPrice, explain, errorMessage]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                disabled ? (<MaterialCommunityIcons name="check" size={35} onPress={_onPress}
                    style={{ marginRight: 10, marginBottom: 3, opacity: 0.3 }} />)
                    : (<MaterialCommunityIcons name="check" size={35} onPress={_onPress}
                        style={{ marginRight: 10, marginBottom: 3, opacity: 1 }} />)
            )
        });
    }, [disabled]);

    // 입찰등록 + 스피너 추가할 것
    const _onPress = () => {
        setUploaded(true);
        if (!disabled) {
            setMenuRecommend('');
            setEstimatedPrice("");
            setExplain("");
            setErrorMessage("아래 정보를 입력해주세요");
            setDisabled(true);
            setUploaded(false);
            navigation.navigate("AuctionDetail");
        }
    };

    return (
        <Container>
            <Title>가게 이름</Title>
            <Label>추천 메뉴</Label>
            <StyledTextInput
                value={menuRecommend}
                placeholder="추천 메뉴를 입력하세요."
                returnKeyType="done"
                maxLength={30}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                onTouchStart={() => { setModal(true); }}
                caretHidden={true}
            />
            <Modal visible={isModal} transparent={true}>
                <TouchableOpacity style={styles.background} onPress={() => setModal(false)} />
                <MenuContainer>
                    <Title size={22}>메뉴</Title>
                    {menu.map(item =>
                        <RowItemContainer onPress={() => { setMenuRecommend(item.name); setModal(false); }}>
                            <Menu><Label key={item.id}>{item.name}</Label></Menu>
                            <Menu><Label key={item.id}>{item.price}</Label></Menu>
                        </RowItemContainer>
                    )}
                </MenuContainer>
            </Modal>

            <Label>예상 가격대</Label>
            <StyledTextInput
                value={estimatedPrice}
                onChangeText={text => setEstimatedPrice(text)}
                placeholder="예상 가격대를 입력하세요."
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
            />
            <Label>어필/설명</Label>
            <StyledTextInput
                value={explain}
                onChangeText={text => setExplain(text)}
                placeholder="어필/설명를 입력하세요."
                returnKeyType="done"
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                multiline
            />
            {uploaded && disabled && <ErrorText>{errorMessage}</ErrorText>}
        </Container>
    );
};

const styles = StyleSheet.create({

    background: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
});


export const menu = [
    {
        id: 0,
        name: "메뉴 1",
        price: "4000원",
        src: "",
    },
    {
        id: 1,
        name: "메뉴 2",
        price: "8000원",
        src: "",
    },
    {
        id: 2,
        name: "메뉴 3",
        price: "5000원",
        src: "",
    },
    {
        id: 3,
        name: "메뉴 4",
        price: "9000원",
        src: "",
    },
    {
        id: 4,
        name: "메뉴 5",
        price: "6000원",
        src: "",
    },


];

export default AuctionBid;