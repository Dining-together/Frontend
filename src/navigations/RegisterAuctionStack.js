import React, {useContext} from 'react';
import {ThemeContext} from "styled-components/native";
import { createStackNavigator } from '@react-navigation/stack';
import RegisterAuction from "../screens/RegisterAuction";
import Main from "../screens/Main";

const Stack = createStackNavigator();

const RegisterAuctionStack = () => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator
        initialRouteName="RegisterAuction"
        screenOptions={{
            headerTitleAlign: "left",
            cardStyle:{ backgroundColor: theme.backgroundColor},
        }}>
            <Stack.Screen name="RegisterAuction" component={RegisterAuction} 
                options={{
                    headerBackTitle: false, 
                    headerTitleStyle: {fontSize: 25, fontWeight: 'bold'},
                    headerTitle: "경매 공고 등록", 
                    headerTitleAlign: 'left'}}
            />

            <Stack.Screen name="Main" component={Main} />
           
        </Stack.Navigator>
    );
}

export default RegisterAuctionStack;