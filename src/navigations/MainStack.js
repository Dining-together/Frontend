import React, { useContext, useEffect } from 'react';
import { ThemeContext } from "styled-components/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Main, StoreDetail, Message, Notice, Review, AuctionDetail, AuctionBid } from "../screens";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AuctionDetailStack from './AuctionDetailStack';
import SearchTab from './SearchTab';
import StoreDetailStack from './StoreDetailStack';
import {StackActions} from "@react-navigation/native";

const Stack = createStackNavigator();

const MainStack = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);
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
            initialRouteName="Main"
            screenOptions={{
                headerTitleAlign: "left",
                cardStyle: { backgroundColor: theme.background },
                headerBackTitleVisible: false,
                headerBackImage: () => {
                    return (
                        <MaterialCommunityIcons name="keyboard-backspace" size={30} />
                    );
                },
            }}>
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
            <Stack.Screen name="StoreDetail" component={StoreDetailStack}
                options={{headerShown: false}} />
            <Stack.Screen name="AuctionDetail" component={AuctionDetailStack}
                options={{headerShown: false}} />
            <Stack.Screen name="Message" component={Message} options={{ headerTitle: "" }} />
            <Stack.Screen name="Notice" component={Notice} options={{ headerTitle: "알림 목록", headerTitleAlign: 'left', headerTitleStyle: { fontSize: 25, fontWeight: 'bold' } }} />
            <Stack.Screen name="SearchTab" component={SearchTab}  options={{
                headerTitle: " ",
                headerTransparent: true}} />
            </Stack.Navigator>
    );
};

export default MainStack;