import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import { Mypage_Store, Mypage_User, StoreInfo, StoreInfoChange, UserInfo, UserInfoChange, StoreManage, ReviewManage
    ,ChatManage, Bookmark, Message, AuctionDetail, AuctionBid, PayManage, UseManage, ReviewWrite, DocumentRegister,
    OrderDetail, StoreDetail, RegisterAuction, MultipleImage, StoreConvChange, StoreBasicChange, AuctionBidDetail } from "../screens";
import BidManageTab from './BidManageTab';
import AuctionDetailStack from "./AuctionDetailStack";
import {LoginContext} from "../contexts";
import LogManageTab from './LogManageTab';
import AucLogManageTab from './AucLogManageTab';
import {StackActions} from "@react-navigation/native";

const Stack = createStackNavigator();

const MypageStack = ({navigation, route}) => {
    const theme = useContext(ThemeContext);
    const {mode} = useContext(LoginContext);
    const [isUser, setIsUset] = useState(false);

    useEffect(() => {
        if(route.state!==undefined){
            console.log(route.state)
            if(route.state.index > 0) {
                navigation.dispatch(StackActions.popToTop());
            }
        }
    },[navigation]);

    return (
        <Stack.Navigator
            initialRouteName={mode==="STORE" ? "Mypage_Store" : "Mypage_User"}
            screenOptions={{
                headerTitleAlign: "center",
                cardStyle: { backgroundColor: theme.backgroundColor },
            }}>
            <Stack.Screen name="Mypage_Store" component={Mypage_Store}
                options={{ headerBackTitle: false, headerTitle: "My Page", headerTitleAlign: 'left', headerTitleStyle: { fontSize: 25, fontWeight: 'normal' }, }}
            />
            <Stack.Screen name="Mypage_User" component={Mypage_User}
                options={{ headerBackTitle: false, headerTitle: "My Page", headerTitleAlign: 'left', headerTitleStyle: { fontSize: 25, fontWeight: 'normal' }, }}
            />
            <Stack.Screen name="StoreInfo" component={StoreInfo} options={{ headerBackTitle: false, headerTitle: "?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="StoreInfoChange" component={StoreInfoChange} options={{ headerBackTitle: false, headerTitle: "?????? ?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="UserInfo" component={UserInfo} options={{ headerBackTitle: false, headerTitle: "?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="UserInfoChange" component={UserInfoChange} options={{ headerBackTitle: false, headerTitle: "?????? ?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="StoreManage" component={StoreManage} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="ReviewManage" component={ReviewManage} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="ChatManage" component={ChatManage} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="Bookmark" component={Bookmark} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="Message" component={Message} options={{ headerBackTitle: false, headerTitle: "?????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="AuctionDetail" component={AuctionDetail} options={{ headerBackTitle: false, headerTitle: "", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="BidManageTab" component={BidManageTab} options={mode === "Customer"? { headerBackTitle: false, 
                headerTitle: "?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, } : { headerBackTitle: false, 
                headerTitle: "?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="AuctionBid" component={AuctionBid} options={{ headerBackTitle: false, headerTitle: "?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="PayManage" component={PayManage} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="UseManage" component={UseManage} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="ReviewWrite" component={ReviewWrite} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} initialParams={[]}/>
            <Stack.Screen name="DocumentRegister" component={DocumentRegister} options={{ headerBackTitle: false, headerTitle: "?????? ??????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="StoreDetail" component={StoreDetail} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="RegisterAuction" component={RegisterAuction} options={{ headerBackTitle: false, headerTitle: "????????????", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="MultipleImage" component={MultipleImage} options={{ headerTitle: "",headerBackTitle: false, }} />
            <Stack.Screen name="StoreBasicChange" component={StoreBasicChange} options={{ headerTitle: "?????? ???????????? ??????", headerBackTitle: false,}} initialParams={[]} />
            <Stack.Screen name="StoreConvChange" component={StoreConvChange} options={{ headerTitle: "?????? ???????????? ??????",headerBackTitle: false, }} />
            <Stack.Screen name="LogManageTab" component={LogManageTab} options={{ headerTitle: "?????? ??????",headerBackTitle: false, }} />
            <Stack.Screen name="AucLogManageTab" component={AucLogManageTab} options={{ headerTitle: "?????? ??????",headerBackTitle: false, }} />
            <Stack.Screen name="AuctionDetailStack" component={AuctionDetailStack} options={{headerShown: false}} />
            <Stack.Screen name="AuctionBidDetail" component={AuctionBidDetail}
                options={{ headerBackTitle: false, headerTitle: "?????? ??????", headerTitleAlign: 'left' }} /> 
        </Stack.Navigator>
    );
}

export default MypageStack;