import React, { useContext, useState } from 'react';
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


const Stack = createStackNavigator();

const MypageStack = () => {
    const theme = useContext(ThemeContext);
    const {mode} = useContext(LoginContext);
    const [isUser, setIsUset] = useState(false);
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
            <Stack.Screen name="StoreInfo" component={StoreInfo} options={{ headerBackTitle: false, headerTitle: "회원 정보", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="StoreInfoChange" component={StoreInfoChange} options={{ headerBackTitle: false, headerTitle: "회원 정보 수정", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="UserInfo" component={UserInfo} options={{ headerBackTitle: false, headerTitle: "회원 정보", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="UserInfoChange" component={UserInfoChange} options={{ headerBackTitle: false, headerTitle: "회원 정보 수정", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="StoreManage" component={StoreManage} options={{ headerBackTitle: false, headerTitle: "업체관리", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="ReviewManage" component={ReviewManage} options={{ headerBackTitle: false, headerTitle: "리뷰관리", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="ChatManage" component={ChatManage} options={{ headerBackTitle: false, headerTitle: "채팅관리", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="Bookmark" component={Bookmark} options={{ headerBackTitle: false, headerTitle: "즐겨찾기", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="Message" component={Message} options={{ headerBackTitle: false, headerTitle: "메세지", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="AuctionDetail" component={AuctionDetail} options={{ headerBackTitle: false, headerTitle: "", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="BidManageTab" component={BidManageTab} options={mode === "Customer"? { headerBackTitle: false, 
                headerTitle: "공고 관리", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, } : { headerBackTitle: false, 
                headerTitle: "입찰 내역", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="AuctionBid" component={AuctionBid} options={{ headerBackTitle: false, headerTitle: "공고 수정", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="PayManage" component={PayManage} options={{ headerBackTitle: false, headerTitle: "결제관리", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="UseManage" component={UseManage} options={{ headerBackTitle: false, headerTitle: "이용내역", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="ReviewWrite" component={ReviewWrite} options={{ headerBackTitle: false, headerTitle: "리뷰쓰기", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} initialParams={[]}/>
            <Stack.Screen name="DocumentRegister" component={DocumentRegister} options={{ headerBackTitle: false, headerTitle: "서류 등록", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ headerBackTitle: false, headerTitle: "이용상세", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="StoreDetail" component={StoreDetail} options={{ headerBackTitle: false, headerTitle: "가게상세", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="RegisterAuction" component={RegisterAuction} options={{ headerBackTitle: false, headerTitle: "공고수정", headerTitleAlign: 'center', headerTitleStyle: { fontSize: 20, fontWeight: 'normal' }, }} />
            <Stack.Screen name="MultipleImage" component={MultipleImage} options={{ headerTitle: "",headerBackTitle: false, }} />
            <Stack.Screen name="StoreBasicChange" component={StoreBasicChange} options={{ headerTitle: "업체 기본정보 수정", headerBackTitle: false,}} initialParams={[]} />
            <Stack.Screen name="StoreConvChange" component={StoreConvChange} options={{ headerTitle: "업체 편의정보 수정",headerBackTitle: false, }} />
            <Stack.Screen name="LogManageTab" component={LogManageTab} options={{ headerTitle: "로그 분석",headerBackTitle: false, }} />
            <Stack.Screen name="AucLogManageTab" component={AucLogManageTab} options={{ headerTitle: "로그 분석",headerBackTitle: false, }} />
            <Stack.Screen name="AuctionDetailStack" component={AuctionDetailStack} options={{headerShown: false}} />
            <Stack.Screen name="AuctionBidDetail" component={AuctionBidDetail}
                options={{ headerBackTitle: false, headerTitle: "입찰 상세", headerTitleAlign: 'left' }} /> 
        </Stack.Navigator>
    );
}

export default MypageStack;