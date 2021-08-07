import React, { useLayoutEffect, useState, useEffect, useRef, useContext } from 'react';
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import {LoginContext, UrlContext, ProgressContext} from "../contexts";

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


const AuctionBid = ({ navigation, route }) => {
    const {token, id}  = useContext(LoginContext);
    const {spinner}  = useContext(ProgressContext);
    const {url}  = useContext(UrlContext);

    const [menus, setMenus] = useState([]);
    const [menuRecommend, setMenuRecommend] = useState("");
    const [estimatedPrice, setEstimatedPrice] = useState("");
    const [explain, setExplain] = useState("");

    const [disabled, setDisabled] = useState(false)
    const [uploaded, setUploaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("정보를 입력해주세요.");

    const didMountRef = useRef();

    const [isModal, setModal] = useState(false);

    const AuctionId = route.params.AuctionId;



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

    // 서버 get 처리
    const getApi = async (url) => {
        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();
            return res;

          } catch (error) {
            console.error(error);
          }
    }

    // 서버 post 처리

    const postApi = async () => {
        let fixedUrl = url+"/auction/"+`${AuctionId}`+"/auctioneer";
    
        let Info = {
            content: explain,
            menu: menuRecommend,
            price: Number(estimatedPrice),
        };
    
        let options = {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-AUTH-TOKEN' : token,
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
    };


    // 메뉴 불러오기(menus 설정)
    const menuGet = async() => {
        let fixedUrl = url+'/member/'+`${id}`+'/menus';
        
        try{
            spinner.start();
            const res =  await getApi(fixedUrl);

            if(res.success){
                setMenus(res.list);
            }
            else{
                alert("메뉴를 다시 불러와주세요.")
            }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
              
    };

    // 업체 메뉴 가져오기
    useEffect( () => {
        menuGet();
    },[])

    // 입찰등록 + 스피너 추가할 것
    const _onPress = async() => {
        try{
            spinner.start();
            const result = await postApi();
            if (!result) {
              alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
            }else {
              setUploaded(true);
              if (!disabled) {
                setMenuRecommend('');
                setEstimatedPrice("");
                setExplain("");
                setErrorMessage("아래 정보를 입력해주세요");
                setDisabled(true);
                setUploaded(false);
                navigation.navigate("AuctionDetail",{id: AuctionId});
            }else {
                alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
              };
            }
          }catch(e){
            alert("Register Error", e.message);
          }finally{
            spinner.stop();
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
                    {menus.map(item =>
                        <RowItemContainer key={item.menuId} onPress={() => { setMenuRecommend(item.name); setModal(false); }}>
                            <Menu><Label>{item.name}</Label></Menu>
                            <Menu><Label>{item.price}원</Label></Menu>
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



export default AuctionBid;