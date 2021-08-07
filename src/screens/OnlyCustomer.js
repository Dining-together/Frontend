import React, { useEffect } from 'react';
import styled from "styled-components/native";
import { Alert } from 'react-native';


const Container = styled.View`
    flex: 1;
    background-color: ${({ theme}) => theme.background};
    justify-content: center;
    align-items: center;
`;

const Text = styled.Text`
    font-size: 30px;
`;


const OnlyCustomer = () => {

    useEffect(() => {
        Alert.alert(
            "", "업체는 경매 등록을 할 수 없습니다.",
            [{ text: "확인", 
            onPress: () => {} }]
        );
    } ,[]);
    return (
        <Container>
            
        </Container>
    );
};

export default OnlyCustomer;