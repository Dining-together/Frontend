import React, { useState, useContext } from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemeContext } from "styled-components";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const PayAddContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.chatTextColor};
  flex-direction: row;
  border: 0.2px solid;
  border-radius: 4px;
  padding: 6%;
  margin: 6%;
  justify-content: center;
`;


const PayText = styled.Text`
  font-size: 14px;
`;

const PayDetailContainer = styled.View`
  background-color: ${({ theme }) => theme.chatTextColor};
  flex-direction: row;
  border: 0.3px solid;
  border-radius: 4px;
  padding: 6%;
  margin: 3% 6% 3% 6%;
  justify-content: center;
`;

// 결제 수단 등록
const _handlePayRegister = () => {};

const PayManage = () => {

    const theme = useContext(ThemeContext);

    // 추후 데이터 받아오고 수정

    return (
        <Container>
            <KeyboardAwareScrollView
            extraScrollHeight={20}>
                {/* 결제등록 */}
                <PayAddContainer onPress={_handlePayRegister}>
                    <MaterialIcons name='add-circle-outline' size={20} color={theme.titleColor} />
                </PayAddContainer>

                {/* 결제정보 */}
                <PayDetailContainer>
                    <PayText>결제수단정보</PayText>
                </PayDetailContainer>
                <PayDetailContainer>
                    <PayText>결제수단정보</PayText>
                </PayDetailContainer>
            </KeyboardAwareScrollView>
        </Container>
  );
};

export default PayManage; 