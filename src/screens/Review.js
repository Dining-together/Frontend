import React, {useState, useEffect, useContext} from 'react';
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {changeDateData} from "../utils/common";
import {Dimensions} from "react-native";
import {UrlContext, ProgressContext} from "../contexts";



const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const List = styled.ScrollView`
    flex: 1;
`;

const InfoContainer = styled.View`
    padding: 0 1%;
    padding-top: 3%;
    padding-bottom: 3%;
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
    width: ${WIDTH*0.98}px;
    height: ${HEIGHT*0.3}px;
`;

const ReviewImageView = styled.View`
    background-color:${({theme}) => theme.imageBackground};
    width: ${WIDTH*0.98}px;
    height: ${HEIGHT*0.3}px;
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
        for(i = 0; i<5-one;i++)
        {
            list.push(<MaterialCommunityIcons name="star-outline" size={25} color="yellow"/>)
        }
    }else {
        for(i = 0; i<one;i++)
        {
            list.push(<MaterialCommunityIcons name="star" size={25} color="yellow"/>)
        }
        if((half - one*2) !== 0){
            list.push(<MaterialCommunityIcons name="star-half" size={25} color="yellow"/>)
            for(i = 0; i<5-one-1;i++)
            {
                list.push(<MaterialCommunityIcons name="star-outline" size={25} color="yellow"/>)
            }
        }else{
            for(i = 0; i<5-one;i++)
            {
                list.push(<MaterialCommunityIcons name="star-outline" size={25} color="yellow"/>)
            }
        }
    }
    return list;
};

const ReviewSet = ({review: {content, createdDate, reviewImages, score, userName}}) => {
    let images = reviewImages;
    let path = images.length!==0? images[0].path : "";
    return (
        <InfoContainer>
            <DefaultText>{changeDateData(createdDate)}</DefaultText>
            <UserInfoContainer>
                <UserContainer>
                    <TitleText>{userName}</TitleText>
                </UserContainer>
                    <StarContainer>
                        <TitleText>별점: </TitleText>
                        <Stars score={score}/>
                    </StarContainer>
            </UserInfoContainer>
            {path!=="" && (
                <ReviewImage source={{uri: path}}/>
            )}
            <MentContainer><DefaultText>{content}</DefaultText></MentContainer>
        </InfoContainer>
    );
};

const Review = ({navigation, route}) => {
    const {aurl} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const storeId = route.params.id;
    const [reviews, setReviews] = useState([]);

    const getReviewApi = async () => {
        let fixedUrl= aurl+"/auction/reviews/store/"+storeId;

        let options = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },

        };
        try {
            spinner.start();
            let response = await fetch(fixedUrl, options);
            let res = await response.json();
            var l = res.list
            if(l!==[]){
                l.map(i => console.log(i.reviewImages));
            }
            setReviews(res.list);

          } catch (error) {
            console.error(error);
          } finally {
            spinner.stop();
          }
    };

    useEffect(()=>{
        getReviewApi();
    },[]);

    return (
        <KeyboardAwareScrollView
        extraScrollHeight={20}>
            <List>
               {reviews!==[] && reviews.map(review => (
                   <ReviewSet key={review.reviewId} review={review}/>
               ))} 
            </List>
        </KeyboardAwareScrollView>
    );
};

export default Review;