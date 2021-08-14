import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Dimensions, FlatList, Alert} from "react-native";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";
import {changeDateData, cutDateData} from "../../utils/common";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const InfoContainer = styled.View`
    background-color: ${({ theme }) => theme.background};
    padding: 0 1%;
    padding-top: 3%;
    padding-bottom: 3%;
`;

const Row = styled.View`
    flex-direction: row;
`;

const UserImage = styled.Image`
    background-color:${({theme}) => theme.imageBackground};
    height: ${HEIGHT*0.3*0.15}px;
    width: ${HEIGHT*0.3*0.15}px;
    border-radius: 50px;
    margin-right: 4%;
`;

const ReviewImage = styled.Image`
    background-color:${({theme}) => theme.imageBackground};
    width: ${({width}) => width ? width : WIDTH*0.49}px;
    height: ${({height}) => height ? height : HEIGHT*0.3}px;
`;

const DefaultText = styled.Text`
    font-size: 15px;
    color: ${({theme})=> theme.label};
    font-weight: bold;
`;

const TitleText = styled.Text`
    font-size: 18px;
    color: ${({theme})=> theme.text};
    font-weight: bold;
`;

const UserInfoContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: 2% 1%;
    align-items: center;
`;

const UserContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const MentContainer = styled.View`
    background-color:${({theme}) => theme.background};
    border-width: 1px;
    height: ${HEIGHT*0.1}px;
    padding: 2%;
    margin: 1% 0;
`;

const StarContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const ChangeContainer = styled.View`
    flex: 1; 
    align-items: flex-end;
    justify-content: flex-end;
    margin-bottom: 5px;
    flex-direction: row;
`;

const ChangeText = styled.Text`
    font-weight: bold;
    font-size: 16px;
    color: ${({theme})=> theme.titleColor};
    margin-right: 5px;
`;

const Stars = ({score}) => {
    var list = [];
    var one = parseInt(score);
    var half = parseInt(score/0.5); 
    let i = 0;
    if(score % 2 == 0){
        for(i = 0; i<one;i++)
        {
            list.push(<MaterialCommunityIcons name="star" size={25} color="yellow"/>)
        }
    }else {
        for(i = 0; i<one;i++)
        {
            list.push(<MaterialCommunityIcons name="star" size={25} color="yellow"/>)
        }
        if((half - one*2) !== 0){
            list.push(<MaterialCommunityIcons name="star-half" size={25} color="yellow"/>)
        }
    }
    return list;
};

const ReviewImageSet = ({reviewImages}) => {
    let number = reviewImages.length;
    const _show = () => {
        let show;
        switch(number){
            case 0:
                show = (<></>) ;
                break;
            case 1:
                show = (<ReviewImage key={0} source={{uri: reviewImages[0].path}} width = {WIDTH*0.98}/>);
                break;
            case 2: 
                show=
                (<Row>
                    <ReviewImage key={0} source={{uri: reviewImages[0].path}} />
                    <ReviewImage key={1} source={{uri: reviewImages[1].path}} />
                </Row>);
                break;
            case 3:
                show=
                (<Row>
                    <ReviewImage key={0} source={{uri: reviewImages[0].path}} />
                    <>
                        <ReviewImage key={1} source={{uri: reviewImages[1].path}} height = {HEIGHT*0.15}/>
                        <ReviewImage key={2} source={{uri: reviewImages[2].path}} height = {HEIGHT*0.15}/>
                    </>
                </Row>);
                break;
                case 4:
                show=
                (<Row>
                    <>
                        <ReviewImage key={0} source={{uri: reviewImages[0].path}} height = {HEIGHT*0.15}/>
                        <ReviewImage key={1} source={{uri: reviewImages[1].path}} height = {HEIGHT*0.15}/>
                    </>
                    <>
                        <ReviewImage key={2} source={{uri: reviewImages[2].path}} height = {HEIGHT*0.15}/>
                        <ReviewImage key={3} source={{uri: reviewImages[3].path}} height = {HEIGHT*0.15}/>
                    </>
                </Row>);

        }
        return show;
    }
    return(
        _show()
    );
};



const ReviewSet = ({review: {reviewId, createdDate, userName, score, content, path, userSrc, reviewImages}, onChange, onRemove, isUser }) => {
    return (
        <InfoContainer>
            <DefaultText>{changeDateData(createdDate)}</DefaultText>
            { isUser &&
            <ChangeContainer>
                {/* <ChangeText onPress={onChange}>수정</ChangeText> */}
                <ChangeText onPress={onRemove}>삭제</ChangeText>
            </ChangeContainer> }
            <UserInfoContainer>
                <UserContainer>
                    <UserImage source={{uri: userSrc}}/>
                    <TitleText>{userName}</TitleText>
                </UserContainer>
                <StarContainer>
                    <TitleText>별점: </TitleText>
                    <Stars score={score}/>
                </StarContainer>
            </UserInfoContainer>
            <ReviewImageSet key ={reviewId} reviewImages={reviewImages}/>
            <MentContainer><DefaultText>{content}</DefaultText></MentContainer>
        </InfoContainer>
    );
};

const ReviewManage = ({navigation, route}) => {
    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token,  id} = useContext(LoginContext);

    const [reviews, setReviews] = useState([]);

    const [isUser, setIsUser] = useState(route.params.isUser);

    // 최신순
    const _setLatestList = (prev) => {
        if(prev!==undefined){
            prev = prev.sort(function (a,b){
                return Number(cutDateData(b.createdDate)) - Number(cutDateData(a.createdDate));
            });
        }else {
            prev = [];
        }
        return prev;
    };

    // 리뷰 가져오기
    const getApi = async () => {

        let fixedUrl = url+"/auction/reviews/"+`${isUser ? 'user' : 'store'}`+"/"+`${id}`

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },

        };
        try {
            spinner.start();
            let response = await fetch(fixedUrl,options);
            let res = await response.json();
            console.log(res);

            setReviews(res.list);

            return res["success"];

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    }

     // 리뷰 삭제 delete 처리
     const deleteApi = async (url) => {

        console.log(url);

        let options = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN' : token
            },
        };
        try {
            let response = await fetch(url,options);
            let res = await response.json();

            return res["success"];

          } catch (error) {
            console.error(error);
          }
    }

    // 리뷰 삭제 처리
    const _onDelete = async(reviewId) => {
        try{
            spinner.start();

            const result = await deleteApi(url+"/auction/review/"+`${reviewId}`);

            if(!result){
                alert("다시 시도해주세요.");
            }
            else{
                alert("리뷰가 삭제되었습니다.");
                getApi();
            }

        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }
    }

    // 리뷰 삭제 클릭
    const _handleDeletePress = (reviewId) => {
        Alert.alert(
            "", "정말 삭제하시겠습니까?",
            [{ text: "확인", 
            onPress: () => {_onDelete(reviewId);} },
            {
                text: "취소", style: "cancel"
            },
            ]
          );

    }

    useEffect( () => {
        getApi();
    }, []);


    return (
        <FlatList 
            keyExtractor={item => item['reviewId'].toString()}
            data={_setLatestList(reviews)}
            renderItem={({item}) => (
                <ReviewSet key = {item['reviewId'].toString()} review={item} 
                    isUser={isUser}
                    onRemove={() => _handleDeletePress(item['reviewId'])}/>
            )}/>
    );
};

export default ReviewManage; 