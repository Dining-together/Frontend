import React,{useEffect, useContext, useState} from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import {  ProgressContext, UrlContext } from '../../contexts';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const AucLogManage = ({route}) => {
  
  let id = route.params.auctionId;
  const {url} = useContext(UrlContext);
  const {spinner} = useContext(ProgressContext);
  const [data, setData] = useState("");

  const getApi = async () => {

    let fixedUrl = url+"/search/log/auctionview?auctionId="+id;
    console.log(fixedUrl);

    let options = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },

    };
    try {
        spinner.start();
        let response = await fetch(fixedUrl, options);
        let res = await response.json();
        
        setData(res.data);

        return res["success"];

      } catch (error) {
        console.error(error);
      } finally {
        spinner.stop();
      }
}


useEffect(() => {
  getApi();
},[]);
  return (
      <Container>
        <WebView 
          originWhitelist={["*"]}
          scalesPageToFit={true}
          bounces={false}
          javaScriptEnabled
          style={{ height: HEIGHT*1.5, width: WIDTH*2.3 }}
          source={{ 
          html: `${data}` }}
        />    
      </Container>
  );
};
export default AucLogManage;  
