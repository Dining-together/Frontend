import React from 'react';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {AucLogManage, BidLogManage} from "../screens";
import {Dimensions} from "react-native";

const HEIGHT = Dimensions.get("screen").width;

const Tab = createMaterialTopTabNavigator();

const AucLogManageTab = ({route}) => {

    return (
        <Tab.Navigator
        tabBarOptions={{
            labelStyle: {fontSize: 15, fontWeight: "bold"},
            tabStyle: {height: HEIGHT* 0.135}
        }}>
            <Tab.Screen name="AucLogManage" component={AucLogManage} options={{tabBarLabel: "공고 조회수"}} 
            initialParams={{auctionId : route.params.auctionId}}/>
            <Tab.Screen name="BidLogManage" component={BidLogManage} options={{tabBarLabel: "공고 입찰 조회수"}} 
            initialParams={{auctionId : route.params.auctionId}}/>
        </Tab.Navigator>
    );
};

export default AucLogManageTab; 