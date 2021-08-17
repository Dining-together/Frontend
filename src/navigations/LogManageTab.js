import React from 'react';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {LogManage, ReviewLog} from "../screens";
import {Dimensions} from "react-native";

const HEIGHT = Dimensions.get("screen").width;

const Tab = createMaterialTopTabNavigator();

const LogManageTab = ({route}) => {

    return (
        <Tab.Navigator
        tabBarOptions={{
            labelStyle: {fontSize: 15, fontWeight: "bold"},
            tabStyle: {height: HEIGHT* 0.135}
        }}>
            <Tab.Screen name="LogManage" component={LogManage} options={{tabBarLabel: "업체 조회수"}} />
            <Tab.Screen name="ReviewLog" component={ReviewLog} options={{tabBarLabel: "업체 리뷰"}} />
        </Tab.Navigator>
    );
};

export default LogManageTab;  
