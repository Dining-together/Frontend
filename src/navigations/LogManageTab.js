import React from 'react';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {LogManage , AucLogManage, BidLogManage} from "../screens";
import {Dimensions} from "react-native";

const HEIGHT = Dimensions.get("screen").width;

const Tab = createMaterialTopTabNavigator();

const BidManageTab = ({route}) => {

    return (
        <Tab.Navigator
        tabBarOptions={{
            labelStyle: {fontSize: 15, fontWeight: "bold"},
            tabStyle: {height: HEIGHT* 0.135}
        }}>
            <Tab.Screen name="LogManage" component={LogManage} options={{tabBarLabel: "업체 조회수"}} />
            <Tab.Screen name="BidLogManage" component={BidLogManage} options={{tabBarLabel: "공고 입찰"}} />
            <Tab.Screen name="AucLogManage" component={AucLogManage} options={{tabBarLabel: "공고 조회수"}} />
        </Tab.Navigator>
    );
};

export default BidManageTab; 