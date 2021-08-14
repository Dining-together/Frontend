import React from 'react';
import styled from 'styled-components/native';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const WIDTH = Dimensions.get("screen").width;
const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const BidLogManage = () => {
    return (
        <Container>
            <WebView 
              originWhitelist={["*"]}
              scalesPageToFit={true}
              bounces={false}
              javaScriptEnabled
              style={{ height: HEIGHT*1.5, width: WIDTH*2.3 }}
              source={{ 
                html: `<iframe height="${HEIGHT*0.85}" width="${WIDTH}"
                src="http://118.67.133.150:5601/app/dashboards#/view/6c16f310-fc62-11eb-b3ad-433340f88220?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-24h,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:ac62d3f0-fc60-11eb-b3ad-433340f88220,key:someField.actionType.keyword,negate:!f,params:(query:bid),type:phrase),query:(match_phrase:(someField.actionType.keyword:bid))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:ac62d3f0-fc60-11eb-b3ad-433340f88220,key:someField.auctionId,negate:!f,params:(query:'27'),type:phrase),query:(match_phrase:(someField.auctionId:'27')))),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!f,title:'auction:bid',viewMode:view)&hide-filter-bar=true"></iframe>
                ` }}
            />    
        </Container>
  );
};
export default BidLogManage;  
