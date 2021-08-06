import React, {useState, useContext} from 'react';
import styled from "styled-components/native";
import {Image, Button} from '../../components';
import {View} from 'react-native';
import {Dimensions} from "react-native";
import {UrlContext, ProgressContext, LoginContext} from "../../contexts";

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
    background-color: ${({ theme }) => theme.background};
    flex: 1;
    padding: 6%;
`
const DocumentImage = styled.Image`
    margin-top: 3%;
    width: ${WIDTH*0.4}px;
    height: ${HEIGHT*0.3}px;
`;


const DocumentRegister = () => {

    const {url} = useContext(UrlContext);
    const {spinner} = useContext(ProgressContext);
    const {token, setDoc} = useContext(LoginContext);

    const [document, setDocument] = useState();

    // 서류 등록 post
    const postApi = async () => {
        let fixedUrl = url+'/member/store/document'; 

        let filename = document.split('/').pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('file', { uri: document, name: filename, type: type});

        console.log(formData);

        let options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'X-AUTH-TOKEN' : token,
            },
            body: formData,
        };
        try {
            let response = await fetch(fixedUrl, options);
            let res = await response.json();

            console.log(res);
            return res["success"];

        } catch (error) {
            console.error(error);
        }

    }

    const _documentButtonPress = async() => {
        try{
            spinner.start();

            const result = await postApi();
            if(result){
                alert("서류 등록 되었습니다.")
                setDoc(true);
            }
            else{
                alert("서류 등록을 다시 시도해주세요.");
            }

        }catch(e){
                console.log("Error", e.message);
        }finally{
            spinner.stop();
        }

    }

    return (
        <Container>
            <Image title="사진 첨부"
                    url={document}
                    onChangeImage={url => setDocument(url)}
                    containerStyle={{ width: '70%',}}
            />
           
           {document && <DocumentImage source = {{uri: document}} />}
            <View style={{ alignItems:'center'}}>
                <Button title="저장" onPress={_documentButtonPress} containerStyle={{ width: '70%',}}/>
            </View>
        
        </Container>
    );
};

export default DocumentRegister;