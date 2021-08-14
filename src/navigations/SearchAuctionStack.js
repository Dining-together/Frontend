import React,{useContext} from 'react';
import {ThemeContext} from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import {SearchAuction} from "../screens";
import AuctionDetailStack from './AuctionDetailStack';

const Stack = createStackNavigator();

const SearchAuctionStack = ({navigation, route}) => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator>
            <Stack.Screen name= "SearchAuction" component={SearchAuction} options={{headerShown: false}} initialParams={route.params}/>
            <Stack.Screen name= "AuctionDetailStack" component={AuctionDetailStack} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

export default SearchAuctionStack;