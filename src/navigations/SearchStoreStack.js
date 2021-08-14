import React,{useContext} from 'react';
import {ThemeContext} from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import {SearchStore} from "../screens";
import StoreDetailStack from "./StoreDetailStack";

const Stack = createStackNavigator();

const SearchStoreStack = ({navigation, route}) => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator>
            <Stack.Screen name= "SearchStore" component={SearchStore} options={{headerShown: false}} initialParams={route.params}/>
            <Stack.Screen name= "StoreDetailStack" component={StoreDetailStack} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

export default SearchStoreStack;