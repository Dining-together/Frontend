import React, {useState, useEffect, useContext, useLayoutEffect, useRef} from 'react';
import styled from "styled-components/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Dimensions,Text, View, ScrollView, TouchableOpacity} from "react-native";
import { Button, SmallButton } from '../../components';

import {UrlContext, ProgressContext, LoginContext} from "../../contexts";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    background-color: ${({ theme }) => theme.background};
    padding: 4%;
    flex: 1;
`;

const StarContainer = styled.View`
    flex-direction: row;    
    align-items: center;
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
    margin-top: 5%;
    height: ${HEIGHT*0.3}px;
  `;

const ReviewImage = styled.Image`
    background-color:${({theme}) => theme.imageBackground};
    height: ${HEIGHT*0.12}px;
    width: ${HEIGHT*0.12}px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({ theme }) => theme.errorText};
`;

const ReviewImages = ( { item: { uri }}) => {
    return (
        <ReviewImage source={{uri : uri}}/>
    );
};


const ReviewWrite = ({navigation, route}) => {

    const [photos, setPhotos] = useState([]);

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token, doc, id} = useContext(LoginContext);

    const [content, setContent] = useState('');
    let successBidId = route.params.successBidId;

    const [starRating, setStarRating] = useState(0);
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);

    const [errorMessage, setErrorMessage] = useState("내용을 입력해주세요.");
    const [isLoading, setIsLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const didMountRef = useRef();

    const Star = () => {
        return (
        <View style={{justifyContent: 'center', flexDirection: 'row',}}>
            {maxRating.map((item, key) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key={item}
                    onPress={() => {setStarRating(item); setIsLoading(true);}}>
                    {item <= starRating ? 
                        <MaterialCommunityIcons name="star" size={40} color="#F2EC36" /> :
                        <MaterialCommunityIcons name="star-outline" size={40} color="#F2EC36"/>}
                </TouchableOpacity>
            );
            })}
        </View>
        );
    };



    useEffect(() => {
        if (route.params.photos) {
            setPhotos(route.params.photos);
            console.log(route.params.photos);
        }
      }, [route.params.photos, photos]);

      //에러 메세지 설정 
    useEffect(() => {
        if (didMountRef.current) {
            let _errorMessage = "";
            if (!content) {
                _errorMessage = "리뷰 내용을 입력해주세요.";
            }else if(starRating === 0){
                _errorMessage = "별점을 선택해주세요.";
            }
            else {
                _errorMessage = "";
            }
            setErrorMessage(_errorMessage);

        } else {
            didMountRef.current = true;
        }
    }, [content, starRating]);

    useEffect(() => {
        setDisabled(!(content && !errorMessage && !isLoading));
    }, [content, errorMessage, isLoading]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                disabled ? (<MaterialCommunityIcons name="check" size={35} onPress={_onSavePress}
                    style={{ marginRight: 10, marginBottom: 3, opacity: 0.3 }} />)
                    : (<MaterialCommunityIcons name="check" size={35} onPress={_onSavePress}
                        style={{ marginRight: 10, marginBottom: 3, opacity: 1 }} />)
            )
        });
    }, [disabled]);

    useEffect(() => {
        setIsLoading(false);
    },[content, starRating])

    // 리뷰 post (리뷰내용 + 사진들)
    const postApi = async () => {
        let fixedUrl = url+'/auction/'+`${successBidId}`+'/review?content='+`${content}`+'&score='+`${starRating}`; 
        console.log(fixedUrl);
        let formData = new FormData();

        for (let i = 0; i < photos.length; i++) {
            let photo = photos[i];
            formData.append("files", {uri: photo.uri, name: photo.name, type: photo.type});
        }
        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-AUTH-TOKEN' : token,
            },
            body: formData,

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

    const _onSavePress = async() => {
        // 저장 완료 후 돌아가기
        try{
            spinner.start();
            const result = await postApi();

            if (!result) {
                alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
              }else {
                setUploaded(true);
                if (!disabled) {
                  setContent('');
                  setStarRating(0);
                  setPhotos([]);
                  setDisabled(true);
                  setUploaded(false);
                  setIsLoading(false);
                  navigation.navigate("UseManage");
              }else {
                  alert("오류가 발생하였습니다. 잠시후 다시 시도해주세요.");
                };
              }
        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }      
    }
    
    const _onPhotoPress = () => {
        navigation.navigate("MultipleImage",{type: "Review"});
    }


    return (
        <Container>
            
            <StarContainer>
                <Text style={{fontSize: 23, marginRight: '2%'}}>별점</Text>
                <Star />
            </StarContainer>

            <StyledTextInput
                value={content}
                placeholder="리뷰를 남겨주세요."
                returnKeyType="done"
                maxLength={30}
                multiline
                textAlignVertical={'top'}
                textContentType="none" // iOS only
                underlineColorAndroid="transparent" // Android only
                onChangeText={text => {setContent(text); setIsLoading(true);}}

            />
            {uploaded && disabled && <ErrorText>{errorMessage}</ErrorText>}
            <SmallButton 
                title="사진첨부" 
                containerStyle ={{width: '25%', marginTop: '3%'}}
                onPress={_onPhotoPress}
            />


            <ScrollView 
                style={{margin : '2%', height: HEIGHT*0.13, }} 
                contentContainerStyle={{paddingRight: 10, paddingLeft: 10, }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {photos.map(item =>
                <ReviewImage key={item.id} source={{uri : item.uri}} />
                )} 
            </ScrollView>
    
            
            
        </Container>
    );
};

export default ReviewWrite;