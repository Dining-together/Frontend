import React, {useContext, useEffect} from 'react';
import {ThemeContext} from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import StoreListTab from './StoreListTab';
import StoreDetailStack from './StoreDetailStack';
import {StoreMap} from "../screens";
import {StackActions} from "@react-navigation/native";

const Stack = createStackNavigator();

const StoreListStack = ({navigation, route}) => {
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
        screenOptions={{
            headerTitleAlign: "center",
        }}>
            <Stack.Screen name="업체 목록" component={StoreListTab} 
            options={{headerBackTitle: false, headerTitleAlign: 'left',  headerTitleStyle: {fontSize: 25, fontWeight: 'bold'},}}/>
            <Stack.Screen name="StoreDetailStack" component={StoreDetailStack}
                options={{headerShown: false}} />
            <Stack.Screen name="StoreMap" component={StoreMap} 
            options={{
                headerTitle: " ",
                headerTransparent: true}} />
        </Stack.Navigator>
    );
};

export default StoreListStack;