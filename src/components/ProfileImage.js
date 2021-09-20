import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { MaterialIcons } from'@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert, Dimensions} from 'react-native';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    align-self: center;
    margin-bottom: 20px;
    flex-direction: row;
`;

const StyledImage = styled.Image`
    width: ${WIDTH*0.25};
    height: ${WIDTH*0.25};
    border-radius: 50px;
    background-color: ${({theme}) => theme.profileBackground};
`;

const ButtonContainer = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.imageButtonBackground};
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
`;

const ButtonIcon = styled(MaterialIcons).attrs({
    name: 'photo-camera',
    size: 22,
})`
    color: ${({theme}) => theme.imageButtonIcon};
`;

const PhotoButton = ({onPress}) => {
    return(
        <ButtonContainer onPress={onPress}>
            <ButtonIcon />
        </ButtonContainer>
    );
};

const ProfileImage = ({ url, imageStyle, showButton, onChangeImage }) => {

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('사진 권한 허가가 필요합니다');
            }
          }
        })();
    }, []);

    const _handleEditButton = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1,1],
                quality: 1,
              });

              if(!result.cancelled) { 
                onChangeImage(result.uri);
              }
        } catch(e) {
            Alert.alert('사진 오류', e.message);
        }
      };

    return(
        <Container>
            <StyledImage source={{ uri: url }} style={imageStyle} />
            {showButton && <PhotoButton onPress={_handleEditButton}/>}
        </Container>
    );
};

ProfileImage.defaultProps = {
    onChangeImage: () => {},
  }

ProfileImage.prototype = {
    uri: PropTypes.string,
    imageStyle: PropTypes.object,
    showButton: PropTypes.bool,
    onChangeImage: PropTypes.func,
}

export default ProfileImage;