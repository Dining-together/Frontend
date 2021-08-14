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

const LogManage = () => {
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
                src="http://118.67.133.150:5601/app/dashboards#/view/7c7144b0-fc60-11eb-b3ad-433340f88220?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-24h,to:now))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'2cb520e0-fc60-11eb-b3ad-433340f88220',key:someField.storeId,negate:!f,params:(query:'22'),type:phrase),query:(match_phrase:(someField.storeId:'22'))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'2cb520e0-fc60-11eb-b3ad-433340f88220',key:someField.actionType.keyword,negate:!f,params:(query:view),type:phrase),query:(match_phrase:(someField.actionType.keyword:view)))),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:''),timeRestore:!f,title:'store:view',viewMode:view)&hide-filter-bar=true" ></iframe>
                ` }}
            />    
        </Container>
  );
};
export default LogManage;  
