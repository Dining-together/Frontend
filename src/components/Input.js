import React, {useState, forwardRef} from 'react';
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.View`
flex-direction: column;
width: 100%;
margin-top: 10px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme, isFocused }) => (isFocused ? theme.text : theme.label)};
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
  }))`
    background-color: ${({ theme}) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 20px 10px;
    font-size: 16px;
    border: 1px solid
      ${({ theme, isFocused }) => (isFocused ? theme.text : theme.inputBorder)};
    border-radius: 4px;
    padding-right: ${({ hasButton}) => hasButton? 22 : 5}%;
  `;

const InputContainer = styled.View` 
  width: 100%;
`;

const ButtonContainer = styled.TouchableOpacity`
  background-color: ${({theme, completed})=> completed? theme.buttonCompleted : theme.buttonBackground};
  position: absolute;
  right: 0;
  top: 0;
  bottom: 10px;
  justify-content: center;
  align-items: center;
  width: 20%;
  height: 100%;
`;

const Title = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({theme})=> theme.buttonTextColor}
`;


const InputButton = ({title, onPress, completed}) => {
  return(
    <ButtonContainer onPress={onPress} completed={completed}>
      <Title>{title}</Title>
    </ButtonContainer>
  );
};

const Input = forwardRef(
  (
    {
      label,
      value,
      onChangeText,
      onSubmitEditing,
      onBlur,
      placeholder,
      isPassword,
      returnKeyType,
      maxLength,
      hasButton,
      buttonTitle,
      onPress,
      keyboardType,
      completed,
      editable,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Container>
        <Label isFocused={isFocused}>{label}</Label>
        <InputContainer>
        <StyledTextInput
          ref={ref}
          isFocused={isFocused}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          secureTextEntry={isPassword}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="none" // iOS only
          underlineColorAndroid="transparent" // Android only
          keyboardType={keyboardType}
          hasButton={hasButton}
          editable={editable}
        />
        {hasButton && 
        <InputButton 
        title={buttonTitle} 
        onPress={onPress} 
        completed={completed}/>}
        </InputContainer>
      </Container>
    );
  }
);

Input.defaultProps = {
  onBlur: () => {},
  hasButton: false,
  buttonTitle: "",
  onPress: ()=> {},
  completed: false,
  editable: true,
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  isPassword: PropTypes.bool,
  returnKeyType: PropTypes.oneOf(['done', 'next']),
  maxLength: PropTypes.number,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  hasButton: PropTypes.bool,
  buttonTitle: PropTypes.string,
  onPress: PropTypes.func,
  keyboardType: PropTypes.string,
  completed: PropTypes.bool,
  editable: PropTypes.bool,
};

export default Input;