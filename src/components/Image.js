//회원가입 이미지 등록
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styled from "styled-components/native";
import PropTypes from "prop-types";
import SmallButton from "./SmallButton";

const Container = styled.View`
  flex-direction: column;
  width: 100%;  
`;

const StyledImage = styled.Image`
  margin-top: 10px;
  width: 100px;
  height: 100px;
`;

const Image = ({ title, url, onChangeImage, showImage, containerStyle }) => {

  const [uploaded, setUploaded] = useState(false);

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
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        onChangeImage(result.uri);
        setUploaded(true);
      }


    } catch (e) {
      Alert.alert('사진 오류', e.message);
    }
  };
  return (
    <Container style={containerStyle}>
      {showImage && url && <StyledImage source={{ uri: url }} />}
      <SmallButton title={title} onPress={_handleEditButton} uploaded={uploaded} />
    </Container>

  );
};
Image.defaultProps = {
  onChangeImage: () => { },
}

Image.propTypes = {
  label: PropTypes.string,
  onChangeImage: PropTypes.func,
  uri: PropTypes.string,
}

export default Image;