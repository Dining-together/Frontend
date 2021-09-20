import React,{useContext, useState, useEffect} from 'react';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {Dimensions} from "react-native";
import styled,{ThemeContext} from "styled-components/native";
import SearchStoreStack from './SearchStoreStack';
import SearchAuctionStack from './SearchAuctionStack';


const Tab = createMaterialTopTabNavigator();

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const Container = styled.View`
    height: ${HEIGHT*0.08};
    background-color: ${({ theme }) => theme.titleColor}; 
    justify-content: center;
`;

const TitleText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-left: ${WIDTH*0.15};
`;

const SearchTab = ({navigation, route}) => {
    const param = route.params.input;


    return (
        <>
        <Container>
            <TitleText>' {param} '  검색 결과</TitleText>
        </Container>   
        <Tab.Navigator 
        tabBarOptions={{
            labelStyle: {fontSize: 15, fontWeight: "bold"},
            tabStyle: {height: HEIGHT* 0.07}
        }}>
            <Tab.Screen name="공고" component={SearchAuctionStack} initialParams={{input: param}}/>
            <Tab.Screen name="업체" component={SearchStoreStack} initialParams={{input: param}}/>
        </Tab.Navigator>
        </>
    );
};

export default SearchTab;