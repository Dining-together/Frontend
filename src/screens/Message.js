import React, { useState, useEffect, useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import { SmallButton } from '../components';
import { ScrollView, Dimensions, RefreshControl } from 'react-native';
import {UrlContext, LoginContext, ProgressContext} from ".././contexts";
import SockJS from "sockjs-client";
import Stomp from 'stompjs';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const HEIGHT = Dimensions.get("screen").height;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ChatEntireCon = styled.View`
  margin-bottom: ${HEIGHT*0.07};
  background-color: ${({ theme }) => theme.background};
`;

const InputContainer = styled.View`
  height: ${HEIGHT*0.07};
  bottom: 0;
  position: absolute;
  flex-direction: row;
`;

const ChatInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
    width: 80%;
    height: 95%;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-size: 16px;
    border: 1px solid;
    padding: 10px; 0;
`;

const OtherchatContainer = styled.View`
  background-color: ${({ theme }) => theme.chatTextColor};
  margin-bottom: 5px;
  flex-direction: row;
  border: 0.8px solid;
  border-radius: 4px;
  padding: 3%;
  margin: 3%;
  margin-top: 1px;
  align-self: flex-start;
  max-width: 60%;
`;

const OwnchatContainer = styled.View`
  background-color: ${({ theme }) => theme.chatTextColor};
  margin-bottom: 5px;
  flex-direction: row;
  border: 0.8px solid;
  border-radius: 4px;
  padding: 3%;
  margin: 3%;
  align-items: flex-end;
  justify-content: flex-end;
  align-self: flex-end;
  max-width: 60%;
`;

const ChatText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
`;

const ChatContainer  = styled.View`
  flex-direction: row;
  justify-content: ${({ style }) => style ? "flex-end" : "flex-start"};
`;

const OtherEntireCon = styled.View`

`;

const TimeContainer  = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 3%;
`;

const TimeText = styled.Text`
  font-size: 14px;
  justify-content: flex-end;
  align-self: flex-end;
`;

const UserNameText = styled.Text`
  font-size: 14px;
  margin-left: 3%;
`;

const OwnChat = ({item: {id, sender, message} }) => {
  return (
    <ChatContainer style = {true}>
      <TimeContainer>
        <TimeText></TimeText>
      </TimeContainer>
      <OwnchatContainer>
        <ChatText>{message}</ChatText>
      </OwnchatContainer>
  </ChatContainer>
  );
};

const OtherChat = ({item: {id, sender, message} }) => {
  return (
    <OtherEntireCon>
    <UserNameText>{sender}</UserNameText>
      <ChatContainer>
        <OtherchatContainer>
          <ChatText>{message}</ChatText>
        </OtherchatContainer>
        <TimeContainer>
          <TimeText></TimeText>
        </TimeContainer>
      </ChatContainer>
      </OtherEntireCon>
  );
};


const Message = ({navigation, route}) => {

  const [messages, setMessages] = useState([]); // 모든 채팅z  
  const [filteredMessages, setFilteredMessages] = useState([]); 
  const [text, setText] = useState("");
  const {curl} = useContext(UrlContext);
  const {token, mode, id} = useContext(LoginContext);
  const {spinner} = useContext(ProgressContext);
  const [refreshing, setRefreshing] = useState(false);

  const roomId = route.params.roomId;
  const sender = route.params.sender;
  
  const sock = new SockJS(curl+"/chat/chatting");
  const ws = Stomp.over(sock);

  
  const connect = async(list) => {
    console.log("list");
    console.log(list);
    console.log("message");
    console.log(messages);
    var data = {
      type:'ENTER',
      roomId: roomId,
      sender: sender,
      message: "",
    };
    try{
    spinner.start()
    ws.connect(
      {}, 
      () => {
        console.log("STOMP Connection");
        ws.subscribe("/chat/sub/room/"+roomId, (message) => {
            var content = JSON.parse(message.body);
            let mList = [];
            if(messages.length===0){
              mList = list;
            }else {
              mList = messages;
            }
            mList.push(content)
            setMessages(filterData(mList));
        });
        ws.send("/chat/pub/message", {}, JSON.stringify(data));
      });
    }catch(error) {
      alert("서버 연걸에 실패하였습니다. 다시 접속해주세요.");
    }finally{
      spinner.stop()
    }
};

  

const _getMessage = async (id) => {
  var fixedUrl = curl+"/chat/room/"+roomId;

  let options = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-AUTH-TOKEN' : token,
    },
};    

  try {
      let response = await fetch(fixedUrl, options);
      let res = await response.json();
      let mList = filterData(res.list)
      setMessages(mList)
      return mList;
      } catch (error) {
      console.error(error);
  }    
};


  useEffect(() => {
    _getMessage()
    .then((list) => connect(list));
    return () => {
      if(ws){
        ws.disconnect(() => {
          ws.unsubscribe('sub-0');
        });
      }
    }
  }, []);

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [])


  
  const filterData = (list) => {
     let filtered = list.filter((l) => l.type === "TALK");
     return filtered;
  };

    const waitForConnection = (ws, callback) => {
      reconnect++;
      console.log("연결 상태는?");
      console.log(ws.ws.readyState);
      console.log("재연결 횟수는?");
      console.log(reconnect)
      if(reconnect >= 50){
        alert("오류가 발생하였습니다. 잠시 후 다시 전송해주세요. ");
        console.log(messages)
        return
      }
      setTimeout(
        function() {
          if(ws.ws.readyState=== 1){
            callback();
          }else {
            waitForConnection(ws, callback);
          }
        }, 
        100*10 
      );
    }


  var reconnect = 0;

  const _handleMessageSend = () => {
      reconnect = 0;
      
      var newMessage = {
        type: "TALK",
        roomId: roomId,
        message: text,
        sender: sender,
      };

        
        waitForConnection(ws, function () {
          ws.send("/chat/pub/message", {}, JSON.stringify(newMessage));
          console.log(ws.ws.readyState);
          setText("");
        });
  };

  return (
    <KeyboardAwareScrollView
    contentContainerStyle={{flex: 1}}
    extraHeight={20}>
    <Container>
      <ChatEntireCon>
      <ScrollView
      refreshControl ={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      >
        {messages.map(f => {
          if(f.sender === sender){
            return (<OwnChat item={f} key={f.id}/>)
          }else{
            return (<OtherChat item={f} key={f.id}/>)
          }
        })}
      </ScrollView>
      </ChatEntireCon>
      <InputContainer>
        <ChatInput
          value={text}
          onChangeText = { text => setText(text) }
          onSubmitEditing = {_handleMessageSend}
        />
        <SmallButton 
          title="전송"
          containerStyle={{ width: "20%",}}
          onPress={_handleMessageSend}
          />
      </InputContainer>
    </Container>
    </KeyboardAwareScrollView>
  );
};

export default Message;