import React from 'react';
import styled from "styled-components/native";
import PropTypes from "prop-types";

const Container = styled.TouchableOpacity`
    background-color: ${({theme,uploaded})=> uploaded? theme.buttonCompleted : theme.buttonBackground};
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    width: 40%;
    height: auto;
    padding: 10px;
    opacity: ${({disabled}) => (disabled? 0.5 : 1)};
`;

const Title = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: ${({theme, isFilled}) => isFilled? theme.buttonTextColor : theme.buttonUnfilledTitle };
`;

const SmallButton = ({showButton, containerStyle, title, onPress, isFilled, disabled, uploaded}) => {
    return (
        <Container 
        style={containerStyle} 
        onPress={onPress} 
        isFilled={isFilled} 
        disabled={disabled}
        uploaded={uploaded}
        >
            <Title isFilled={isFilled}>{title}</Title>            
        </Container>
    );
};

SmallButton.defaultProps ={
    isFilled: true,
};

SmallButton.propTypes = {
    containerStyle: PropTypes.object,
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    isFilled: PropTypes.bool,
    disabled: PropTypes.bool,
};


export default SmallButton;