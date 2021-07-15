import React from 'react';
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
  flex-direction: row;
  width: 100%;
  margin: 14px 0;
`;

const Label = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-right: 7px;
  width: 19%;
  margin-top: 6px;
`;

const Content = styled.Text`
  font-size: 14px;
  padding: 4px 4px 0 4px;
  margin-top: 4px;
  width: 51%;
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  background-color: ${({ theme}) => theme.background};
  color: ${({ theme }) => theme.text};
  padding: 5px 10px;
  font-size: ${({value}) => value === ""? 12 : 16}px;
  border: 1px solid;
  border-radius: 4px;
  width: 51%; 
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({theme, disabled})=> disabled? theme.buttonDisabled : theme.buttonBackground};
  border-radius: 4px;
  width: 17%;
  height: auto;
  margin-left: 20px;
  align-items: center;
  justify-content: center;

`;

const Title = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({theme})=> theme.buttonTextColor}
`;


const InfoButton = ({title, onPress, disabled}) => {
  return(
    <ButtonContainer onPress={onPress} disabled={disabled}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
};

const InfoText = ({value, onChangeText, placeholder,
  isPassword, returnKeyType, keyboardType, label, content, isChanged, 
  showButton, title, onPress, disabled, editable}) => {
  return(
    <Container>
        <Label>{label}</Label>
        {!isChanged && <Content>{content}</Content>}
        {isChanged && 
        <StyledTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={isPassword}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          editable={editable}
        />}
        {showButton &&
        <InfoButton
          title={title}
          onPress={onPress}
          disabled={disabled}
          containerStyle={{}}
        />}
       
    </Container>
  );
};

InfoText.propTypes = {
  label: PropTypes.string,
  content: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  isPassword: PropTypes.bool,
  returnKeyType: PropTypes.oneOf(['done', 'next']),
  onChangeText: PropTypes.func,
  keyboardType: PropTypes.string,
  isChanged: PropTypes.bool,
  isButton: PropTypes.bool, 
  title: PropTypes.string, 
  onPress: PropTypes.func, 
  disabled: PropTypes.bool,
};

export default InfoText;