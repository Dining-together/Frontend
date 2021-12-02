import React from 'react';
import styled from "styled-components/native";
import PropTypes from "prop-types";
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const Icon = styled.Image`
    width: 50px;
    height: 50px;
    margin-bottom: 5px;
`;

const Title = styled.Text`
    font-size: 16px;
    text-align: center;
    margin-top: 2px;
`;

const MypageButton = ({ title, name, source, onPress, white }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name={name} size={60} color={white? theme.background :theme.MypageIconColor} />
            <Title>{title}</Title>
        </TouchableOpacity>
    );
};



MypageButton.propTypes = {
    onPress: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.string,
    white: PropTypes.bool,
};

MypageButton.defaultProps = {
    white: false,
};


export default MypageButton;